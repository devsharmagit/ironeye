# 👁️ IronEye

> Real-time push-up counter powered by pose estimation. No wearables. No backend. Just your browser and your body.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MediaPipe](https://img.shields.io/badge/MediaPipe-FF6F00?style=flat&logo=google&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## ✨ What is IronEye?

IronEye uses your laptop's webcam and real-time pose estimation (via MediaPipe) to detect and count push-up reps directly in the browser — with zero backend, zero installation, and zero wearable hardware.

It tracks the angle of your elbow joint frame-by-frame, identifies UP/DOWN transitions, and increments a rep counter every time you complete a full rep.

---

## 🎥 Demo

> _Screenshot / GIF here_

---

## 🧠 How It Works

IronEye detects **33 body landmarks** from your webcam feed in real time using MediaPipe Pose (runs entirely in-browser via WebAssembly).

The push-up counting logic works by:

1. Extracting the **shoulder**, **elbow**, and **wrist** landmarks
2. Computing the **elbow angle** using `Math.atan2`
3. Running a **state machine** to detect UP → DOWN → UP transitions

```
Elbow angle ~160–180°  →  UP position
Elbow angle ~70–90°    →  DOWN position

UP → DOWN → UP         →  +1 rep ✅
```

No ML model is trained to recognize "a push-up" — just geometry and a state machine.

---

## 🛠️ Tech Stack

| Layer            | Technology                              |
|------------------|-----------------------------------------|
| UI Framework     | React 18 + TypeScript                   |
| Pose Estimation  | MediaPipe Pose (`@mediapipe/pose`)       |
| Camera Access    | Browser `getUserMedia` API              |
| Skeleton Overlay | HTML5 Canvas                            |
| Bundler          | Vite                                    |
| Styling          | Tailwind CSS                            |

> **No backend required.** Everything runs client-side.

---

## 📁 Project Structure

```
ironeye/
├── public/
├── src/
│   ├── hooks/
│   │   ├── useCamera.ts          # getUserMedia, video stream setup
│   │   └── usePoseDetection.ts   # MediaPipe init, landmark extraction
│   ├── utils/
│   │   ├── angles.ts             # calculateAngle(a, b, c) — core geometry
│   │   └── repCounter.ts         # UP/DOWN state machine logic
│   ├── components/
│   │   ├── VideoCanvas.tsx       # <video> + <canvas> overlay with skeleton
│   │   ├── Counter.tsx           # Rep count + session stats display
│   │   └── StatusBadge.tsx       # UP / DOWN position indicator
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A browser with webcam access (Chrome / Edge recommended for best WASM performance)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/ironeye.git
cd ironeye

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open `http://localhost:5173`, allow camera access, and start repping.

---

## 📐 Core Logic

### Angle Calculation

```typescript
// utils/angles.ts
type Point = { x: number; y: number };

export function calculateAngle(a: Point, b: Point, c: Point): number {
  // b is the vertex (elbow joint)
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
}
```

### Rep State Machine

```typescript
// utils/repCounter.ts
type PushUpState = "UP" | "DOWN" | "IDLE";

const UP_THRESHOLD = 160;    // degrees — arms extended
const DOWN_THRESHOLD = 90;   // degrees — arms bent

export function updateRepCount(
  angle: number,
  state: PushUpState,
  count: number
): { state: PushUpState; count: number } {
  if (angle > UP_THRESHOLD && state === "DOWN") {
    return { state: "UP", count: count + 1 }; // rep completed ✅
  }
  if (angle < DOWN_THRESHOLD) {
    return { state: "DOWN", count };
  }
  return { state, count };
}
```

---

## 📷 Landmarks Used

From MediaPipe's 33-point body model:

| Landmark | Index |
|----------|-------|
| Left Shoulder  | 11 |
| Left Elbow     | 13 |
| Left Wrist     | 15 |
| Right Shoulder | 12 |
| Right Elbow    | 14 |
| Right Wrist    | 16 |

---

## 🗺️ Roadmap

- [x] Real-time elbow angle detection
- [x] Push-up rep counting with state machine
- [x] Skeleton overlay on canvas
- [ ] Form feedback (depth check, symmetry alert)
- [ ] Session history (sets, rest timer)
- [ ] Audio cues on rep completion
- [ ] Mobile camera support
- [ ] Progressive Web App (PWA) support

---

## ⚠️ Known Limitations

- Works best in **good lighting** with a **side-on camera angle**
- May miscount if the user is too close/far from the camera
- MediaPipe WASM takes ~2–3 seconds to load on first launch
- Currently optimized for **standard push-up form only**

---

## 🤝 Contributing

Pull requests are welcome! If you'd like to improve detection accuracy, add new exercises, or improve the UI:

```bash
git checkout -b feature/your-feature-name
# make your changes
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

Then open a PR.

---

## 📄 License

MIT — see [LICENSE](./LICENSE) for details.

---

<p align="center">Built with 💪 by <a href="https://devsharma.me">Dev Sharma</a></p>