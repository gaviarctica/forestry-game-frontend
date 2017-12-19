export default class Settings {
  // assigning in constants in constructor as workaround of not having class variables
  constructor() {
    this.map = {
      PIXELS_TO_METERS : 10,
      // Graphics
      ROAD_SPRITE_LENGTH : 50,
      TILING_SPRITE_ANCHOR : [0.5,0.0],
      TILING_SPRITE_SCALE : 0.1,
      INTERSECTION_SPRITE_ANCHOR : 0.5,
      INTERSECTION_SPRITE_SCALE : 0.1,
      // actions
      MOUSE_WHEEL_SCALE : [0.05,0.05]
    };

    this.truck = {
      // can be lower with reverse
      MIN_VELOCITY : 1.0,
      REVERSE_VELOCITY_FACTOR : 0.5,
      // default velocity
      VELOCITY : 5.0,
      // graphics
      SPRITE_ANCHOR : 0.5,
      SPRITE_SCALE : 0.1,
      CLAW_SPRITE_ANCHOR : 0.5,
      CLAW_SPRITE_SCALE : 0.1,
      ARROW_SPRITE_ANCHOR : 0.5,
      ARROW_SPRITE_SCALE: 0.2,
      // other
      // 10 -> 1m
      MAX_DISTANCE_TO_DEPOSIT : 150,
      MAX_DISTANCE_TO_LOG : 100,
      // affects speed when there are logs loaded
      MAX_LOAD_FACTOR: 16

    };

    this.camera = {
      // speed that camera follows the truck
      CONVERGENCE_FACTOR : (1 / 60)
    };

    this.stats = {
      BASE_MILEAGE : 5,
      LOG_FACTOR : 0.5,
      SALARY : 20,
      HOUR : 3600,
      DIESEL_PRICE : 1.2,
      // ui
      FUEL_USED_DECIMALS : 2
    };

    this.log_deposit = {
      Width : 150,
      Height : 50,
      Outline : 4,
      Color : 0xAAAAAA,
      LOG_SPRITE_SCALE : 0.1
    }

    this.log = {
      Width : 50,
      Height : 5,
      Outline : 4,
      // Graphics
      SPRITE_ANCHOR : 0.5,
      SPRITE_SCALE : 0.1
    }


  }


}
