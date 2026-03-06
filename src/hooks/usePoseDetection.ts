import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to initialize MediaPipe Pose and process video frames
 * Uses global Pose and Camera from CDN scripts loaded in index.html
 */
export function usePoseDetection(
  videoElement: HTMLVideoElement | null,
  onResults: (results: any) => void
) {
  const poseRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoElement) return;

    // Pose and Camera are global — loaded from CDN in index.html
    const pose = new Pose({
      locateFile: (file: string) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResults);
    poseRef.current = pose;

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720,
    });

    cameraRef.current = camera;
    camera.start().then(() => setIsLoading(false));

    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
    };
  }, [videoElement, onResults]);

  return { isLoading };
}
