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

export function hasMoved(point1, point2) {
  if((point1.x !== point2.x) || (point1.y !== point2.y)) {
    return true;
  } else {
    return false;
  }
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

export function secondsToDateFormat(secs) {
  var date = new Date(null);
  date.setSeconds(secs);
  var dateformat = date.toISOString().substr(11,8);
  return dateformat;
}

export function DateFormatToSeconds(date) {
  var s = date.split(':');
  return (+s[0]) * 60 * 60 + (+s[1]) * 60 + (+s[2]);
}

export function calculateMinMax(mapData) {
  var min_max = { xMin: 0, yMin: 0, xMax: 0, yMax: 0 };

  for (var i = 0; i < mapData.logdeposits.length; i++) {
    min_max = updateMinMax(min_max,mapData.logdeposits[i]);
  }

  for (var i = 0; i < mapData.logs.length; i++) {
    min_max = updateMinMax(min_max,mapData.logs[i]);
  }

  for (var i = 0; i < mapData.routes.length; i++) {
    min_max = updateMinMax(min_max,mapData.routes[i]);
  }

  return min_max;
}

export function updateMinMax(min_max, point) {
		if (point.x < min_max.xMin) min_max.xMin = point.x;
		if (point.y < min_max.yMin) min_max.yMin = point.y;
		if (point.x > min_max.xMax) min_max.xMax = point.x;
		if (point.y > min_max.yMax) min_max.yMax = point.y;

    return min_max;
	}
