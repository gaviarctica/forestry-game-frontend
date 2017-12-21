import * as PIXI from 'pixi.js';
import {distance} from './helpers';
import Settings from './settings';

export default class Weather {
  constructor(stage, forest, level, truck, attr) {
    this.stage = stage;
    console.log(attr);

    this.visible_distance = 200;

    var forest_filtered = new PIXI.Container();
    var forest_non_filtered = new PIXI.Container();

    let colorMatrix = new PIXI.filters.ColorMatrixFilter();
    // new PIXI.filters.BlurFilter(strength, quality, resolution, kernelSize)
    let blur = new PIXI.filters.BlurFilter();
    blur.blur = 10;
    colorMatrix.night(0.1);

    var count = 0;
    // remove children
    this.stage.removeChildren();

    for(var i = 0; i < forest.getTreeContainer().children.length; ++i) {
      var temp_distance = distance({x:forest.getTreeContainer().children[i].x,y:forest.getTreeContainer().children[i].y}, truck.sprite.position);

      if(temp_distance > this.visible_distance) forest_filtered.addChild(forest.getTreeContainer().children[i]);
      else forest_non_filtered.addChild(forest.getTreeContainer().children[i]);
    }

    // doing filters
    forest.getGroundContainer().filters = [blur];
    forest_filtered.filters = [colorMatrix,blur];

    // regenerate stage
    this.stage.addChild(forest.getGroundContainer());
    this.stage.addChild(forest_filtered);
    this.stage.addChild(forest_non_filtered);
    this.stage.addChild(level);
    this.stage.addChild(truck.getContainer());

  }

  update(delta) {

  }
}
