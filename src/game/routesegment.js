import {lerp, distance} from './helpers';
import * as PIXI from 'pixi.js';

export default class RouteSegment {
  constructor(startNode, endNode) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.isSelected = false;
    this.length = distance(this.startNode.getPos(), this.endNode.getPos());

    this.dying_road_text = new PIXI.Text( 0 + 'm',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});

    // when this is set to true one shouldn't be able to use road
    this.road_is_dead = false;

    // some helper variables
    var spos = this.startNode.getPos();
    var epos = this.endNode.getPos();

    var angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;
    var currentPos = {x: spos.x, y: spos.y};

    // parsing thought the anomalies if there are any in the nodes
    if(startNode.anomalies.length > 0 || endNode.anomalies.length > 0) {
      this.anomalies = [];

      for(var i = 0; i < startNode.anomalies.length; ++i) {
        if(startNode.anomalies[i].to === endNode.getId()) {
          this.anomalies.push(startNode.anomalies[i]);

          // dying road
          if(typeof  startNode.anomalies[i]['dying_road'] !== 'undefined')
            this.dying_road_text.text = startNode.anomalies[i].dying_road + 'm';
        }
      }

      for(var i = 0; i < endNode.anomalies.length; ++i) {
        if(endNode.anomalies[i].to === startNode.getId()) {
          this.anomalies.push(endNode.anomalies[i]);

          // dying road
          if(typeof  endNode.anomalies[i]['dying_road'] !== 'undefined')
            this.dying_road_text.text = endNode.anomalies[i].dying_road + 'm';
        }
      }

    } else {
      this.anomalies = [];
    }

    this.dying_road_text.x = currentPos.x + 25;
    this.dying_road_text.y = currentPos.y - 12.5;
    this.dying_road_text.rotation = angle + 3*Math.PI / 2;

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

  updateAnomalies(distance_moved) {
    for(var i = 0; i < this.anomalies.length; ++i) {
      // checking dying road
      if(typeof this.anomalies[i]['dying_road'] !== 'undefined') {
        if(this.road_is_dead) continue;

        this.anomalies[i].dying_road -= Math.abs(distance_moved);
        this.dying_road_text.text = Math.round(this.anomalies[i].dying_road) + 'm';

        if(this.anomalies[i].dying_road < 0) {
          this.road_is_dead = true;
          this.dying_road_text.texture = PIXI.Texture.fromImage('/static/dead_road.png');

          this.dying_road_text.setTransform(this.dying_road_text.x, this.dying_road_text.y, 0.1, 0.1);
          this.dying_road_text.anchor.set(0, 0);
        }
      }
    }
  }

  getDyingRoadText() {
    return this.dying_road_text;
  }

  isRoadDead() {
    return this.road_is_dead;
  }
}
