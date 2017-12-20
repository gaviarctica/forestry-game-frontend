import {lerp, distance} from './helpers';

export default class RouteSegment {
  constructor(startNode, endNode) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.isSelected = false;
    this.length = distance(this.startNode.getPos(), this.endNode.getPos());

    // parsing thought the anomalies if there are any in the nodes
    if(startNode.anomalies.length > 0 || endNode.anomalies.length > 0) {
      this.anomalies = [];

      for(var i = 0; i < startNode.anomalies.length; ++i) {
        if(startNode.anomalies[i].to === endNode.getId()) {
          this.anomalies.push(startNode.anomalies[i]);
        }
      }

      for(var i = 0; i < endNode.anomalies.length; ++i) {
        if(endNode.anomalies[i].to === startNode.getId()) {
          this.anomalies.push(endNode.anomalies[i]);
        }
      }

    } else {
      this.anomalies = [];
    }

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
    this.isSelected = is_selected;
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

  getRotation(callerNode = undefined) {
    var pA, pB;
    if (callerNode === this.endNode) {
      pA = this.endNode.getPos();
      pB = this.startNode.getPos();
    } else {
      pA = this.startNode.getPos();
      pB = this.endNode.getPos();
    }
    return Math.atan2(pB.y - pA.y, pB.x - pA.x) + Math.PI/2;
  }

  getNextNode() {
    return this.endNode;
  }

  getPreviousNode() {
    return this.startNode;
  }
}
