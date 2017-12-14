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
    this.pointerSprite = new PIXI.Sprite.fromImage('./static/road_intersection.png');
    this.pointerSprite.anchor.set(0.5, 0.5);
    this.pointerSprite.scale.set(0.1);

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
    

    this.state = ToolState.Idle;
  }

  activate() {
    super.activate();
    this.stage.addChild(this.pointerSprite);
  }

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;
    this.pointerSprite.position.set(epos.x, epos.y);
    
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
    if (length(mouseInput.absDeltaDuringMouseDown) > 10)
      return;

    switch(this.state) {
      case ToolState.Idle:
        this.state = ToolState.Drawing;
        break;
      case ToolState.Drawing:
        this.startPoint = mouseInput.worldPosition;
        this.roadStartSprite.position.set(this.startPoint.x, this.startPoint.y);
        this.stage.addChild(this.tilingRoad);
        this.stage.addChild(this.roadStartSprite);
        break;
    }
  }
  keyDown(event) {}
  keyUp(event) {}
  deactivate() {
    super.deactivate();
    this.stage.removeChild(this.pointerSprite);
  }
}