# IronEye Setup Guide

## Quick Start

Follow these steps to get IronEye running on your machine:

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React 19 and React DOM
- MediaPipe Pose, Camera Utils, and Drawing Utils
- Tailwind CSS for styling
- TypeScript and Vite for development

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Grant Camera Permissions

When you first open the app, your browser will ask for camera access. Click "Allow" to enable the push-up counter.

## Browser Compatibility

IronEye works best on:
- Chrome 90+ (recommended)
- Edge 90+
- Firefox 88+
- Safari 14.1+

**Note:** Chrome and Edge provide the best performance for MediaPipe WASM execution.

## Usage Tips

1. **Camera Position**: Position yourself side-on to the camera so your full body is visible
2. **Lighting**: Ensure good lighting for better pose detection
3. **Distance**: Stand 6-8 feet from the camera
4. **Form**: Maintain proper push-up form for accurate counting

## Troubleshooting

### Camera Not Working
- Check browser permissions in Settings
- Ensure no other app is using the camera
- Try refreshing the page

### Slow Performance
- Close other browser tabs
- Use Chrome or Edge for better WASM performance
- Ensure good lighting to help the pose detection

### Inaccurate Counting
- Adjust your position to be more side-on
- Ensure your full arm is visible
- Maintain consistent form throughout the movement

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Project Structure

```
src/
├── components/          # React components
│   ├── VideoCanvas.tsx  # Video feed with skeleton overlay
│   ├── Counter.tsx      # Rep counter display
│   └── StatusBadge.tsx  # UP/DOWN state indicator
├── hooks/              # Custom React hooks
│   ├── useCamera.ts    # Camera access management
│   └── usePoseDetection.ts  # MediaPipe integration
├── utils/              # Core logic
│   ├── angles.ts       # Angle calculation
│   └── repCounter.ts   # State machine for rep counting
└── types/              # TypeScript declarations
    └── mediapipe.d.ts  # MediaPipe type definitions
```

## How It Works

1. **Camera Access**: `useCamera` hook requests webcam access
2. **Pose Detection**: MediaPipe Pose detects 33 body landmarks in real-time
3. **Angle Calculation**: Elbow angle is computed from shoulder-elbow-wrist landmarks
4. **State Machine**: Tracks UP/DOWN transitions based on angle thresholds
5. **Rep Counting**: Increments counter on complete UP → DOWN → UP cycle

## Next Steps

- Customize angle thresholds in `src/utils/repCounter.ts`
- Add new exercises by modifying the landmark logic
- Implement session history and analytics
- Add audio feedback on rep completion
