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

  getSelectedSegment(current_segment, index) {
    var slength = this.segments.length;
    index = index % slength;
    index = index < 0 ? -index : index;

    for(var i = 0; i < this.segments.length; ++i) {
      this.segments[i].setSelected(false);
    }

    if(this.segments[index] !== current_segment) {
      this.segments[index].setSelected();
      return this.segments[index];
    }

    for(i = 0; i < this.segments.length; ++i) {
      if(this.segments[i] !== current_segment) {
        this.segments[i].setSelected();
        return this.segments[i];
      }
    }

    return current_segment;
  }
}
