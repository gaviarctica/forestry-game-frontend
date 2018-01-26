import * as PIXI from 'pixi.js';
import {normalize, isLeft, distance, length} from '../game/helpers';
import PlaceTool from './placetool';

export default class TruckTool extends PlaceTool {
  constructor(stage, level) {
    super(stage, level);

    var pointerSprite = PIXI.Sprite.fromImage('/static/truck.svg');
    pointerSprite.anchor.set(0.5, 0.5);
    pointerSprite.scale.set(0.1);
    pointerSprite.rotation += Math.PI / 2;
    this.pointerContainer.addChild(pointerSprite);

    // sprite which is shown on the map
    this.sprite = PIXI.Sprite.fromImage('/static/truck.svg');
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(0.1);
    this.sprite.rotation += Math.PI / 2;

    this.truck_direction = 1;

    this.minDistanceFromRoad = 30;
    this.maxDistanceFromRoad = 0;

    this.type = 0;
  }

  activate() {
    super.activate();
  }

  mouseMove(mouseInput) {
    super.mouseMove(mouseInput);
    // fixing direction after super has screwed it up
    if(this.truck_direction < 0) {
      this.pointerContainer.rotation = (this.pointerContainer.rotation + Math.PI) % (Math.PI * 2);
    }

    if (this.closestDistance < this.minDistanceFromRoad) {
      // do snapping to route
      var routeStart = this.closestRouteSeg.startNode.getPos();
      var routeEnd = this.closestRouteSeg.endNode.getPos();
      var mouseWorld = mouseInput.worldPosition;
      var d = this.closestDistance;

      // create perpendicular unit vector in relation to mousepos
      var perpV = {x: routeEnd.y - routeStart.y, y: -(routeEnd.x - routeStart.x)};
      perpV = normalize(perpV);
      if (!isLeft(routeStart, routeEnd, mouseInput.worldPosition)) {
          perpV.x *= -1;
          perpV.y *= -1;
      }

      // move from current position, perpendicular to the segment given distance
      var epos = {x: mouseWorld.x + perpV.x * d, y: mouseWorld.y + perpV.y * d};

      this.pointerContainer.position.set(epos.x, epos.y);
      this.pointerPos = epos;
    }
  }
  mouseDown(mouseInput) {

  }
  mouseUp(mouseInput) {
    super.mouseUp(mouseInput);

    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > this.minDistanceFromRoad)
      return;

    // console.log(mouseInput);
    if(mouseInput.event.data.originalEvent.which === 3) {
      this.swapTruckDirection();
    }
  }

  swapTruckDirection() {
    this.truck_direction *= -1;
    this.pointerContainer.rotation = (this.pointerContainer.rotation + Math.PI) % (Math.PI * 2);
  }

  placeItem(position, angle) {
    this.level.setStartingPosition(position);
    this.level.setTruckDirection(this.truck_direction);

    this.sprite.x = position.x;
    this.sprite.y = position.y;
    this.sprite.rotation = this.pointerContainer.rotation + Math.PI / 2;
    this.stage.addChild(this.sprite);
  }

  // TODO: change sprite
  setType(type) {
    this.type = type;
  }

  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
  }
}
