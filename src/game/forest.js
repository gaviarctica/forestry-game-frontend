import * as PIXI from 'pixi.js';
import {lerp, distance, distanceToSegment} from './helpers';

export default class Forest {

	constructor(stage, mapdata) {

		this.stage = stage;
		this.mapdata = mapdata;
		this.randomTrees = ['/static/tree1.svg', '/static/tree2.svg'];
		this.scales = [0.9,1.0,1.1];
		this.obstacles = [];
		this.distanceToRoad = 60;
		this.distanceToLog = 60;
		this.distanceToLogDeposit = 100;
		
		for (var i = 0; i < this.mapdata.logdeposits.length; i++) {
			this.obstacles.push({type:'logdeposit', x:this.mapdata.logdeposits[i].x, y:this.mapdata.logdeposits[i].y});
		}
		for (var i = 0; i < this.mapdata.logs.length; i++) {
			this.obstacles.push({type:'log', x:this.mapdata.logs[i].x, y:this.mapdata.logs[i].y});
		}
		for (var i = 0; i < this.mapdata.routes.length; i++) {
			for (var j = 0; j < this.mapdata.routes[i].to.length; j++) {
				var start = {x:this.mapdata.routes[i].x,y:this.mapdata.routes[i].y};
				var end = {x:this.mapdata.routes[this.mapdata.routes[i].to[j]-1].x,y:this.mapdata.routes[this.mapdata.routes[i].to[j]-1].y};
				this.obstacles.push({type:'route', startpoint:start, endpoint:end});
			}
		}
	}

	buildTrees() {
		var inrange = false;
		for (var y = -50; y < 50; y++) {
			for (var x = -50; x < 50; x++) {
				inrange = false;
				//Check that no logs, roads, logdeposits, etc in the way
				//Random offset per tree in square
    			//if square is from 0 to 100, get offset from 30 to 70
    			var x_offset = x*100 + (Math.floor(Math.random() * (70 - 30 + 1)) - 30);
    			var y_offset = y*100 + (Math.floor(Math.random() * (70 - 30 + 1)) - 30);
				for (var i = 0; i < this.obstacles.length; i++) {
					if (this.obstacles[i].type === 'route' && distanceToSegment({x:x_offset, y:y_offset}, this.obstacles[i].startpoint, this.obstacles[i].endpoint) < this.distanceToRoad) {
						inrange = true;
						break;
					}
					else if (this.obstacles[i].type === 'log' && distance({x:x_offset, y:y_offset}, {x:this.obstacles[i].x, y:this.obstacles[i].y}) < this.distanceToLog) {
						inrange = true;
						break;
					}
					else if (this.obstacles[i].type === 'logdeposit' && distance({x:x_offset, y:y_offset}, {x:this.obstacles[i].x, y:this.obstacles[i].y}) < this.distanceToLogDeposit) {
						inrange = true;
						break;
					}
				}

				if (inrange) continue;
				
				this.sprite = PIXI.Sprite.fromImage(this.randomTrees[Math.floor(Math.random()*this.randomTrees.length)]);
				this.sprite.anchor.set(0.5);

				//Random scale from 0.1 to 0.2 and rotation from 0 to 2*pi
    			this.sprite.scale.set(this.scales[Math.floor(Math.random()*this.scales.length)]);
				this.sprite.rotation = Math.random()*2*Math.PI;

    			this.sprite.position.x = x_offset;
    			this.sprite.position.y = y_offset;
    			this.stage.addChild(this.sprite);
			}
		}
	}
}