export function lerp(point1, point2, t) {
  var x = (1 - t) * point1.x + t * point2.x;
  var y = (1 - t) * point1.y + t * point2.y;

  return {x: x, y: y};
}

export function distance(point1, point2) {
  var x = point2.x - point1.x;
  var y = point2.y - point1.y;
  return Math.sqrt(x*x + y*y);
}
