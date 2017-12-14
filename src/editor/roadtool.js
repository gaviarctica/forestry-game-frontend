import ITool from './itool';
import * as PIXI from 'pixi.js';
import {length, distance} from '../game/helpers';

var ToolState = {
  Idle: 1,
  Drawing: 2
};

export default class RoadTool extends ITool {
  constructor(stage, level) {
    super(stage);
   
    this.level = level;
    
    var pointerSprite = new PIXI.Sprite.fromImage('./static/road_intersection.png');
    pointerSprite.anchor.set(0.5, 0.5);
    pointerSprite.scale.set(0.1);

    var pointerCircle = new PIXI.Graphics();
    pointerCircle.lineStyle(2, 0xffd900);
    pointerCircle.drawCircle(0,0,50 / 2.0);

    this.pointerContainer = new PIXI.Container();
    this.pointerContainer.addChild(pointerSprite);
    this.pointerContainer.addChild(pointerCircle);

    this.roadStartSprite = new PIXI.Sprite.fromImage('./static/road_intersection.png');
    this.roadStartSprite.anchor.set(0.5, 0.5);
    this.roadStartSprite.scale.set(0.1);

    var texture = PIXI.Texture.fromImage('./static/road.png');
    
    this.tilingRoad = new PIXI.extras.TilingSprite(
      texture, 
      50,
      0
    );
    this.tilingRoad.anchor.set(0.5, 0.0);
    this.tilingRoad.tileScale.set(0.1);
    
    this.previousNodeId = -1;
    this.state = ToolState.Idle;

    this.snappedToNodeId = -1;
    this.snappingDistance = 25;
  }

  activate() {
    super.activate();
    this.stage.addChild(this.pointerContainer);
  }

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;

    // do a search for nearest node in snapping distance
    this.snappedToNodeId = -1;
    for (let [id, routeNode] of this.level.getRouteNodes()) {
      if (distance(mouseInput.worldPosition, routeNode.getPos()) < this.snappingDistance) {
        this.pointerContainer.position.set(routeNode.getPos().x, routeNode.getPos().y);
        this.snappedToNodeId = id;
        epos = routeNode.getPos();
        break;
      }
    }

    this.pointerContainer.position.set(epos.x, epos.y);
    
    if (this.state === ToolState.Drawing) {
      var spos = this.startPoint;

      var angle = Math.atan2(epos.y - spos.y, epos.x - spos.x) + Math.PI/2;
      var currentPos = {x: spos.x, y: spos.y};
      var roadSprite;
      var distanceToEnd = 0;
      var height = distance(spos, epos);
      this.tilingRoad.rotation = angle + Math.PI;
      this.tilingRoad.x = currentPos.x;
      this.tilingRoad.y = currentPos.y;
      this.tilingRoad.height = height;
    }
  }
  mouseDown(mouseInput) {

  }
  mouseUp(mouseInput) {
    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;
    console.log("roadtool mouseup")
    switch(this.state) {
      case ToolState.Idle:
        this.state = ToolState.Drawing;
        
        if (this.snappedToNodeId < 0) {
          this.startPoint = mouseInput.worldPosition;
        } else {
          this.startPoint = this.level.getRouteNodes().get(this.snappedToNodeId).getPos();
        }

        this.roadStartSprite.position.set(this.startPoint.x, this.startPoint.y);
        this.stage.addChild(this.tilingRoad);
        this.stage.addChild(this.roadStartSprite);
        // .. make the 'pointer' to draw on top
        this.stage.swapChildren(this.roadStartSprite, this.pointerContainer);

        if (this.snappedToNodeId > 0) {
          this.previousNodeId = this.snappedToNodeId;
        }

        break;
      case ToolState.Drawing:
        
        this.endPoint = mouseInput.worldPosition;
        if (distance(this.startPoint, this.endPoint) < 20) {
          this.state = ToolState.Idle;
          this.stage.removeChild(this.tilingRoad);
          this.stage.removeChild(this.roadStartSprite);
          this.previousNodeId = -1;
        } else {
          this.addRouteSegment(this.previousNodeId, this.snappedToNodeId);
        }

        if (this.previousNodeId < 0) {
          this.startPoint = mouseInput.worldPosition;
        } else {
          this.startPoint = this.level.getRouteNodes().get(this.previousNodeId).getPos();
        }
        
        this.level.refreshRoutes();

        break;
    }
  }

  addRouteSegment(startNodeId, endNodeId) {

    // if no start node, create a new node
    if (startNodeId < 0) {
      startNodeId = this.level.getNextRouteNodeId();
      this.level.addRouteNode(startNodeId, this.startPoint, []);
    }

    // also if no end node, create a new node
    if (endNodeId < 0) {
      endNodeId = this.level.getNextRouteNodeId();
      this.level.addRouteNode(endNodeId, this.endPoint, []);
    }

    // build segment between'em
    this.level.getRouteNodes().get(startNodeId).to.push(endNodeId);
    this.level.getRouteNodes().get(endNodeId).to.push(startNodeId);

    this.previousNodeId = endNodeId;
  }

  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
    this.stage.removeChild(this.pointerContainer);
    this.stage.removeChild(this.tilingRoad);
    this.stage.removeChild(this.roadStartSprite);
  }
}