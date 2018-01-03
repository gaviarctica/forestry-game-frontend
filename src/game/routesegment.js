import {lerp, distance} from './helpers';
import * as PIXI from 'pixi.js';
import Settings from './settings';

export default class RouteSegment {
  constructor(startNode, endNode) {
    this.anomaly_settings = (new Settings()).anomalies;

    this.startNode = startNode;
    this.endNode = endNode;
    this.isSelected = false;
    this.length = distance(this.startNode.getPos(), this.endNode.getPos());

    this.dying_road_text = new PIXI.Text( 0 + 'm',this.anomaly_settings.DYING_ROAD_TEXT_FONT);
    this.weight_limit_text = new PIXI.Text( 0 + 'kg',this.anomaly_settings.WEIGHT_LIMIT_TEXT_FONT);

    this.one_way_road_mark = new PIXI.Sprite.fromImage('/static/one_dir_arrow.png');
    this.one_way_road_mark.anchor.set(0.5, 0.5);
    this.one_way_road_mark.scale.set(this.anomaly_settings.ONE_DIR_ARROW_SPRITE_SCALE);

    // when this is set to true one shouldn't be able to use road
    this.road_is_dead = false;
    // weight limit is false when there is none, otherwise kg amount
    this.weight_limit = false;
    // is oneway road + direction
    this.one_way_road = { one_way_road : false };

    // some helper variables
    var spos = this.startNode.getPos();
    var epos = this.endNode.getPos();

    // putting some default angle
    this.road_dir_angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;

    var currentPos = {
      min: { x: (spos.x < epos.x ? spos.x : epos.x), y: (spos.y < epos.y ? spos.y : epos.y)},
      max: { x: (spos.x > epos.x ? spos.x : epos.x), y: (spos.y > epos.y ? spos.y : epos.y)},
    }
    var currentPosCalc = {
      x: currentPos.min.x + (currentPos.max.x - currentPos.min.x) / 2,
      y: currentPos.min.y + (currentPos.max.y - currentPos.min.y) / 2
    };

    // parsing through the anomalies if there are any in the nodes
    if(startNode.anomalies.length > 0 || endNode.anomalies.length > 0) {
      this.anomalies = [];

      for(var i = 0; i < startNode.anomalies.length; ++i) {
        if(startNode.anomalies[i].to === endNode.getId()) {
          this.anomalies.push(startNode.anomalies[i]);

          // dying road
          if(typeof  startNode.anomalies[i]['dying_road'] !== 'undefined')
            this.dying_road_text.text = startNode.anomalies[i].dying_road + 'm';

          // weight limit
          if(typeof  startNode.anomalies[i]['weight_limit'] !== 'undefined') {
            this.weight_limit_text.text = startNode.anomalies[i].weight_limit + 'kg';
            this.weight_limit = startNode.anomalies[i].weight_limit;
          }

          // one way road
          if(typeof  startNode.anomalies[i]['one_way_road'] !== 'undefined') {
            this.one_way_road = { one_way_road : true, spos:spos, epos:epos };
            // recalculating direction
            this.road_dir_angle = Math.atan2(spos.y - epos.y, spos.x - epos.x) + Math.PI/2;
          }
        }
      }

      for(i = 0; i < endNode.anomalies.length; ++i) {
        if(endNode.anomalies[i].to === startNode.getId()) {
          this.anomalies.push(endNode.anomalies[i]);

          // dying road
          if(typeof  endNode.anomalies[i]['dying_road'] !== 'undefined')
            this.dying_road_text.text = endNode.anomalies[i].dying_road + 'm';

          // weight limit
          if(typeof  endNode.anomalies[i]['weight_limit'] !== 'undefined') {
            this.weight_limit_text.text = endNode.anomalies[i].weight_limit + 'kg';
            this.weight_limit = endNode.anomalies[i].weight_limit;
          }

          // one way road
          if(typeof  endNode.anomalies[i]['one_way_road'] !== 'undefined') {
            this.one_way_road = { one_way_road : true, spos:epos, epos:spos };
            // recalculating direction
            this.road_dir_angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;
          }
        }
      }

    } else {
      this.anomalies = [];
    }

    this.dying_road_text.x = currentPosCalc.x - this.dying_road_text.width / 2;
    this.dying_road_text.y = currentPosCalc.y - this.dying_road_text.height / 2;

    this.weight_limit_text.x = currentPosCalc.x - this.weight_limit_text.width / 2;
    this.weight_limit_text.y = currentPosCalc.y - this.weight_limit_text.height / 2;

    this.one_way_road_mark.rotation = this.road_dir_angle + Math.PI / 2;
    this.one_way_road_mark.x = currentPosCalc.x;
    this.one_way_road_mark.y = currentPosCalc.y;

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

          this.dying_road_text.setTransform(this.dying_road_text.x, this.dying_road_text.y,
            this.anomaly_settings.DEAD_ROAD_TEXT_SCALE[0], this.anomaly_settings.DEAD_ROAD_TEXT_SCALE[1]);
        }
      }
    }
  }

  getDyingRoadText() {
    return this.dying_road_text;
  }

  getWeightLimitText() {
    return this.weight_limit_text;
  }

  getOneWayRoadSprite() {
    return this.one_way_road_mark;
  }

  isRoadDead() {
    return this.road_is_dead;
  }

  // returns weight limit, false when no limit
  getRoadWeightLimit() {
    return this.weight_limit;
  }

  canDriveTo(angle, dir) {
    // if not one way road we continue
    if(!this.one_way_road.one_way_road) return true;

    var road_fix = dir > 0 ? 0 : Math.PI;

    // angles are converted to positive radians and roads angle is adjusted to cars
    // also if car is driving reverse roads angle is reversed for comparison
    var car_angle = Math.round(((angle + 2*Math.PI) % (2*Math.PI)) * 1000);
    var road_angle = Math.round(((this.road_dir_angle + road_fix - Math.PI + 2*Math.PI) % (2*Math.PI)) * 1000);

    if (car_angle === road_angle) {
      return true;
    }

    return false;
  }
}
