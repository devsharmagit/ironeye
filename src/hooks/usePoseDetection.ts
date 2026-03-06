import { useEffect, useRef, useState } from 'react';
import { Pose } from '@mediapipe/pose';
import type {Results} from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

/**
 * Custom hook to initialize MediaPipe Pose and process video frames
 */
export function usePoseDetection(
  videoElement: HTMLVideoElement | null,
  onResults: (results: Results) => void
) {
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoElement) return;

    const pose = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    pose.onResults(onResults);

    poseRef.current = pose;

    // Initialize camera
    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({ image: videoElement });
        }
      },
      width: 1280,
      height: 720
    });

    cameraRef.current = camera;

    camera.start().then(() => {
      setIsLoading(false);
    });

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, [videoElement, onResults]);

  return { isLoading };
}
