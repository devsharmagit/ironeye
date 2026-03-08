# MediaPipe CDN Implementation

## Why CDN Instead of NPM?

The `@mediapipe/*` npm packages are UMD modules that don't work properly with Vite's ESM bundler. This causes build errors and import issues.

**Solution:** Load MediaPipe via CDN scripts, which attach globals to `window` before React boots. Vite never touches them, avoiding all ESM/CJS conflicts.

## Implementation

### 1. CDN Scripts in index.html

```html
<!-- MediaPipe via CDN — bypasses Vite bundler entirely -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
```

These scripts load **before** your React app, making `Pose`, `Camera`, `drawConnectors`, `drawLandmarks`, and `POSE_CONNECTIONS` available as globals.

### 2. TypeScript Declarations

`src/mediapipe.d.ts` declares the globals so TypeScript doesn't complain:

```typescript
declare const Pose: any;
declare const Camera: any;
declare const drawConnectors: any;
declare const drawLandmarks: any;
declare const POSE_CONNECTIONS: any;
```

### 3. Usage in Code

No imports needed! Just use the globals directly with proper ref stabilization:

```typescript
// src/hooks/usePoseDetection.ts
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
```

```typescript
// src/components/VideoCanvas.tsx
drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
  color: '#00FF00',
  lineWidth: 4
});
```

## Benefits

✅ **No build errors** - Vite never tries to bundle MediaPipe  
✅ **Smaller bundle** - MediaPipe loaded separately from CDN  
✅ **Browser caching** - CDN scripts cached across sites  
✅ **Official approach** - This is how MediaPipe intends browser usage  
✅ **Simpler setup** - No npm packages to manage  
✅ **Stable callbacks** - Uses refs to prevent unnecessary re-renders  
✅ **Proper cleanup** - Guards against stale async operations  

## Package.json

MediaPipe is **not** in dependencies:

```json
{
  "dependencies": {
    "react": "^19.2.4",
    "react-dom": "^19.2.4"
  }
}
```

## Build Output

Clean build with no MediaPipe bundling issues:

```
✓ 24 modules transformed
✓ built in 266ms
dist/index.html                   0.91 kB
dist/assets/index-Bxxo2UPE.css    8.33 kB
dist/assets/index-BwHwuUq1.js   196.92 kB
```

## Development

Works seamlessly in dev mode:

```bash
npm run dev
```

The CDN scripts load in the browser, and everything works as expected.

## Production

The built `dist/index.html` includes the CDN script tags, so MediaPipe loads from CDN in production too.

## Troubleshooting

### "Pose is not defined" error

Make sure the CDN scripts are in `index.html` **before** the React app script:

```html
<!-- MediaPipe CDN scripts FIRST -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"></script>

<!-- React app AFTER -->
<script type="module" src="/src/main.tsx"></script>
```

### TypeScript errors

Ensure `src/mediapipe.d.ts` exists with the global declarations.

### Slow initial load

MediaPipe WASM files are ~2-3MB and load on first use. This is normal and happens with both CDN and npm approaches.

## Performance Optimizations

### Callback Stabilization

The hook uses a ref pattern to prevent unnecessary re-renders:

```typescript
const onResultsRef = useRef(onResults);

// Update ref without triggering effect re-run
useEffect(() => {
  onResultsRef.current = onResults;
}, [onResults]);

// Use ref in pose.onResults
pose.onResults((results: any) => onResultsRef.current(results));
```

This prevents the MediaPipe initialization from re-running every time the parent component re-renders.

### Cleanup Guards

The hook uses a `cancelled` flag to prevent state updates after unmount:

```typescript
let cancelled = false;

camera.start().then(() => {
  if (!cancelled) setIsLoading(false);
});

return () => {
  cancelled = true;
  cameraRef.current?.stop();
  setTimeout(() => poseRef.current?.close(), 300);
};
```

The 300ms delay before closing Pose gives WASM time to finish any in-flight frames.

## References

- [MediaPipe Pose Documentation](https://google.github.io/mediapipe/solutions/pose.html)
- [MediaPipe CDN Usage](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js)
