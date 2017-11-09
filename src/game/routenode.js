export default class RouteNode {
  constructor(point, segments) {
    this.point = point;
    this.segments = segments;
  }

  addSegment( segment ) {
    // making adding segment secure (check if segment is already added)
    for(var i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] === segment && this.segments[i] === segment)
        return;
    }

    this.segments.push(segment);
  }

  getSegments() {
    return this.segments;
  }

  getPos() {
    return this.point;
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

    for(var i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] !== current_segment) {
        var value = (this.segments[i].getRotation(this) + current_segment.getRotation(this)) / (Math.PI / 2) - 1;
        value = Math.abs(value);
        if(value < best_value) {
          best_value = value;
          index = i;
        }
      }
    }

    if(index == -1) {
      return {'seg':current_segment, 'index':0};
    }

    this.segments[index].setSelected();
    this.setArrowPos(arrowSprite, this.segments[index].getRotation(this));
    console.log("The Last Index: " + index);
    console.log("Segment amount: " + this.segments.length);
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
