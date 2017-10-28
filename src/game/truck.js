import * as PIXI from 'pixi.js';
import * as Key from './controls';
import {lerp, distance} from './helpers';
// import RouteSegment from './routesegment';


export default class Truck {
  constructor(x, y, stage, startSegment, logsOnLevel) {
    this.sprite = PIXI.Sprite.fromImage('/truck.png');
    this.sprite.anchor.set(0.5);

    this.sprite.x = x;
    this.sprite.y = y;

    this.velocity = 5.0;

    // 0.00 - 1.00, interpolation between route segment start and end
    this.pointDelta = 0;

    this.routeIndex = 0;

    this.currentSegment = startSegment;

    this.arrow_graphics = new PIXI.Graphics();
    this.arrow_graphics.lineStyle(50, 0x0B5394, 1);
    this.arrow_graphics.moveTo(0, 0);
    this.arrow_graphics.lineTo(500, 400);
    this.arrow_graphics.endFill();

    stage.addChild(this.sprite);
    stage.addChild(this.arrow_graphics);

    // some key helpers
    this.leftWasDown = false;
    this.rightWasDown = false;

<<<<<<< HEAD
    this.previous_direction = 1;
=======
    this.logsOnLevel = logsOnLevel;

    // 4x4 array for logs in truck
    var x = new Array(4);
    for (var i = 0; i < 4; i++) {
      x[i] = new Array(4);
    }
    this.logsInTruck = x; 
>>>>>>> Logs: draw logs and near truck detection
  }

  update(timeDelta) {
    this.move(timeDelta);
    this.checkLogs();
    this.draw();
  }

  move(timeDelta) {
    var direction = 0;
    if(Key.up.isDown) {
      this.previous_direction = 1;
      direction = 1;
    }
    if(Key.down.isDown) {
      this.previous_direction = -1;
      direction = -1;
    }

    if(Key.left.isDown) {
      this.leftWasDown = true;
      this.rightWasDown = false;
    }

    if(Key.right.isDown) {
      this.rightWasDown = true
      this.leftWasDown = false;
    }

    if(this.leftWasDown && Key.left.isUp) {
      this.leftWasDown = false;
      this.rightWasDown = false;
      ++this.routeIndex;
      var seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, 1) :
        this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, 1);
      this.routeIndex = seg['index'];
    }

    if(this.rightWasDown && Key.right.isUp) {
      this.leftWasDown = false;
      this.rightWasDown = false;
      --this.routeIndex;
      seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, -1) :
        this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, -1);
      this.routeIndex = seg['index'];
    }

    // Advance on route segment based on segment length
    this.pointDelta += (direction * this.velocity * timeDelta) / this.currentSegment.getLength();

    // Switch route segment if needed
    if (this.pointDelta <= 0) {
      this.pointDelta = 0;

      if (this.currentSegment.getPreviousNode() !== null) {
        this.pointDelta = 0.99;

        var selected_segment_data = this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, -1);
        this.routeIndex = selected_segment_data['index'];

        // console.log(this.currentSegment);
        var temp_segment = selected_segment_data['seg'];

        if(this.currentSegment.startNode !== temp_segment.endNode && this.currentSegment.startNode.getSegments().length > 1) {
          var temp_node = temp_segment.startNode;
          temp_segment.startNode = temp_segment.endNode;
          temp_segment.endNode = temp_node;
        }

        if(temp_segment === this.currentSegment) {
          this.pointDelta = 0.01;
          this.currentSegment = temp_segment;
        } else {
          this.currentSegment = temp_segment;
        }

      }

    } else if (this.pointDelta >= 1) {
      this.pointDelta = 1;

      if (this.currentSegment.getNextNode() !== null) {
        this.pointDelta = 0.01;

        selected_segment_data = this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, 1);
        this.routeIndex = selected_segment_data['index'];
        var temp_segment_2 = selected_segment_data['seg'];

        if(this.currentSegment.endNode !== temp_segment_2.startNode && this.currentSegment.endNode.getSegments().length > 1) {
          var temp_node_2 = temp_segment_2.startNode;
          temp_segment_2.startNode = temp_segment_2.endNode;
          temp_segment_2.endNode = temp_node_2;
        }

        if(temp_segment_2 === this.currentSegment)
          this.pointDelta = 0.99;
        else {
          this.currentSegment = temp_segment_2;
        }
      }
    }
  }

  checkLogs() {
    for (var i = 0; i < this.logsOnLevel.length; ++i) {
      var log = this.logsOnLevel[i];
      var distanceToLog = distance(this.sprite.position, log.position); 
      if (distanceToLog < 100) {
        log.canPickUp = true;
        log.tint = 0x444444;
      } else {
        log.tint = 0xffffff;
        log.canPickUp = false;
      }
    }
  }

  draw() {
    var point = this.currentSegment.getPositionAt(this.pointDelta);
    this.sprite.x = point.x;
    this.sprite.y = point.y;

    this.sprite.rotation = this.currentSegment.getRotation();

    var seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex) :
      this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex);
    var epoints = { 'start': seg['seg'].getPositionAt(0),'end' : seg['seg'].getPositionAt(1)}
    var dest_point = { 'x' : (epoints.start.x + epoints.end.x) / 2,  'y' : (epoints.start.y + epoints.end.y) / 2}
    this.arrow_graphics.clear();
    this.arrow_graphics.lineStyle(5, 0x0B5394, 1);
    this.arrow_graphics.moveTo(dest_point.x, dest_point.y);
    this.arrow_graphics.lineTo(point.x, point.y);
    this.arrow_graphics.endFill();
  }
}
