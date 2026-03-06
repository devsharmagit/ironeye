# 🚀 IronEye Quick Start

Get IronEye running in 3 simple steps:

## Step 1: Install Dependencies

```bash
npm install
```

This installs all required packages including:
- React and TypeScript
- MediaPipe Pose detection
- Tailwind CSS for styling

**Note:** Installation may take 2-3 minutes due to MediaPipe packages.

## Step 2: Start the Development Server

```bash
npm run dev
```

You should see:
```
VITE v8.0.1  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

## Step 3: Open in Browser

1. Open `http://localhost:5173` in Chrome or Edge (recommended)
2. Click "Allow" when prompted for camera access
3. Position yourself side-on to the camera
4. Start doing push-ups!

## 🎯 What to Expect

- **Loading**: MediaPipe model loads in 2-3 seconds
- **Green skeleton**: Appears when pose is detected
- **Red dots**: Mark your body joints
- **Angle display**: Shows your elbow angle in real-time
- **Counter**: Increments when you complete a full rep

## ✅ Success Indicators

You'll know it's working when:
- ✅ Video feed shows your camera
- ✅ Green skeleton tracks your body
- ✅ Angle updates as you move
- ✅ State changes between UP/DOWN
- ✅ Counter increments on complete reps

## ❌ Troubleshooting

### Camera Not Working?
```bash
# Check if camera is being used by another app
# Grant camera permissions in browser settings
# Try refreshing the page
```

### Dependencies Not Installing?
```bash
# Clear npm cache and try again
npm cache clean --force
npm install
```

### Build Errors?
```bash
# Ensure you have Node.js 18+ installed
node --version

# If version is old, update Node.js
# Then reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🎨 Customization

Want to adjust the sensitivity?

Edit `src/utils/repCounter.ts`:
```typescript
const UP_THRESHOLD = 160;    // Increase for stricter "up" position
const DOWN_THRESHOLD = 90;   // Decrease for deeper push-ups
```

## 📚 Next Steps

- Read `SETUP.md` for detailed setup information
- Check `TESTING.md` for testing guidelines
- See `CONTRIBUTING.md` to contribute features
- Review `README.md` for technical details

## 💪 Ready to Count!

That's it! You're ready to track your push-ups with IronEye.

**Pro tip:** Position yourself side-on to the camera for best results!
