import * as PIXI from 'pixi.js';
import {distance, distanceToSegment} from './helpers';
import Settings from './settings';

export default class Forest {

	constructor(stage, mapdata, min_max) {

		this.stage = stage;
		this.ground_container = new PIXI.Container();
		this.tree_container = new PIXI.Container();
		this.settings = new Settings();

		this.mapdata = mapdata;
		this.randomTrees = [
			'/static/tree1.svg',
			'/static/tree1.svg', // Make tree1 twice as likely
			'/static/tree2.svg',
			'/static/tree3.svg',
			'/static/stump.svg'
		];
		this.scales = [0.09, 0.095, 0.1, 0.105, 0.11];
		this.obstacles = [];
		this.distanceToRoad = 60;
		this.distanceToLog = 60;
		this.distanceToLogDeposit = 100;
		this.rockFrequency = 0.5;

		// this.xMin = this.yMin = this.xMax = this.yMax = 0;
		this.xMin = min_max.xMin;
		this.yMin = min_max.yMin;
		this.xMax = min_max.xMax;
		this.yMax = min_max.yMax;

		for (var i = 0; i < this.mapdata.logdeposits.length; i++) {
			this.obstacles.push({type:'logdeposit', x:this.mapdata.logdeposits[i].x, y:this.mapdata.logdeposits[i].y});
			// this.updateMinMax(this.mapdata.logdeposits[i]);

		}
		for (i = 0; i < this.mapdata.logs.length; i++) {
			this.obstacles.push({type:'log', x:this.mapdata.logs[i].x, y:this.mapdata.logs[i].y});
		}
		for (i = 0; i < this.mapdata.routes.length; i++) {
			for (var j = 0; j < this.mapdata.routes[i].to.length; j++) {
				var start = {x:this.mapdata.routes[i].x,y:this.mapdata.routes[i].y};
				var end = {
					x: this.mapdata.routes[this.findNodeIndexByID(this.mapdata.routes[i].to[j])].x,
					y: this.mapdata.routes[this.findNodeIndexByID(this.mapdata.routes[i].to[j])].y
				};
				this.obstacles.push({type:'route', startpoint:start, endpoint:end});
			}
			// this.updateMinMax(this.mapdata.routes[i]);
		}
	}

	buildGround() {
		var texure = PIXI.Texture.fromImage('/static/ground.svg');
		var map_size = {
			width: this.xMax-this.xMin,
			height: this.yMax-this.yMin
		};
		var tilingSprite = new PIXI.extras.TilingSprite(
			texure,
			map_size.width + 2*this.settings.map.FOREST_PADDING[0],
			map_size.height + 2*this.settings.map.FOREST_PADDING[1]
		  );
		tilingSprite.x = -(-this.xMin + this.settings.map.FOREST_PADDING[0]);
		tilingSprite.y = -(-this.yMin + this.settings.map.FOREST_PADDING[1]);
		tilingSprite.tileScale.set(0.05);
		// clearing ground container
		this.ground_container.removeChildren();
		this.ground_container.addChild(tilingSprite);
		//this.stage.addChild(this.ground_container);
	}

	getGroundContainer() {
		return this.ground_container;
	}

	buildTrees() {
		var inrange = false;
		var inrange_rock = false;
		var y = this.yMin - this.settings.map.FOREST_PADDING[1];
		var x = this.xMin - this.settings.map.FOREST_PADDING[0];
		while (y <= (this.yMax + this.settings.map.FOREST_PADDING[1])) {
			x = this.xMin - this.settings.map.FOREST_PADDING[0];
			while (x <= (this.xMax + this.settings.map.FOREST_PADDING[0])) {
				inrange = false;
				inrange_rock = false;
				//Check that no logs, roads, logdeposits, etc in the way
				//Random offset per tree in square
    			//if square is from 0 to 100, get offset from 30 to 70
    			var x_offset = x + (Math.floor(Math.random() * (70 - 30 + 1)) + 30);
				var y_offset = y + (Math.floor(Math.random() * (70 - 30 + 1)) + 30);
				var x_offset_rock = x + (Math.floor(Math.random() * (90 - 10 + 1)) + 10);
				var y_offset_rock = y + (Math.floor(Math.random() * (90 - 10 + 1)) + 10);

				inrange = this.checkRange(this.obstacles, x_offset, y_offset);
				inrange_rock = this.checkRange(this.obstacles, x_offset_rock, y_offset_rock);

				if (!inrange_rock && Math.random() < this.rockFrequency) {
					this.drawSprite('/static/rock.svg', x_offset_rock, y_offset_rock);
				}

				if (!inrange) {
					this.drawSprite(this.randomTrees[Math.floor(Math.random()*this.randomTrees.length)], x_offset, y_offset);
				}

				x = x + 100;
			}
			y = y + 100;
		}
	}

	getTreeContainer() {
		return this.tree_container;
	}

	updateMinMax(point) {
		if (point.x < this.xMin) this.xMin = point.x;
		if (point.y < this.yMin) this.yMin = point.y;
		if (point.x > this.xMax) this.xMax = point.x;
		if (point.y > this.yMax) this.yMax = point.y;
	}

	checkRange(obstacles, x, y) {
		for (var i = 0; i < obstacles.length; i++) {
			if (obstacles[i].type === 'route' && distanceToSegment({x:x, y:y}, obstacles[i].startpoint, obstacles[i].endpoint) < this.distanceToRoad) {
				return true;
			}
			else if (obstacles[i].type === 'log' && distance({x:x, y:y}, {x:obstacles[i].x, y:obstacles[i].y}) < this.distanceToLog) {
				return true;
			}
			else if (obstacles[i].type === 'logdeposit' && distance({x:x, y:y}, {x:obstacles[i].x, y:obstacles[i].y}) < this.distanceToLogDeposit) {
				return true;
			}
		}
		return false;
	}

	drawSprite(path, x, y) {
		this.sprite = PIXI.Sprite.fromImage(path);
		this.sprite.anchor.set(0.5);

		//Random scale from 0.1 to 0.2 and rotation from 0 to 2*pi
		this.sprite.scale.set(this.scales[Math.floor(Math.random()*this.scales.length)]);
		this.sprite.rotation = Math.random()*2*Math.PI;

		this.sprite.position.x = x;
		this.sprite.position.y = y;
		this.tree_container.addChild(this.sprite);
	}

	findNodeIndexByID(ID) {
		for (let i = 0; i < this.mapdata.routes.length; i++) {
			if (this.mapdata.routes[i].route_node === ID) {
				return i;
			}
		}
	}
}
