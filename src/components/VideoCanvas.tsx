import { useEffect, useRef } from 'react';
import * as poseModule from '@mediapipe/pose';
import * as drawingUtils from '@mediapipe/drawing_utils';

const { POSE_CONNECTIONS } = poseModule;
const { drawConnectors, drawLandmarks } = drawingUtils;

export type Results = poseModule.Results;

interface VideoCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  results: Results | null;
}

export function VideoCanvas({ videoRef, results }: VideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !results || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pose landmarks and connections
    if (results.poseLandmarks) {
      drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: '#00FF00',
        lineWidth: 4
      });
      drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 2,
        radius: 6
      });
    }
  }, [results, videoRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ transform: 'scaleX(-1)' }}
    />
  );
}
