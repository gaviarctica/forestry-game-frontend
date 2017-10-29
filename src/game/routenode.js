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

  getSelectedSegment(current_segment, index, dir = 1) {
    var slength = this.segments.length;
    index = index < 0 ? this.segments.length-1 : index;
    index = index % slength;
    for(var i = 0; i < this.segments.length; ++i) {
      this.segments[i].setSelected(false);
    }

    if(this.segments[index] !== current_segment) {
      this.segments[index].setSelected();
      return {'seg':this.segments[index], 'index':index};
    }

    for(i = 0; i < this.segments.length; ++i) {
      if(this.segments[index] !== current_segment) {
        this.segments[index].setSelected();
        return {'seg':this.segments[index], 'index':index};
      }

      index = dir > 0 ? index + 1 : index - 1;
      index = index < 0 ? this.segments.length-1 : index;
      index = index % slength;
    }

    return {'seg':current_segment, 'index':index};
  }
}
