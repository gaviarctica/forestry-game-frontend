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
      FULL_START_STOP_TIME : 3,
      SHORT_START_STOP_TIME : 1, 
      // average velocity in m/s
      AVG_VELOCITY : 3,
      LOG_DELAY : 15,
      BASE_MILEAGE : 5,
      LOG_FACTOR : 0.5,
      SALARY : 20,
      HOUR : 3600,
      DIESEL_PRICE : 1.2,
      // ui
      FUEL_USED_DECIMALS : 2,
      FUEL_COST_DECIMALS : 2,
      WORKER_SALARY_DECIMALS : 2,
      DISTANCE_MOVED_DECIMALS : 2,
      TOTAL_COST_DECIMALS : 2,
      VOLUME_DECIMALS : 2
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
      Weight : 50,
      // Graphics
      SPRITE_ANCHOR : 0.5,
      SPRITE_SCALE : 0.1
    }

    this.productivity = {
      // Volume of cylinder = pi*r^2*h (with these values approx 0.98, width and height divided by 10)
      Volume : Math.PI * Math.pow(((this.log.Height / 10) / 2), 2) * (this.log.Width / 10)
    }

    this.anomalies = {
      DEAD_ROAD_SPEED_FACTOR : 0.01,
      DYING_ROAD_TEXT_FONT : {fontFamily : 'Arial', fontSize: 80, fill : 0xFF9898, align : 'center', stroke : 0x111111, strokeThickness : 10},
      DYING_ROAD_TEXT_SCALE : 1/3,
      DEAD_ROAD_TEXT_SCALE : [0.1,0.1],
      WEIGHT_LIMIT_TEXT_FONT : {fontFamily : 'Arial', fontSize: 80, fill : 0xC5B4AA, align : 'center', stroke : 0x111111, strokeThickness : 10},
      WEIGHT_LIMIT_TEXT_SCALE : 1/3,
      WEIGHT_LIMIT_EXCEED_SPEED_FACTOR : 0.01,
      ONE_DIR_ARROW_SPRITE_ANCHOR : 0.5,
      ONE_DIR_ARROW_SPRITE_SCALE: 0.2,
      ONE_DIR_ROAD_SPEED_FACTOR: 0.01
    }

    this.debug = {
      FRAMERATE_COUNTER : false
    }

  }


}
