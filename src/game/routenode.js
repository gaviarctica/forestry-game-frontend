import {lerp, distance} from './helpers';

export default class RouteNode {
  constructor(point, segments) {
    this.point = point;
    this.segments = segments;
  }

  addSegment( segment ) {
    // making adding segment secure (check if segment is already added)
    for(var i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] == segment && this.segments[i] == segment)
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

  getSelectedSegment(current_segment, index) {
    var slength = this.segments.length;
    index = index % slength;
    for(var i = 0; i < this.segments.length; ++i) {
      --index;
      this.segments[i].setSelected(false);

      if(index <= 0 && this.segments[i] != current_segment) {
        this.segments[i].setSelected(true);
        return this.segments[i];
      }
    }

    for(var i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] != current_segment) {
        this.segments[i].setSelected();
        return this.segments[i];
      }
    }

    return current_segment;
  }
}
