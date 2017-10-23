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

      if (this.currentSegment.getPrevious() !== null) {
        this.pointDelta = 0.99;
        this.currentSegment = this.currentSegment.getPrevious();
      }

    } else if (this.pointDelta >= 1) {
      this.pointDelta = 1;

      if (this.currentSegment.getNext() !== null) {
        this.pointDelta = 0.01;
        this.currentSegment = this.currentSegment.getNext();
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
