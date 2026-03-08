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
  const onResultsRef = useRef(onResults);
  const [isLoading, setIsLoading] = useState(true);

  // Keep the ref updated without triggering re-runs
  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  useEffect(() => {
    if (!videoElement) return;

    let cancelled = false; // guard against stale async init

    const pose = new (window as any).Pose({
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

    // Use the ref — never changes identity
    pose.onResults((results: any) => onResultsRef.current(results));
    poseRef.current = pose;

    const camera = new (window as any).Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current && !cancelled) {
          await poseRef.current.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720,
    });

    cameraRef.current = camera;
    camera.start().then(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
      cameraRef.current?.stop();
      // Delay close slightly — gives WASM time to finish any in-flight frame
      setTimeout(() => poseRef.current?.close(), 300);
    };
  }, [videoElement]); // ← onResults removed from deps, handled via ref

  return { isLoading };
}
