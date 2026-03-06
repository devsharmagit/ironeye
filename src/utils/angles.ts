// Core geometry utility for calculating angles between three points

export type Point = { x: number; y: number };

/**
 * Calculate the angle at point B formed by points A-B-C
 * @param a First point (e.g., shoulder)
 * @param b Vertex point (e.g., elbow)
 * @param c Third point (e.g., wrist)
 * @returns Angle in degrees (0-180)
 */
export function calculateAngle(a: Point, b: Point, c: Point): number {
  // b is the vertex (elbow joint)
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs(radians * (180 / Math.PI));
  if (angle > 180) angle = 360 - angle;
  return angle;
}
