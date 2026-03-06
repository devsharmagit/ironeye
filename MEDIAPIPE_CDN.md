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

No imports needed! Just use the globals directly:

```typescript
// src/hooks/usePoseDetection.ts
const pose = new Pose({
  locateFile: (file: string) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({ image: videoElement });
  },
});
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

## References

- [MediaPipe Pose Documentation](https://google.github.io/mediapipe/solutions/pose.html)
- [MediaPipe CDN Usage](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js)
