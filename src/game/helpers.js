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

export function length(v) {
  return Math.sqrt(v.x*v.x + v.y*v.y);
}

export function endpointByStartPointDistanceAndAngle(startpoint, distance, angle) {
  var endpoint = {
    x: startpoint.x + Math.cos(angle) * distance,
    y: startpoint.y + Math.sin(angle) * distance
  };

  return endpoint;
}

export function distanceToSegment(p, segStart, segEnd) {

    var A = p.x - segStart.x;
    var B = p.y - segStart.y;
    var C = segEnd.x - segStart.x;
    var D = segEnd.y - segStart.y;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;
    if (len_sq !== 0) //in case of 0 length line
        param = dot / len_sq;

    var xx, yy;

    if (param < 0) {
      xx = segStart.x;
      yy = segStart.y;
    }
    else if (param > 1) {
      xx = segEnd.x;
      yy = segEnd.y;
    }
    else {
      xx = segStart.x + param * C;
      yy = segStart.y + param * D;
    }

    var dx = p.x - xx;
    var dy = p.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

export function normalize(vector2) {
  var d = length(vector2);
  return {x: vector2.x / d, y: vector2.y / d};
}

export function isLeft(p1, p2, p){
  return ((p2.x - p1.x)*(p.y - p1.y) - (p2.y - p1.y)*(p.x - p1.x)) > 0;
}
