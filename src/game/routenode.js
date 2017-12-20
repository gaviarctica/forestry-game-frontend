export default class RouteNode {
  constructor(id, point, to, anomalies = null) {
    this.reset(id, point, to, anomalies);
  }

  reset(id, point, to, anomalies) {
    this.id = id
    this.point = point;
    this.to = to;
    this.segments = [];
    if(anomalies !== null) {
      this.anomalies = anomalies;
    } else {
      this.anomalies = [];
    }
  }

  addSegment( segment ) {
    // making adding segment secure (check if segment is already added)
    for(var i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] === segment && this.segments[i] === segment)
        return;
    }

    this.segments.push(segment);
  }

  hasSegmentWithNodes(node1, node2) {
    for (var seg of this.segments) {
      if ((seg.startNode === node1 && seg.endNode === node2)
          || seg.startNode === node2 && seg.endNode === node1) {
            return true;
      }
    }
    return false;
  }

  getSegments() {
    return this.segments;
  }

  getPos() {
    return this.point;
  }

  getId() {
    return this.id;
  }

  getTo() {
    return this.to;
  }

  getSelectedSegment(current_segment, index, arrowSprite, dir = 1) {
    var slength = this.segments.length;
    index = index < 0 ? this.segments.length-1 : index;
    index = index % slength;

    // unselecting all the segments (to not accidentially select multiple segments)
    for(var i = 0; i < this.segments.length; ++i) {
      this.segments[i].setSelected(false);
      this.hideArrow(arrowSprite);
    }

    if(this.segments[index] !== current_segment) {
      this.segments[index].setSelected();
      this.setArrowPos(arrowSprite, this.segments[index].getRotation(this));
      return {'seg':this.segments[index], 'index':index};
    }

    for(i = 0; i < this.segments.length; ++i) {
      if(this.segments[index] !== current_segment) {
        this.segments[index].setSelected();
        this.setArrowPos(arrowSprite, this.segments[index].getRotation(this));
        return {'seg':this.segments[index], 'index':index};
      }

      index = dir > 0 ? index + 1 : index - 1;
      index = index < 0 ? this.segments.length-1 : index;
      index = index % slength;
    }

    return {'seg':current_segment, 'index':index};
  }

  getSuggestedSegment(current_segment, arrowSprite) {
    var index = -1;
    var best_value = 100;

    // unselecting all the segments (to not accidentially select multiple segments)
    for(var i = 0; i < this.segments.length; ++i) {
      this.segments[i].setSelected(false);
      this.hideArrow(arrowSprite);
    }

    for(i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] !== current_segment) {
        var value_1 = Math.abs(((this.segments[i].getRotation(this) + Math.PI / 2) + (current_segment.getRotation(this) + Math.PI / 2))) * 180 / Math.PI;
        var value_2 = Math.abs(((this.segments[i].getRotation(this) + Math.PI / 2) - (current_segment.getRotation(this) + Math.PI / 2))) * 180 / Math.PI;
        var value = value_1 < value_2 ? value_1 : value_2;

        value = Math.abs(value - 180);
        if(value < best_value) {
          best_value = value;
          index = i;
        }
      }
    }

    if(index === -1) {
      return {'seg':current_segment, 'index':0};
    }

    this.segments[index].setSelected();

    this.setArrowPos(arrowSprite, this.segments[index].getRotation(this));
    return {'seg':this.segments[index], 'index':index};

  }

  setArrowPos(arrowSprite, rotation) {
    // No arrow needed if only one way to go
    if (this.segments.length > 2) {
      arrowSprite.x = this.point.x;
      arrowSprite.y = this.point.y;
      arrowSprite.rotation = rotation - Math.PI / 2;
      arrowSprite.alpha = 1;
    }
  }

  hideArrow(arrowSprite) {
    arrowSprite.x = undefined;
    arrowSprite.y = undefined;
    arrowSprite.alpha = 0;
  }
}
