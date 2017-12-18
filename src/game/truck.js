import * as PIXI from 'pixi.js';
import * as Key from './controls';
import {lerp, distance} from './helpers';
import Log from './log';
import LogDeposit from './logdeposit';

export default class Truck {


  constructor(stage, startSegment, startInterp, logsOnLevel, depositsOnLevel, stats) {
    // store the stage so we can control the camera when we need it
    this.stage = stage;
    this.forceCameraMovement = true;

    // can be lower with reverse
    Truck.MIN_VELOCITY = 1.0;
    Truck.REVERSE_VELOCITY_FACTOR = 0.5;

    this.sprite = PIXI.Sprite.fromImage('/static/truck.svg');
    this.sprite.anchor.set(0.5);
    this.sprite.scale.set(0.1);

    this.velocity = 5.0;

    // 0.00 - 1.00, interpolation between route segment start and end
    this.pointDelta = startInterp;

    this.routeIndex = 0;

    this.currentSegment = startSegment;

    this.clawSprite = PIXI.Sprite.fromImage('/static/claw.svg');
    this.clawSprite.anchor.set(0.5);
    this.clawSprite.scale.set(0.1);
    this.clawSprite.alpha = 0;

    this.arrowSprite = PIXI.Sprite.fromImage('/static/arrow.svg');
    this.arrowSprite.anchor.set(0, 0.5);
    this.arrowSprite.scale.set(0.2);

    stage.addChild(this.arrowSprite);
    stage.addChild(this.sprite);
    stage.addChild(this.clawSprite);

    // some key helpers
    this.leftWasDown = false;
    this.rightWasDown = false;

    this.previous_direction = -1;
    this.logsOnLevel = logsOnLevel;
    this.depositsOnLevel = depositsOnLevel;
    this.maxDistanceToDeposit = 150;

    // 4x5 array matrix for logs in truck
    this.logsInTruck = [];
    for (var i = 0; i < 4; ++i) {
      this.logsInTruck[i] = [];
      for (var j = 0; j < 5; ++j) {
        this.logsInTruck[i][j] = null;
      }
    }

    //  fill priority order for log array matrix
    /*
        x/i 0  1  2  3
    y/j  ______________
      0  |  14 16 15 13
      1  |  10 12 11 9
      2  |  6  8  7  5
      3  |  x  4  3  x
      4  |  x  2  1  x
    */
    this.logContainerTraverseOrder = [[2, 4], [1, 4], [2, 3], [1, 3], [3, 2], [0, 2], [2, 2], [1, 2], [3, 1], [0, 1], [2, 1], [1, 1], [3, 0], [0, 0], [2, 0], [1, 0]];

    // currently selected item (either automaticly, by mouse or q/e keys)
    this.selectedItem = null;
    this.selectableItems = [];
    this.selectGraphic = new PIXI.Graphics();
    stage.addChild(this.selectGraphic);

    this.distanceMoved = 0;
    this.fuelBurned = 0;
    this.previousPoint = null;

    this.stats = stats;
  }

  // TODO: maybe keep up with the log count in pickLog, depositLog functions to avoid unnecessary for looping
  logCount() {
    var logCount = 0;
    this.logsInTruck.forEach(x => x.forEach(y => {if(y !== null) logCount += 1}));
    return logCount;
  }

  // Calculates the distance truck has moved during an instance of gameplay
  calcDistance(point) {
    if(this.previousPoint === null) {
      this.previousPoint = this.currentSegment.getPositionAt(this.pointDelta);
    }

    if((this.previousPoint.x !== point.x) || (this.previousPoint.y !== point.y)) {
      this.distanceMoved += 1;
      this.calcFuelBurned();
      this.previousPoint = point;
    }
  }

  getDistanceMoved() {
    return this.distanceMoved;
  }

  // Calculates the fuel consumed by truck in one instance of gameplay
  calcFuelBurned() {
    // If there are logs in the truck increase fuel consumption by a load factor
    var loadFactor = this.logCount();

    switch(loadFactor) {
      case 0:
        this.fuelBurned += 0.001;
        break;
      case 1:
        this.fuelBurned += 0.002;
        break;
      default:
        this.fuelBurned += 0.001+0.001*loadFactor;
    }
  }

  getFuelBurned() {
    return this.fuelBurned.toFixed(2);
  }

  getSpeed(reverse = false) {

      // If there are logs in the truck increase fuel consumption by a load factor
      var loadFactor = this.logCount();

      var velocity = this.velocity - (this.velocity - Truck.MIN_VELOCITY) * loadFactor / 20;
      return reverse ?  velocity * Truck.REVERSE_VELOCITY_FACTOR :  velocity;
  }

  update(timeDelta, stopAutomaticCamera = false) {
    // stopping automatic camera updates untill we move truck next time
    if(stopAutomaticCamera) this.forceCameraMovement = false;
    this.move(timeDelta);
    this.updateCamera();
    this.checkLogs();
    this.checkDeposits();
    this.draw();
    this.calcDistance(this.currentSegment.getPositionAt(this.pointDelta));
  }

  move(timeDelta) {
    var direction = 0;


    if(Key.up.isDown) {
      // when we start moving we force the camera to center again
      this.forceCameraMovement = true;

      // when direction changes
      if(this.previous_direction == -1) {
        // experimental index suggestion
        this.routeIndex = this.currentSegment.getNextNode().getSuggestedSegment(this.currentSegment, this.arrowSprite)['index'];
      }

      this.previous_direction = 1;
      direction = 1;
    }

    if(Key.down.isDown) {
      // when we start moving we force the camera to center again
      this.forceCameraMovement = true;

      // when direction changes
      if(this.previous_direction == 1) {
        // experimental index suggestion
        this.routeIndex = this.currentSegment.getPreviousNode().getSuggestedSegment(this.currentSegment, this.arrowSprite)['index'];
      }

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

    if(Key.space.isDown) {
      this.spaceWasDown = true
    }

    if(Key.q.isDown) {
      this.qWasDown = true;
    }

    if (Key.e.isDown) {
      this.eWasDown = true;
    }

    if (this.qWasDown && Key.q.isUp) {
      this.selectNearbyItemAtDir(1);
      this.qWasDown = false;
    }

    if (this.eWasDown && Key.e.isUp) {
      this.selectNearbyItemAtDir(-1);
      this.eWasDown = false;
    }

    if(this.spaceWasDown && Key.space.isUp) {
      this.doLogAction = true;
      this.spaceWasDown = false;
    } else {
      this.doLogAction = false;
    }

    // Selecting route if arrow keys were pressed
    if(this.leftWasDown && Key.left.isUp) {
      this.leftWasDown = false;
      this.rightWasDown = false;
      ++this.routeIndex;
      var seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, 1) :
        this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, 1);
      this.routeIndex = seg['index'];
    } else if(this.rightWasDown && Key.right.isUp) {
      this.leftWasDown = false;
      this.rightWasDown = false;
      --this.routeIndex;
      seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, -1) :
        this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, -1);
      this.routeIndex = seg['index'];
    }

    // Advance on route segment based on segment length
    this.pointDelta += (direction * this.getSpeed( direction !== 1 ) * timeDelta) / this.currentSegment.getLength();

    // Switch route segment if needed
    if (this.pointDelta <= 0) {
      this.pointDelta = 0;

      if (this.currentSegment.getPreviousNode() !== null) {
        this.pointDelta = 0.99;

        var selected_segment_data = this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite);
        this.routeIndex = selected_segment_data['index'];

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
          this.endOfSegment = false;
          this.currentSegment = temp_segment;
        }

        // experimental index suggestion
        this.routeIndex = this.currentSegment.getPreviousNode().getSuggestedSegment(this.currentSegment, this.arrowSprite)['index'];
      }

    } else if (this.pointDelta >= 1) {
      this.pointDelta = 1;

      if (this.currentSegment.getNextNode() !== null) {
        this.pointDelta = 0.01;

        selected_segment_data = this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, 1);
        this.routeIndex = selected_segment_data['index'];

        var temp_segment_2 = selected_segment_data['seg'];

        if(this.currentSegment.endNode !== temp_segment_2.startNode && this.currentSegment.endNode.getSegments().length > 1) {
          var temp_node_2 = temp_segment_2.startNode;
          temp_segment_2.startNode = temp_segment_2.endNode;
          temp_segment_2.endNode = temp_node_2;
        }

        if(temp_segment_2 === this.currentSegment) {
          this.endOfSegment = true;
          this.pointDelta = 0.99;
        }
        else {
          this.endOfSegment = false;
          this.currentSegment = temp_segment_2;
        }

        // experimental index suggestion
        this.routeIndex = this.currentSegment.getNextNode().getSuggestedSegment(this.currentSegment, this.arrowSprite)['index'];
      }
    }
  }

  updateCamera() {
    if(this.forceCameraMovement) {
      var upfactor = 1 / 60;
      var upvector =  [(this.stage.pivot.x - this.sprite.x)*upfactor, (this.stage.pivot.y - this.sprite.y) * upfactor];
      this.stage.pivot.x -= upvector[0];
      this.stage.pivot.y -= upvector[1];
    }
  }

  checkLogs() {
    for (var i = 0; i < this.logsOnLevel.length; ++i) {
      var log = this.logsOnLevel[i];

      // check if log is close to truck
      var distanceToLog = distance(this.sprite.position, log.getPosition());
      if (distanceToLog < 100) {
        log.setCanBePickedUp(true);

        if (this.selectableItems.indexOf(log) === -1) {
          this.selectableItems.push(log);
        }

        // no selected item or log is explicitly highlighted
        if (this.selectedItem == null || log.isHighlighted()) {
          this.selectItem(log);
        }

        // log close enough and it has been clicked, pick it to truck
        if (log.isMarkedForPickUp() && log.isHighlighted()) {
          this.doLogAction = true;
        }

      } else {
        log.setCanBePickedUp(false);
        if (this.selectedItem === log) {
          this.deselectItem();
        }

        var index = this.selectableItems.indexOf(log);
        if (index !== -1) {
          this.selectableItems.splice(index, 1);
        }
      }
    }

    if (this.doLogAction && this.selectedItem instanceof Log) {
      if (this.pickLog(this.selectedItem) === true) {
          // remove it from level array and from pixi stage container (parent of the log)
          index = this.logsOnLevel.indexOf(this.selectedItem);
          this.logsOnLevel.splice(index, 1);
          index = this.selectableItems.indexOf(this.selectedItem);
          if (index !== -1) {
            this.selectableItems.splice(index, 1);
          }
          this.deselectItem();
      }
      this.doLogAction = false;
    }
  }

  selectItem(item) {
    if (this.selectedItem !== item) {
      this.selectedItem = item;
    }
  }

  deselectItem() {
    this.selectedItem = null;
  }

  selectNearbyItemAtDir(dir) {
    if (this.selectedItem != null) {
      var index = this.selectableItems.indexOf(this.selectedItem);
      index += dir;
      if (index >= this.selectableItems.length) {
        index = 0;
      } else if (index < 0) {
        index = this.selectableItems.length - 1;
      }
      this.selectItem(this.selectableItems[index]);
    }
  }

  getLogAtPriorityIndex(i) {
    var logContainerX = this.logContainerTraverseOrder[i][0];
    var logContainerY = this.logContainerTraverseOrder[i][1];

    return this.logsInTruck[logContainerX][logContainerY];
  }

  setLogAtContainerPos(x, y, log) {
    this.logsInTruck[x][y] = log;

    if (log != null) {

      // clear state
      log.setCanBePickedUp(false);

      // setup graphics for truck visuals
      log.removeFromParent();
      this.sprite.addChild(log.logSprite);
      log.logSprite.position = new PIXI.Point((x * 60) - 90, 250);
      log.logSprite.rotation = Math.PI/2;
      log.logSprite.scale.set(1.0);
    }
  }

  setLogAtPriorityIndex(i, log) {
    var logContainerX = this.logContainerTraverseOrder[i][0];
    var logContainerY = this.logContainerTraverseOrder[i][1];
    this.setLogAtContainerPos(logContainerX, logContainerY, log);
  }

  // returns boolean if the log was picked up
  pickLog(log) {

    // traverse the container in fill priority order to find empty position
    for (var i = 0; i < this.logContainerTraverseOrder.length; ++i) {
      var logAtPos = this.getLogAtPriorityIndex(i);
      // check if null.. aka no log at that pos
      if (!logAtPos) {
        this.setLogAtPriorityIndex(i, log);
        this.stats.updateLogs(this.logsInTruck);
        return true;
      }
    }

    // truck is full
    return false;
  }

  unloadLogTo(deposit) {
    for (var y = 0; y < 5; ++y) {
      var triedAdd = false;
      // try to add every log on one layer to deposit
      for (var x = 0; x < 4; ++x) {
        var log = this.logsInTruck[x][y];
        if (!log) continue;
        triedAdd = true;

        // checking if level already has current log type
        var levelHasType = this.depositTypeExists(log.type);

        if (deposit.addLog(log, levelHasType)) {
          this.setLogAtContainerPos(x, y, null);
          this.stats.updateLogs(this.logsInTruck);
          return true;
        }
      }
      if (triedAdd) {
        return false;
      }
    }
    return false;
  }

  depositTypeExists(type) {
    for (var i = 0; i < this.depositsOnLevel.length; ++i) {
      var deposit = this.depositsOnLevel[i];
      if(type === deposit.type) return true;
    }

    return false;
  }

  checkDeposits() {
    for (var i = 0; i < this.depositsOnLevel.length; ++i) {
      var deposit = this.depositsOnLevel[i];

      // check if deposit is close to truck
      var distanceToDeposit = distance(this.sprite.position, deposit.getPosition());
      if (distanceToDeposit < this.maxDistanceToDeposit) {
        deposit.setCanBeUnloadedTo(true);

        if (this.selectableItems.indexOf(deposit) === -1) {
          this.selectableItems.push(deposit);
        }

        // no selected item or deposit is explicitly highlighted
        if (this.selectedItem == null || deposit.isHighlighted()) {
          this.selectItem(deposit);
        }

        // deposit close enough and it has been clicked, unload available log
        if (deposit.isMarkedForUnload()) {
          this.doLogAction = true;
        }

      } else {
        deposit.setCanBeUnloadedTo(false);
        if (this.selectedItem === deposit) {
          this.deselectItem();
        }

        var index = this.selectableItems.indexOf(deposit);
        if (index !== -1) {
          this.selectableItems.splice(index, 1);
        }
      }
    }

    if (this.doLogAction && this.selectedItem instanceof LogDeposit) {
      this.unloadLogTo(this.selectedItem);
      this.doLogAction = false;
    }
  }

  draw() {
    var point = this.currentSegment.getPositionAt(this.pointDelta);
    this.sprite.x = point.x;
    this.sprite.y = point.y;

    this.sprite.rotation = this.currentSegment.getRotation();

    // REMOVED in 18_12 bugfixes (doesn't seem to be needed anymore)
    // var seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite) :
    //   this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite);
    //
    // if(seg['seg'] !== null) {
    //   this.routeIndex = seg['index'];
    // }

    this.selectGraphic.clear();
    this.clawSprite.alpha = 0;
    if (this.selectedItem != null) {
      this.selectGraphic.beginFill();
      this.selectGraphic.lineStyle(3, 0x151515);
      this.selectGraphic.moveTo(point.x, point.y);
      this.selectGraphic.lineTo(this.selectedItem.getPosition().x, this.selectedItem.getPosition().y);
      this.selectGraphic.endFill();

      this.clawSprite.x = this.selectedItem.getPosition().x;
      this.clawSprite.y = this.selectedItem.getPosition().y;
      // Set claw angle
      this.clawSprite.rotation = -Math.PI/2 + Math.atan2(
        this.selectedItem.getPosition().y - this.sprite.y,
        this.selectedItem.getPosition().x - this.sprite.x);
      // Make claw be on top of line
      this.stage.removeChild(this.clawSprite);
      this.stage.addChild(this.clawSprite);
      this.clawSprite.alpha = 1;
    }
  }
}
