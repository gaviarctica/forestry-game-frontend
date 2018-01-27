import * as PIXI from 'pixi.js';
import {distance} from './helpers';
import Settings from './settings';

export default class Weather {
  constructor(stage, forest, level, truck, game, attr, min_max) {
    // game is needed for viewport
    this.game = game;

    this.stage = stage;
    this.level = level;
    this.truck = truck;
    this.forest = forest;

    this.weather_type = false;

    this.settings = new Settings();

    // checking fog weather type
    if(typeof attr != 'undefined' && attr.type === 'fog') {
      this.stage.children = [];

      this.visible_distance = attr.visibility;
      var fog_texture = PIXI.Texture.fromImage('/static/fog.png');
      var fog_size = {width:min_max.xMax-min_max.xMin + 2*this.settings.map.FOG_PADDING[0],
        height:min_max.yMax-min_max.yMin + 2*this.settings.map.FOG_PADDING[1]};
      var fog_tiling_sprite = new PIXI.extras.TilingSprite(fog_texture,fog_size.width,fog_size.height);
      fog_tiling_sprite.x = -(-min_max.xMin+this.settings.map.FOG_PADDING[0]);
      fog_tiling_sprite.y = -(-min_max.yMin+this.settings.map.FOG_PADDING[1]);
      fog_tiling_sprite.tileScale.set(0.1);
      fog_tiling_sprite.alpha = attr.density;
      this.weather_container = new PIXI.Container();
      this.weather_container.addChild(fog_tiling_sprite);

      this.weather_type = 'fog';
      this.calculateFilters(truck,forest,true);
    }

  }

  update(delta) {
    if(this.weather_type) {
      this.calculateFilters(this.truck,this.forest);
    }
  }

  // separateTrees(truck, forest) {
  //   var forest_filtered = new PIXI.Container();
  //   var forest_non_filtered = new PIXI.Container();
  //
  //   // separate trees into vision and in blurred vision
  //   var child_amount = forest.getTreeContainer().children.length;
  //   var children = forest.getTreeContainer().children;
  //
  //   for(var i = 0; i < child_amount; ++i) {
  //     if(typeof children[i] == 'undefined') {
  //       continue;
  //     }
  //
  //     var temp_distance = distance({x:children[i].x, y:children[i].y}, truck.sprite.position);
  //
  //     if(temp_distance > this.visible_distance) {
  //
  //       forest_filtered.addChild(children[i]);
  //     } else if (temp_distance <= this.visible_distance) {
  //       forest_non_filtered.addChild(children[i]);
  //     }
  //   }
  //
  //
  //   return { forest_filtered: forest_filtered, forest_non_filtered: forest_non_filtered };
  // }

  calculateFilterArea(truck) {
    var truck_viewport = {
      x : this.game.screen.x + this.game.screen.width / 2 - this.visible_distance * this.stage.scale.x + (this.truck.sprite.x - this.stage.pivot.x) * this.stage.scale.x,
      y : this.game.screen.y + this.game.screen.height / 2 - this.visible_distance * this.stage.scale.y + (this.truck.sprite.y - this.stage.pivot.y) * this.stage.scale.x
    };

    var area = new PIXI.Rectangle(truck_viewport.x , truck_viewport.y,
      2*this.visible_distance * this.stage.scale.x, 2*this.visible_distance * this.stage.scale.y);

    return area;
  }

  calculateFilters(truck,forest, clear = false) {

    if(clear) {
      let blur = new PIXI.filters.BlurFilter();
      blur.blur = 10;

      this.weather_container.filters = [blur];
      this.weather_container.filters.blendMode = PIXI.BLEND_MODES.ADD;

      let vfilter = new PIXI.filters.VoidFilter();
      // level viewport
      this.level.filters = [vfilter];
      this.level.filterArea = this.calculateFilterArea(truck);

      // truck viewport
      truck.getContainer().filters = [vfilter];
      truck.getContainer().filterArea = this.calculateFilterArea(truck);

      // regenerate stage
      this.stage.addChild(forest.getGroundContainer());
      this.stage.addChild(forest.getTreeContainer());
      this.stage.addChild(this.weather_container);
      this.stage.addChild(this.level);
      this.stage.addChild(truck.getContainer());
    } else {
      // level viewport
      this.level.filterArea = this.calculateFilterArea(truck);

      // truck viewport
      truck.getContainer().filterArea = this.calculateFilterArea(truck);

    }

  }
}
