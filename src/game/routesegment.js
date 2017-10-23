import {lerp, distance} from './helpers';

export default class RouteSegment {
  constructor(startPoint, endPoint, nextSegment, prevSegment) {
    this.startPoint = startPoint;
    this.endPoint = endPoint;
    this.nextSegment = nextSegment;
    this.prevSegment = prevSegment;
    this.length = distance(startPoint, endPoint);
  }

  setNext(segment) {
    this.nextSegment = segment;
  }

  setPrevious(segment) {
    this.prevSegment = segment;
  }

  getLength() {
    return this.length;
  }

  getPositionAt(interpolationDelta) {
    return lerp(this.startPoint, this.endPoint, interpolationDelta);
  }

  getRotation() {
    var pA = this.startPoint;
    var pB = this.endPoint;
    return Math.atan2(pB.y - pA.y, pB.x - pA.x) + Math.PI/2;
  }

  getNext() {
    return this.nextSegment;
  }

  getPrevious() {
    return this.prevSegment;
  }
}