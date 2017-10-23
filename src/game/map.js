

export default class Map {
	constructor(stage) {
		this.stage = stage;

		this.drawRoutes();
	}

	drawRoutes() {
		var routeGraphics = new PIXI.Graphics();
	    routeGraphics.lineStyle(50, 0xa57d4c, 1);

	    for (var i = 0; i < MAP.routes.length; i++) {
	      for (var j = 0; j < MAP.routes[i].length; j++) {
	        var pos = MAP.routes[i][j];
	        if (j === 0) {
	          routeGraphics.moveTo(pos.x, pos.y);
	        } else {
	          routeGraphics.lineTo(pos.x, pos.y);
	        }
	      }
	    }

	    routeGraphics.endFill();
	    this.stage.addChild(routeGraphics);
	}
}