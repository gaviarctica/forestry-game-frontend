import * as PIXI from 'pixi.js';
import {lerp, distance} from './helpers';
import Log from './log';
import LogDeposit from './logdeposit';
import LogContainer from './logcontainer';
import Settings from './settings';
import {Key} from './controls';
import Controls from './controls';

export default class Truck {

  constructor(stage, controls, startSegment, startInterp, logsOnLevel, depositsOnLevel, stats, logsRemaining) {
    
    this.drawable_container = new PIXI.Container();
    // store the stage so we can control the camera when we need it
    this.stage = stage;
    this.controls = controls;
    this.forceCameraMovement = true;

    // loading setting variables
    this.settings = (new Settings()).truck;
    this.map_settings = (new Settings()).map;
    this.camera_settings = (new Settings()).camera;
    this.anomaly_settings = (new Settings()).anomalies;
    this.log_settings = (new Settings()).log;

    this.sprite = PIXI.Sprite.fromImage('/static/truck.svg');
    this.sprite.anchor.set(this.settings.SPRITE_ANCHOR);
    this.sprite.scale.set(this.settings.SPRITE_SCALE);

    // 0.00 - 1.00, interpolation between route segment start and end
    this.pointDelta = startInterp;

    this.routeIndex = 0;

    this.currentSegment = startSegment;

    this.clawSprite = PIXI.Sprite.fromImage('/static/claw.svg');
    this.clawSprite.anchor.set(this.settings.CLAW_SPRITE_ANCHOR);
    this.clawSprite.scale.set(this.settings.CLAW_SPRITE_SCALE);
    this.clawSprite.alpha = 0;

    this.arrowSprite = PIXI.Sprite.fromImage('/static/arrow.svg');
    this.arrowSprite.anchor.set(0, this.settings.ARROW_SPRITE_ANCHOR);
    this.arrowSprite.scale.set(this.settings.ARROW_SPRITE_SCALE);
    this.arrowSprite.alpha = 0;

    this.drawable_container.addChild(this.arrowSprite);
    this.drawable_container.addChild(this.sprite);
    this.drawable_container.addChild(this.clawSprite);

    this.previous_direction = -1;
    this.logsOnLevel = logsOnLevel;
    this.depositsOnLevel = depositsOnLevel;
    this.maxDistanceToDeposit = this.settings.MAX_DISTANCE_TO_DEPOSIT;

    // experimental logcontainer
    this.logContainer = new LogContainer(stats);

    // currently selected item (either automaticly, by mouse or q/e keys)
    this.selectedItem = null;
    this.selectableItems = [];
    this.selectGraphic = new PIXI.Graphics();
    this.drawable_container.addChild(this.selectGraphic);

    this.stats = stats;
    this.logsRemaining = logsRemaining;
  }

  getContainer() {
    return this.drawable_container;
  }

  // TODO: maybe keep up with the log count in pickLog, depositLog functions to avoid unnecessary for looping
  logCount() {
    return this.logContainer.getLogCount();
  }

  getSpeed(reverse = false) {

      // If there are logs in the truck increase fuel consumption by a load factor
      var loadFactor = this.logCount();
      var velocity = this.settings.VELOCITY - (this.settings.VELOCITY - this.settings.MIN_VELOCITY) * loadFactor / (this.settings.MAX_LOAD_FACTOR);
      return reverse ?  velocity * this.settings.REVERSE_VELOCITY_FACTOR :  velocity;
  }

  update(timeDelta, stopAutomaticCamera = false) {
    // stopping automatic camera updates untill we move truck next time
    if(stopAutomaticCamera) this.forceCameraMovement = false;
    this.move(timeDelta);
    this.updateCamera();
    this.checkLogs();
    this.checkDeposits();
    this.draw();
    this.stats.calculateMovement(this.currentSegment.getPositionAt(this.pointDelta));
    this.stats.calculateFuel(this.logContainer.getLogCount());
  }

  move(timeDelta) {
    var direction = 0;


    if(this.controls.isKeyDown(Key.Up)) {
      // when we start moving we force the camera to center again
      this.forceCameraMovement = true;

      // when direction changes
      if(this.previous_direction === -1) {
        // experimental index suggestion
        this.routeIndex = this.currentSegment.getNextNode().getSuggestedSegment(this.currentSegment, this.arrowSprite)['index'];
      }

      this.previous_direction = 1;
      direction = 1;
    }

    if(this.controls.isKeyDown(Key.Down)) {
      // when we start moving we force the camera to center again
      this.forceCameraMovement = true;

      // when direction changes
      if(this.previous_direction === 1) {
        // experimental index suggestion
        this.routeIndex = this.currentSegment.getPreviousNode().getSuggestedSegment(this.currentSegment, this.arrowSprite)['index'];
      }

      this.previous_direction = -1;
      direction = -1;
    }

    if (this.controls.wasKeyPressed(Key.Q)) {
      this.selectNearbyItemAtDir(1);
    }

    if (this.controls.wasKeyPressed(Key.E)) {
      this.selectNearbyItemAtDir(-1);
    }

    if(this.controls.wasKeyPressed(Key.Space)) {
      this.doLogAction = true;
    } else {
      this.doLogAction = false;
    }

    // Selecting route if arrow keys were pressed
    if(this.controls.wasKeyPressed(Key.Left)) {
      ++this.routeIndex;
      var seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, 1) :
        this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, 1);
      this.routeIndex = seg['index'];
    } else if(this.controls.wasKeyPressed(Key.Right)) {
      --this.routeIndex;
      seg = this.previous_direction > 0 ? this.currentSegment.getNextNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, -1) :
        this.currentSegment.getPreviousNode().getSelectedSegment(this.currentSegment, this.routeIndex, this.arrowSprite, -1);
      this.routeIndex = seg['index'];
    }

    // Advance on route segment based on segment length
    var delta_move = (direction * this.getSpeed( direction !== 1 ) * timeDelta) / this.currentSegment.getLength();

    // checking road anomalies and act accordingly
    if(this.currentSegment.isRoadDead()) {
      this.pointDelta += delta_move * this.anomaly_settings.DEAD_ROAD_SPEED_FACTOR;
    } else if(this.currentSegment.getRoadWeightLimit() !== false && this.currentSegment.getRoadWeightLimit() < this.log_settings.Weight * this.logCount()) {
      this.pointDelta += delta_move * this.anomaly_settings.WEIGHT_LIMIT_EXCEED_SPEED_FACTOR;
    } else if(!this.currentSegment.canDriveTo(this.sprite.rotation, this.previous_direction)) {
      this.pointDelta += delta_move * this.anomaly_settings.ONE_DIR_ROAD_SPEED_FACTOR;
    } else {
      this.pointDelta += delta_move;
    }
    this.currentSegment.updateAnomalies(delta_move);

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
      var upfactor = this.camera_settings.CONVERGENCE_FACTOR;
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
      if (distanceToLog < this.settings.MAX_DISTANCE_TO_LOG) {
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

  // returns boolean if the log was picked up
  pickLog(log) {
    if(this.logContainer.addLog(log, this.sprite)) {
      this.stats.updateLogs(this.logContainer);
      this.logsRemaining[log.type] -= 1;
      this.stats.updateUI({
        logsRemainingOnGround: this.logsRemaining
      });
      this.stats.addLogDelay();      
      return true;
    }

    return false;
  }

  unloadLogTo(deposit) {
    if(this.logContainer.unloadLogTo(deposit, this.depositsOnLevel)) {
      this.stats.updateLogs(this.logContainer);   
      return true;
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
      this.drawable_container.removeChild(this.clawSprite);
      this.drawable_container.addChild(this.clawSprite);
      this.clawSprite.alpha = 1;
    }
  }
}
