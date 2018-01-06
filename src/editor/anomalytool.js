import ITool from './itool';
import * as PIXI from 'pixi.js';
import {length, distance} from '../game/helpers';
import Settings from '../game/settings';

export const AnomalyType = [
  { type : 'weightlimit', name : 'weight_limit' },
  { type : 'dying', name : 'dying_road' }
];

export default class AnomalyTool extends ITool {
  constructor(stage, level, type) {
    super(stage);

    this.level = level;

    this.settings = new Settings().anomalies;

    // type of the anomaly tool
    this.type = type;

    this.weight_limit_pointer_sprite = null;
    this.dying_road_pointer_sprite = null;

    if(this.type == AnomalyType[0].type) {
      this.current_pointer_sprite = this.getWeightLimitPointerSprite();
    } else if( this.type == AnomalyType[1].type ) {
      this.current_pointer_sprite = this.getDyingRoadPointerSprite();
    }

    this.pointerContainer.addChild(this.current_pointer_sprite);

    this.anomaly_container = new PIXI.Container();

    this.snappedToSegment = null;
    this.snappingDistance = 35;
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

  mouseMove(mouseInput) {
    var epos = mouseInput.worldPosition;
    this.pointerContainer.position = epos;

    // do a search for nearest node in snapping distance
    this.snappedToSegment = null;
    this.level.refreshRoutes();

    var segments = this.level.getRouteSegments();
    var segment_amount =  segments.length;

    for (var i = 0; i < segment_amount; ++i) {
      var segment = segments[i];
      var segment_pos = {
        x: (segment.endNode.getPos().x + segment.startNode.getPos().x) / 2,
        y: (segment.endNode.getPos().y + segment.startNode.getPos().y) / 2
      };

      if (distance(mouseInput.worldPosition, segment_pos) < this.snappingDistance) {
        this.pointerContainer.position.set(segment_pos.x, segment_pos.y);
        this.snappedToSegment = segment;
        epos = segment_pos;
        break;
      }
    }

    //toggling visibility of pointer if we have snapped and there is anomaly

    if(this.snappedToSegment !== null
      && (this.nodeHasAnomalyTo(this.snappedToSegment.startNode,this.snappedToSegment.endNode).node
      || this.nodeHasAnomalyTo(this.snappedToSegment.endNode,this.snappedToSegment.startNode).node)) {
      this.snappedToSegment.weight_limit_text.style.fill = 0x00FF00;
      this.snappedToSegment.dying_road_text.style.fill = 0x00FF00;
      this.pointerContainer.visible = false;
    } else {
      this.pointerContainer.visible = true;
    }

  }

  nodeHasAnomalyTo(node,to_node) {
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

  updateAnomalyInfo(segment, anomaly_name) {
    var node = null;
    var anomaly_index = -1;

    if (segment.startNode.anomalies.length === 0 && segment.endNode.anomalies.length === 0) {
      segment.startNode.anomalies.push({to:segment.endNode.getId(), [anomaly_name]:1});
      segment.weight_limit = 1;
      node = segment.startNode;
      anomaly_index = node.anomalies.length - 1;
    } else {
      // grinding through startnode anomalies
      var node_data = this.nodeHasAnomalyTo(segment.startNode,segment.endNode);

      // if node is not still defined trying endnode
      if(!node_data.node) {
        node_data = this.nodeHasAnomalyTo(segment.endNode,segment.startNode);
      }

      // if we have not found connections we just create it
      if(!node_data.node) {
        segment.startNode.anomalies.push({to:segment.endNode.getId(),[anomaly_name]:1});
        segment.weight_limit = 1;
        node = segment.startNode;
        anomaly_index = node.anomalies.length - 1;
      } else {
        node = node_data.node;
        anomaly_index = node_data.anomaly_index;
      }
    }

    return {node:node, anomaly_index:anomaly_index};
  }



  mouseUp(mouseInput) {
    // mouse moved aka moved the viewport so don't do the action
    if (length(mouseInput.absDeltaDuringMouseDown) > 20)
      return;

    if(this.snappedToSegment !== null) {
      // weight limit
      if(this.type === AnomalyType[0].type) {
        var node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[0].name);

        console.log(node_data);

        this.snappedToSegment.weight_limit = node_data.node.anomalies[node_data.anomaly_index].weight_limit;

      } else if(this.type === AnomalyType[1].type) {
        var node_data = this.updateAnomalyInfo(this.snappedToSegment, AnomalyType[1].name);

        this.snappedToSegment.dying_road = node_data.node.anomalies[node_data.anomaly_index].dying_road;
      }

      console.log(node_data.node.anomalies);

      if(this.type === AnomalyType[0].type)
        this.snappedToSegment.weight_limit_text.text = node_data.node.anomalies[node_data.anomaly_index].weight_limit + 'kg';
      else if(this.type === AnomalyType[1].type)
        this.snappedToSegment.dying_road_text.text = node_data.node.anomalies[node_data.anomaly_index].dying_road + 'm';


    }
  }

  keyDown(event) {
    super.keyDown(event);
  }

  keyUp(event) {
    var self = this;
    if(self.snappedToSegment) {
      // with other anomalies it'll probably be necessary to check both directions
      // weight limit is updated with number keys
      if(this.keyWasDown && self.snappedToSegment.startNode.anomalies.length !== 0) {
        var number = parseInt(event.key);
        if(number || number === 0) {
          if (this.snappedToSegment.startNode.anomalies.length === 0 && this.snappedToSegment.endNode.anomalies.length === 0) {
            if(this.type === AnomalyType[0].type) {
              this.snappedToSegment.startNode.anomalies = [{to:this.snappedToSegment.endNode.getId(), weight_limit:1}];
              this.snappedToSegment.weight_limit = 1;
            } else if(this.type === AnomalyType[1].type) {
              this.snappedToSegment.startNode.anomalies = [{to:this.snappedToSegment.endNode.getId(), dying_road:1}];
              this.snappedToSegment.anomalies = this.snappedToSegment.startNode.anomalies;
            }
          } else {
            if(this.type === AnomalyType[0].type) {
              self.snappedToSegment.startNode.anomalies[0].weight_limit =
              self.snappedToSegment.startNode.anomalies[0].weight_limit * 10 + number;
            } else if(this.type === AnomalyType[1].type) {
              this.snappedToSegment.startNode.anomalies[0].dying_road =
              this.snappedToSegment.startNode.anomalies[0].dying_road * 10 + number;
            }

          }
        } else if(event.key === 'Backspace') {
          if(!(self.snappedToSegment.startNode.anomalies.length === 0 && self.snappedToSegment.endNode.anomalies.length === 0)) {
            if(this.type === AnomalyType[0].type) {
              self.snappedToSegment.startNode.anomalies[0].weight_limit =
              Math.floor(self.snappedToSegment.startNode.anomalies[0].weight_limit / 10);
            } else if(this.type === AnomalyType[1].type) {
              this.snappedToSegment.startNode.anomalies[0].dying_road =
              Math.floor(this.snappedToSegment.startNode.anomalies[0].dying_road / 10);
            }

          }
        }

        // refreshing routes to keep ui look responsive
        self.level.refreshRoutes();
      }
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
