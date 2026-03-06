declare module '@mediapipe/pose' {
  export interface NormalizedLandmark {
    x: number;
    y: number;
    z: number;
    visibility?: number;
  }

  export interface Results {
    poseLandmarks: NormalizedLandmark[];
    poseWorldLandmarks: NormalizedLandmark[];
    segmentationMask?: ImageData;
    image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement;
  }

  export interface PoseConfig {
    locateFile?: (file: string) => string;
  }

  export interface PoseOptions {
    modelComplexity?: 0 | 1 | 2;
    smoothLandmarks?: boolean;
    enableSegmentation?: boolean;
    smoothSegmentation?: boolean;
    minDetectionConfidence?: number;
    minTrackingConfidence?: number;
  }

  export class Pose {
    constructor(config: PoseConfig);
    setOptions(options: PoseOptions): void;
    onResults(callback: (results: Results) => void): void;
    send(inputs: { image: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement }): Promise<void>;
    close(): void;
  }

  export const POSE_CONNECTIONS: Array<[number, number]>;
  export const POSE_LANDMARKS: Record<string, number>;
}

declare module '@mediapipe/camera_utils' {
  export interface CameraOptions {
    onFrame: () => Promise<void> | void;
    width?: number;
    height?: number;
  }

  export class Camera {
    constructor(videoElement: HTMLVideoElement, options: CameraOptions);
    start(): Promise<void>;
    stop(): void;
  }
}

declare module '@mediapipe/drawing_utils' {
  export interface DrawingOptions {
    color?: string;
    lineWidth?: number;
    radius?: number;
    fillColor?: string;
  }

  export function drawConnectors(
    ctx: CanvasRenderingContext2D,
    landmarks: Array<{ x: number; y: number }>,
    connections: Array<[number, number]>,
    options?: DrawingOptions
  ): void;

  export function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: Array<{ x: number; y: number }>,
    options?: DrawingOptions
  ): void;
}
