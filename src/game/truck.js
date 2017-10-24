import * as PIXI from 'pixi.js';
import * as Key from './controls';
import RouteSegment from './routesegment';
import {lerp, distance} from './helpers';


export default class Truck {
  constructor(x, y, stage, startSegment) {
    this.sprite = PIXI.Sprite.fromImage('/truck.png');
    this.sprite.anchor.set(0.5);

    this.sprite.x = x;
    this.sprite.y = y;

    this.velocity = 5.0;

    // 0.00 - 1.00, interpolation between route segment start and end
    this.pointDelta = 0;

    this.currentSegment = startSegment;

    stage.addChild(this.sprite);
  }

  update(timeDelta) {
    this.move(timeDelta);
    this.draw();
  }

  move(timeDelta) {
    var direction = 0;
    if(Key.up.isDown) {
      direction = 1
    }
    if(Key.down.isDown) {
      direction = -1
    }

    // Advance on route segment based on segment length
    this.pointDelta += (direction * this.velocity * timeDelta) / this.currentSegment.getLength();

    // Switch route segment if needed
    if (this.pointDelta <= 0) {
      this.pointDelta = 0;

      if (this.currentSegment.getPreviousNode() !== null) {
        this.pointDelta = 0.99;
        console.log("backwards");

        // console.log(this.currentSegment);
        var temp_segment = this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, 0);
        if(temp_segment == this.currentSegment)
          this.pointDelta = 0.01;
        else {
          this.currentSegment = temp_segment;
        }
      }

    } else if (this.pointDelta >= 1) {
      this.pointDelta = 1;

      if (this.currentSegment.getNextNode() !== null) {
        this.pointDelta = 0.01;
        console.log("forwards");

        var temp_segment = this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, 0);

        if(this.currentSegment.endNode != temp_segment.startNode) {
          var temp_node = temp_segment.startNode;
          temp_segment.startNode = temp_segment.endNode;
          temp_segment.endNode = temp_node;
        }

        if(temp_segment == this.currentSegment)
          this.pointDelta = 0.99;
        else {
          this.currentSegment = temp_segment;
        }
      }
    }
  }

  draw() {
    var point = this.currentSegment.getPositionAt(this.pointDelta);
    this.sprite.x = point.x;
    this.sprite.y = point.y;

    this.sprite.rotation = this.currentSegment.getRotation();
  }
}
