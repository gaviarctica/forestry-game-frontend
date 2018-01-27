import ITool from './itool';
import * as PIXI from 'pixi.js';
import {length, distance} from '../game/helpers';
import Settings from '../game/settings';

export const AnomalyType = [
  { type : 'weightlimit', name : 'weight_limit' },
  { type : 'dying', name : 'dying_road' },
  { type : 'oneway', name : 'one_way_road' }
];


export function nodeHasAnomalyTo(node,to_node) {
    var rnode = null;
    var anomaly_index = -1;

    if(!node || !to_node)
      return {node:rnode, anomaly_index:anomaly_index};

    for(var i = 0; i < node.anomalies.length; ++i) {

      if(node.anomalies[i].to === to_node.getId()) {
        rnode = node;
        anomaly_index = i;
        break;
      }
    }

    return {node:rnode, anomaly_index:anomaly_index};
}

export default class AnomalyTool extends ITool {
  constructor(stage, level, type) {
    super(stage);

    this.level = level;

    this.settings = new Settings().anomalies;
    this.log_settings = new Settings().log;

    // type of the anomaly tool
    this.type = type;

    this.weight_limit_pointer_sprite = null;
    this.dying_road_pointer_sprite = null;
    this.one_way_road_pointer_sprite = null;

    if(this.type === AnomalyType[0].type) {
      this.current_pointer_sprite = this.getWeightLimitPointerSprite();
    } else if( this.type === AnomalyType[1].type ) {
      this.current_pointer_sprite = this.getDyingRoadPointerSprite();
    } else if( this.type === AnomalyType[2].type ) {
      this.current_pointer_sprite = this.getOneWayRoadPointerSprite();
    }

    this.pointerContainer.addChild(this.current_pointer_sprite);

    this.anomaly_container = new PIXI.Container();

    this.snappedToSegment = null;
    this.snappingDistance = 35;

    this.currentMousePosition = null;
  }

  getWeightLimitPointerSprite() {
    if(this.weight_limit_pointer_sprite === null) {
      this.weight_limit_pointer_sprite = new PIXI.Text( 0 + 'kg',this.settings.WEIGHT_LIMIT_TEXT_FONT);

      this.weight_limit_pointer_sprite.anchor.set(0.5, 0.5);
      this.weight_limit_pointer_sprite.scale.set(this.settings.WEIGHT_LIMIT_TEXT_SCALE);
    }

    return this.weight_limit_pointer_sprite;
  }

  getDyingRoadPointerSprite() {
    if(this.dying_road_pointer_sprite === null) {
      this.dying_road_pointer_sprite = new PIXI.Text( 0 + 'm',this.settings.DYING_ROAD_TEXT_FONT);

      this.dying_road_pointer_sprite.anchor.set(0.5);
      this.dying_road_pointer_sprite.scale.set(this.settings.DYING_ROAD_TEXT_SCALE);
    }

    return this.dying_road_pointer_sprite;
  }

  getOneWayRoadPointerSprite() {
    if(this.one_way_road_pointer_sprite === null) {
      this.one_way_road_pointer_sprite = new PIXI.Sprite.fromImage('/static/road_oneway.png');
      this.one_way_road_pointer_sprite.anchor.set(0.5, 0.5);
      this.one_way_road_pointer_sprite.scale.set(this.settings.ONE_DIR_ARROW_SPRITE_SCALE);
      this.one_way_road_pointer_sprite.rotation = -Math.PI / 2;
    }

    return this.one_way_road_pointer_sprite;
  }

  calculateSnappedSegment(mousePos) {
    // do a search for nearest node in snapping distance
    this.snappedToSegment = null;
    this.level.refreshRoutes();

    var segments = this.level.getRouteSegments();
    var segment_amount = segments.length;

    for (var i = 0; i < segment_amount; ++i) {
      var segment = segments[i];
      var segment_pos = {
        x: (segment.endNode.getPos().x + segment.startNode.getPos().x) / 2,
        y: (segment.endNode.getPos().y + segment.startNode.getPos().y) / 2
      };

      if (distance(mousePos, segment_pos) < this.snappingDistance) {
        this.pointerContainer.position.set(segment_pos.x, segment_pos.y);
        this.snappedToSegment = segment;
        break;
      }
    }

    return this.snappedToSegment;
  }

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;
    this.pointerContainer.position = epos;

    this.calculateSnappedSegment(epos);

    //toggling visibility of pointer if we have snapped and there is anomaly

    if(this.snappedToSegment !== null
      && (nodeHasAnomalyTo(this.snappedToSegment.startNode,this.snappedToSegment.endNode).node
      || nodeHasAnomalyTo(this.snappedToSegment.endNode,this.snappedToSegment.startNode).node)) {
      this.snappedToSegment.weight_limit_text.style.fill = this.settings.SNAPPED_HIGHLIGHT_COLOR;
      this.snappedToSegment.dying_road_text.style.fill = this.settings.SNAPPED_HIGHLIGHT_COLOR;
      this.pointerContainer.visible = false;
    } else {
      this.pointerContainer.visible = true;
    }

    this.currentMousePosition = mouseInput.worldPosition;

  }

  updateAnomalyInfo(segment, anomaly_name) {
    var node = null;
    var anomaly_index = -1;

    // getting all available anomaly info from the nodes
    var snode = nodeHasAnomalyTo(segment.startNode,segment.endNode);
    var enode = nodeHasAnomalyTo(segment.endNode,segment.startNode);
    var node_data = snode.node ? snode : enode;

    if (!node_data.node) {
      segment.startNode.anomalies.push({to:segment.endNode.getId(), [anomaly_name]:1});
      segment.weight_limit = 1;
      node = segment.startNode;
      anomaly_index = node.anomalies.length - 1;
    } else {
      node = node_data.node;
      anomaly_index = node_data.anomaly_index;
    }

    return {node:node, anomaly_index:anomaly_index};
  }



  mouseUp(mouseInput) {
    // mouse moved aka moved the viewport so don't do the action

    var node_data;
    var anomaly_row;

    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;

    if(this.snappedToSegment !== null) {
      // weight limit
      if(this.type === AnomalyType[0].type) {
        node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[0].name);

        this.snappedToSegment.weight_limit = node_data.node.anomalies[node_data.anomaly_index].weight_limit;

      } else if(this.type === AnomalyType[1].type) {
        node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[1].name);

        this.snappedToSegment.dying_road = node_data.node.anomalies[node_data.anomaly_index].dying_road;
      } else if(this.type === AnomalyType[2].type) {
        node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[2].name);
        if(node_data.node === this.snappedToSegment.startNode) {
          anomaly_row = { to:node_data.node.getId(),[AnomalyType[2].name]:1 };
          this.snappedToSegment.endNode.anomalies.push(anomaly_row);
          if(node_data.node.anomalies.length > 1) {
            node_data.node.anomalies.splice(node_data.anomaly_index, 1);
          } else {
            node_data.node.anomalies = [];
          }
        }
        else if (node_data.node === this.snappedToSegment.endNode) {
          anomaly_row = { to:this.snappedToSegment.endNode.getId(),[AnomalyType[2].name]:1 };
          this.snappedToSegment.startNode.anomalies.push(anomaly_row);

          if(node_data.node.anomalies.length > 1) {
            node_data.node.anomalies.splice(node_data.anomaly_index, 1);
          } else {
            node_data.node.anomalies = [];
          }
        }
      }

      if(this.type === AnomalyType[0].type)
        this.snappedToSegment.weight_limit_text.text = node_data.node.anomalies[node_data.anomaly_index].weight_limit + 'kg';
      else if(this.type === AnomalyType[1].type)
        this.snappedToSegment.dying_road_text.text = node_data.node.anomalies[node_data.anomaly_index].dying_road + 'm';

        // refreshing routes to keep ui look responsive
        this.calculateSnappedSegment(this.currentMousePosition);
        if(this.snappedToSegment) {
          // adjusting the color after the changes to text
          this.snappedToSegment.weight_limit_text.style.fill = this.settings.SNAPPED_HIGHLIGHT_COLOR;
          this.snappedToSegment.dying_road_text.style.fill = this.settings.SNAPPED_HIGHLIGHT_COLOR;
          this.pointerContainer.visible = false;
        } else {
          this.pointerContainer.visible = true;
        }
    }
  }

  mouseWheelEvent(event) {

    var node_data;
    var absval;

    if(this.snappedToSegment) {
      // weight limit update
      if(this.type === AnomalyType[0].type) {
        node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[0].name);

          if(!node_data.node.anomalies[node_data.anomaly_index][AnomalyType[0].name] &&
          node_data.node.anomalies[node_data.anomaly_index][AnomalyType[0].name] !== 0) return false;

        if(event.deltaY < 0) {
          node_data.node.anomalies[node_data.anomaly_index].weight_limit = node_data.node.anomalies[node_data.anomaly_index].weight_limit + this.log_settings.Weight;
          this.snappedToSegment.weight_limit = node_data.node.anomalies[node_data.anomaly_index].weight_limit;
        } else if(node_data.node.anomalies[node_data.anomaly_index].weight_limit > 0){
          absval = node_data.node.anomalies[node_data.anomaly_index].weight_limit - this.log_settings.Weight;
          absval = absval < 0 ? 0 : absval;
          node_data.node.anomalies[node_data.anomaly_index].weight_limit = absval;
          this.snappedToSegment.weight_limit = node_data.node.anomalies[node_data.anomaly_index].weight_limit;
        }

      }
      // dead road update
      else if(this.type === AnomalyType[1].type) {
        node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[1].name);

        if(!node_data.node.anomalies[node_data.anomaly_index][AnomalyType[1].name] &&
        node_data.node.anomalies[node_data.anomaly_index][AnomalyType[1].name] !== 0) return false;

        if(event.deltaY < 0) {
          node_data.node.anomalies[node_data.anomaly_index].dying_road = node_data.node.anomalies[node_data.anomaly_index].dying_road + 1;
          this.snappedToSegment.dying_road = node_data.node.anomalies[node_data.anomaly_index].dying_road;
        } else if(node_data.node.anomalies[node_data.anomaly_index].dying_road > 0){
          absval = node_data.node.anomalies[node_data.anomaly_index].dying_road - 1;
          absval = absval < 0 ? 0 : absval;
          node_data.node.anomalies[node_data.anomaly_index].dying_road = absval;
          this.snappedToSegment.dying_road = node_data.node.anomalies[node_data.anomaly_index].dying_road;
        }
      }

      if(this.type === AnomalyType[0].type)
        this.snappedToSegment.weight_limit_text.text = node_data.node.anomalies[node_data.anomaly_index].weight_limit + 'kg';
      else if(this.type === AnomalyType[1].type)
        this.snappedToSegment.dying_road_text.text = node_data.node.anomalies[node_data.anomaly_index].dying_road + 'm';

      // refreshing routes to keep ui look responsive
      this.calculateSnappedSegment(this.currentMousePosition);
      if(this.snappedToSegment) {
        // adjusting the color after the changes to text
        this.snappedToSegment.weight_limit_text.style.fill = this.settings.SNAPPED_HIGHLIGHT_COLOR;
        this.snappedToSegment.dying_road_text.style.fill = this.settings.SNAPPED_HIGHLIGHT_COLOR;
        this.pointerContainer.visible = false;
      } else {
        this.pointerContainer.visible = true;
      }

      return true;
    }

    return false;

  }

  keyDown(event) {
    super.keyDown(event);
  }

  keyUp(event) {
    var self = this;
    if(self.snappedToSegment) {
      // getting all available anomaly info from the nodes
      var snode = nodeHasAnomalyTo(self.snappedToSegment.startNode,self.snappedToSegment.endNode);
      var enode = nodeHasAnomalyTo(self.snappedToSegment.endNode,self.snappedToSegment.startNode);
      var node_data = snode.node ? snode : enode;
      if(node_data.node) {
        var number = parseInt(event.key, 10);
        if(number || number === 0) {
          // adding number
          if(self.type === AnomalyType[0].type &&
            (node_data.node.anomalies[node_data.anomaly_index][AnomalyType[0].name] || node_data.node.anomalies[node_data.anomaly_index][AnomalyType[0].name] === 0)) {
              node_data.node.anomalies[node_data.anomaly_index].weight_limit =
              node_data.node.anomalies[node_data.anomaly_index].weight_limit * 10 + number;
          } else if(self.type === AnomalyType[1].type &&
            (node_data.node.anomalies[node_data.anomaly_index][AnomalyType[1].name] || node_data.node.anomalies[node_data.anomaly_index][AnomalyType[1].name] === 0)) {
              node_data.node.anomalies[node_data.anomaly_index].dying_road =
              node_data.node.anomalies[node_data.anomaly_index].dying_road * 10 + number;
          }
        }
      } else if (!node_data.node) {
        // when we know we have no anomalies, just initialize the values

        if(self.type === AnomalyType[0].type) {
          self.snappedToSegment.startNode.anomalies.push({to:self.snappedToSegment.endNode.getId(), weight_limit:1});
          self.snappedToSegment.weight_limit = 1;
        } else if(self.type === AnomalyType[1].type) {
          self.snappedToSegment.startNode.anomalies.push({to:self.snappedToSegment.endNode.getId(), dying_road:1});
          self.snappedToSegment.anomalies = self.snappedToSegment.startNode.anomalies;
        }
      }

      // checking backspace
      if( event.key === 'Backspace' && node_data.node) {
          // decreasing number
          if(self.type === AnomalyType[0].type && node_data.node.anomalies[node_data.anomaly_index][AnomalyType[0].name]) {
            node_data.node.anomalies[node_data.anomaly_index].weight_limit =
            Math.floor(node_data.node.anomalies[node_data.anomaly_index].weight_limit / 10);
          } else if(self.type === AnomalyType[1].type && node_data.node.anomalies[node_data.anomaly_index][AnomalyType[1].name]) {
            node_data.node.anomalies[node_data.anomaly_index].dying_road =
            Math.floor(node_data.node.anomalies[node_data.anomaly_index].dying_road / 10);
          }
      }

      // refreshing routes to keep ui look responsive
      self.calculateSnappedSegment(self.currentMousePosition);
      // adjusting the color after the changes to segments
      self.snappedToSegment.weight_limit_text.style.fill = self.settings.SNAPPED_HIGHLIGHT_COLOR;
      self.snappedToSegment.dying_road_text.style.fill = self.settings.SNAPPED_HIGHLIGHT_COLOR;
      self.pointerContainer.visible = false;
    } else {
      self.pointerContainer.visible = true;
    }

    super.keyUp(event);
  }

  activate() {
    super.activate();
    this.stage.addChildAt(this.anomaly_container,2);
  }

  deactivate() {
    super.deactivate();
    this.stage.removeChild(this.anomaly_container);
  }
}
