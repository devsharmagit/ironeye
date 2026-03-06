import { useState, useCallback } from 'react';
import { Results } from '@mediapipe/pose';
import { useCamera } from './hooks/useCamera';
import { usePoseDetection } from './hooks/usePoseDetection';
import { VideoCanvas } from './components/VideoCanvas';
import { Counter } from './components/Counter';
import { StatusBadge } from './components/StatusBadge';
import { calculateAngle } from './utils/angles';
import { updateRepCount, PushUpState } from './utils/repCounter';
import './App.css';

function App() {
  const [repCount, setRepCount] = useState(0);
  const [state, setState] = useState<PushUpState>('IDLE');
  const [currentAngle, setCurrentAngle] = useState(0);
  const [results, setResults] = useState<Results | null>(null);

  const { videoRef, isReady, error } = useCamera();

  const handleResults = useCallback((results: Results) => {
    setResults(results);

    if (results.poseLandmarks) {
      const landmarks = results.poseLandmarks;

      // Extract left arm landmarks (shoulder, elbow, wrist)
      const leftShoulder = { x: landmarks[11].x, y: landmarks[11].y };
      const leftElbow = { x: landmarks[13].x, y: landmarks[13].y };
      const leftWrist = { x: landmarks[15].x, y: landmarks[15].y };

      // Calculate elbow angle
      const angle = calculateAngle(leftShoulder, leftElbow, leftWrist);
      setCurrentAngle(angle);

      // Update rep count based on angle and state
      setRepCount((prevCount) => {
        setState((prevState) => {
          const { state: newState, count: newCount } = updateRepCount(
            angle,
            prevState,
            prevCount
          );
          if (newCount !== prevCount) {
            return newState;
          }
          return newState;
        });
        return prevCount;
      });

      // Update state separately to ensure proper state transitions
      setState((prevState) => {
        const { state: newState, count: newCount } = updateRepCount(
          angle,
          prevState,
          repCount
        );
        if (newCount > repCount) {
          setRepCount(newCount);
        }
        return newState;
      });
    }
  }, [repCount]);

  const { isLoading } = usePoseDetection(
    videoRef.current,
    handleResults
  );

  const handleReset = () => {
    setRepCount(0);
    setState('IDLE');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="py-6 px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👁️</span>
            <h1 className="text-2xl font-bold">IronEye</h1>
          </div>
          <p className="text-gray-400">Real-time Push-up Counter</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-6">
            <p className="text-blue-200">Loading MediaPipe Pose model...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }}
                playsInline
              />
              {isReady && <VideoCanvas videoRef={videoRef} results={results} />}
              {!isReady && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400">Initializing camera...</p>
                </div>
              )}
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Tips for best results:</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Position yourself side-on to the camera</li>
                <li>• Ensure good lighting</li>
                <li>• Keep your full body in frame</li>
                <li>• Maintain proper push-up form</li>
              </ul>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <Counter count={repCount} onReset={handleReset} />
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <StatusBadge state={state} angle={currentAngle} />
            </div>
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">How it works</h3>
              <div className="text-sm text-gray-300 space-y-2">
                <p>IronEye tracks your elbow angle in real-time:</p>
                <div className="space-y-1 pl-4">
                  <p>• <span className="text-green-400">UP</span>: Angle &gt; 160°</p>
                  <p>• <span className="text-blue-400">DOWN</span>: Angle &lt; 90°</p>
                </div>
                <p className="pt-2">Complete a full UP → DOWN → UP cycle to count a rep!</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 mt-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
          <p>Built with 💪 by Dev Sharma | Powered by MediaPipe</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
