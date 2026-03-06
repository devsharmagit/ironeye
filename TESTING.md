# Testing IronEye

## Manual Testing Checklist

### Initial Setup
- [ ] Run `npm install` successfully
- [ ] Run `npm run dev` and server starts
- [ ] Open `http://localhost:5173` in browser
- [ ] No console errors on page load

### Camera Access
- [ ] Browser prompts for camera permission
- [ ] Video feed appears after granting permission
- [ ] Video is mirrored (selfie view)
- [ ] MediaPipe loading message appears briefly

### Pose Detection
- [ ] Green skeleton overlay appears on body
- [ ] Red landmark dots visible on joints
- [ ] Skeleton tracks body movement smoothly
- [ ] Elbow angle updates in real-time

### Rep Counting
- [ ] Start in standing/plank position (UP state)
- [ ] Lower into push-up (state changes to DOWN)
- [ ] Push back up (state changes to UP, counter increments)
- [ ] Counter increments only on complete reps
- [ ] Reset button clears counter to 0

### UI Elements
- [ ] Header displays "IronEye" with eye emoji
- [ ] Counter shows current rep count
- [ ] Status badge shows UP/DOWN/IDLE state
- [ ] Angle display updates in real-time
- [ ] Tips section visible below video
- [ ] "How it works" panel explains thresholds

### Edge Cases
- [ ] Works when partially out of frame (graceful degradation)
- [ ] Handles poor lighting conditions
- [ ] No crashes when covering camera
- [ ] Smooth performance (no lag or stuttering)

## Performance Benchmarks

Expected performance:
- MediaPipe load time: 2-3 seconds
- Frame rate: 30 FPS
- Pose detection latency: <50ms
- Rep detection accuracy: >90% with proper form

## Browser Testing

Test on:
- [ ] Chrome (recommended)
- [ ] Edge
- [ ] Firefox
- [ ] Safari

## Known Issues

1. First load takes 2-3 seconds for MediaPipe WASM
2. May miscount if user is too close/far from camera
3. Best results with side-on camera angle
4. Requires good lighting for optimal detection

## Debugging Tips

### Check Browser Console
Look for:
- MediaPipe initialization messages
- Camera stream status
- Any error messages

### Verify Camera Feed
- Ensure video element is rendering
- Check if getUserMedia is supported
- Verify camera permissions in browser settings

### Test Pose Detection
- Stand in frame and check if landmarks appear
- Move arms to verify tracking
- Check angle values update correctly
