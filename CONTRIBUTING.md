# Contributing to IronEye

Thank you for your interest in contributing to IronEye! This document provides guidelines and information for contributors.

## Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/ironeye.git`
3. Install dependencies: `npm install`
4. Start dev server: `npm run dev`
5. Make your changes
6. Test thoroughly
7. Submit a pull request

## Code Structure

### Core Components

- `src/App.tsx` - Main application component
- `src/components/` - Reusable UI components
- `src/hooks/` - Custom React hooks for camera and pose detection
- `src/utils/` - Pure utility functions (angles, rep counting)

### Key Files to Understand

1. **utils/angles.ts** - Geometry calculations for joint angles
2. **utils/repCounter.ts** - State machine logic for rep detection
3. **hooks/usePoseDetection.ts** - MediaPipe integration
4. **components/VideoCanvas.tsx** - Skeleton overlay rendering

## Adding New Features

### Adding a New Exercise

1. Create new state machine in `src/utils/`
2. Define angle thresholds for the exercise
3. Update `App.tsx` to use new logic
4. Add UI toggle to switch between exercises

Example:
```typescript
// src/utils/squatCounter.ts
export function updateSquatCount(
  kneeAngle: number,
  state: SquatState,
  count: number
): { state: SquatState; count: number } {
  // Implement squat detection logic
}
```

### Improving Detection Accuracy

1. Adjust thresholds in `repCounter.ts`
2. Add smoothing/filtering to angle calculations
3. Implement multi-joint validation
4. Add form feedback based on multiple landmarks

### Adding Audio Feedback

1. Create audio files for rep completion
2. Add Web Audio API integration
3. Trigger sounds on state transitions
4. Add volume controls to UI

## Code Style

- Use TypeScript for type safety
- Follow React hooks best practices
- Keep components small and focused
- Write descriptive variable names
- Add comments for complex logic

## Testing

Before submitting a PR:

1. Test on multiple browsers (Chrome, Firefox, Safari)
2. Verify camera permissions work correctly
3. Test with different lighting conditions
4. Ensure no console errors
5. Check performance (should maintain 30 FPS)

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes with clear commit messages
3. Update documentation if needed
4. Test thoroughly
5. Push to your fork
6. Open a PR with a clear description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on Chrome
- [ ] Tested on Firefox
- [ ] Tested with different lighting
- [ ] No console errors

## Screenshots
(if applicable)
```

## Roadmap Ideas

Want to contribute but not sure where to start? Here are some ideas:

### High Priority
- [ ] Form feedback (depth check, symmetry)
- [ ] Session history and analytics
- [ ] Audio cues on rep completion
- [ ] Mobile camera support

### Medium Priority
- [ ] Multiple exercise types (squats, sit-ups)
- [ ] Workout timer and rest periods
- [ ] Export workout data
- [ ] Dark/light theme toggle

### Low Priority
- [ ] Social sharing features
- [ ] Leaderboards
- [ ] Custom workout programs
- [ ] Progressive Web App (PWA)

## Questions?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase
- Suggestions for improvements

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
