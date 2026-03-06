// State machine logic for push-up rep counting

export type PushUpState = "UP" | "DOWN" | "IDLE";

const UP_THRESHOLD = 160;    // degrees — arms extended
const DOWN_THRESHOLD = 90;   // degrees — arms bent

/**
 * Update rep count based on elbow angle and current state
 * @param angle Current elbow angle in degrees
 * @param state Current push-up state
 * @param count Current rep count
 * @returns Updated state and count
 */
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
