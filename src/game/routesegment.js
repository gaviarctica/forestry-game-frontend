import {lerp, distance} from './helpers';

export default class RouteSegment {
  constructor(startNode, endNode) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.isSelected = false;
    this.length = distance(this.startNode.getPos(), this.endNode.getPos());
  }

  addNext(segment) {
    if(this.nextSegments && Array.isArray(this.nextSegments))
      this.nextSegments.push(segment);
    else {
      this.nextSegments = [];
      this.nextSegments.push(segment);
    }
  }

  addPrevious(segment) {
    if(this.prevSegments && Array.isArray(this.prevSegments))
      this.prevSegments.push(segment);
    else {
      this.prevSegments = [];
      this.prevSegments.push(segment);
    }
  }

  setSelected( is_selected = true ) {
    this.isSelected = is_selected
  }

  isSelected() {
    return this.isSelected;
  }

  getLength() {
    return this.length;
  }

  getPositionAt(interpolationDelta) {
    return lerp(this.startNode.getPos(), this.endNode.getPos(), interpolationDelta);
  }

  getRotation() {
    var pA = this.startNode.getPos();
    var pB = this.endNode.getPos();
    return Math.atan2(pB.y - pA.y, pB.x - pA.x) + Math.PI/2;
  }

  getNextNode() {
    return this.endNode;
  }

  getPreviousNode() {
    return this.startNode;
  }
}
