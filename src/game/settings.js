export default class Settings {
  // assigning in constants in constructor as workaround of not having class variables
  constructor() {
    this.map = {
      PIXELS_TO_METERS : 10
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


  }


}
