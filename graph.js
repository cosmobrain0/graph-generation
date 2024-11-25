class Graph {
  constructor(f, min, max) {
    this.f = f;
    this.min = min;
    this.max = max;
  }

  evaluate(x) {
    return x <= this.max && x >= this.min ? this.f(x) : null;
  }

  scaleX(scalar) {
    return new Graph(
      x => this.f(x/scalar),
      this.min*scalar,
      this.max*scalar,
    );
  }

  scaleY(scalar) {
    return new Graph(
      x => this.f(x) * scalar,
      this.min,
      this.max
    )
  }

  translateX(scalar) {
    return new Graph(
      x => this.f(x-scalar),
      this.min+scalar,
      this.max+scalar,
    )
  }

  translateY(scalar) {
    return new Graph(
      x => this.f(x) + scalar,
      this.min,
      this.max
    )
  }

  lerpTo(minX, maxX, minY, maxY) {
    return this
      .scaleX(maxX-minX)
      .scaleY(maxY-minY)
      .translateX(minX)
      .translateY(minY);
  }

  lerpFrom(minX, maxX, minY, maxY) {
    return this.translateX(-minX)
      .translateY(-minY)
      .scaleX(1/(maxX-minX))
      .scaleY(1/(maxY-minY));
  }

  static fromPointsAndGradients(x1, y1, m1, x2, y2, m2) {
    m1 *= (x2-x1)/(y2-y1);
    m2 *= (x2-x1)/(y2-y1);
    let a = m1 + m2 - 2;
    let b = 3 - 2*m1 - m2;
    let c = m1;
    let normalised = new Graph(x => a*x*x*x + b*x*x + c*x, 0, 1);
    return normalised.lerpTo(x1, x2, y1, y2);
  }

  static fromManyPoints(points) {
    let graphs = [];

    let m1 = (points[1][1]-points[0][1])/(points[1][0]-points[0][0]);
    for (let i=1; i<points.length-1; i++) {
      let m2left = (points[i][1]-points[i-1][1])/(points[i][0]-points[i-1][0]);
      let m2right = (points[i+1][1]-points[i][1])/(points[i+1][0]-points[i][0]);
      let m2 = (m2left + m2right)/2;

      graphs.push(Graph.fromPointsAndGradients(points[i-1][0], points[i-1][1], m1, points[i][0], points[i][1], m2));

      m1 = m2;
    }
    let m2 = (points[points.length-1][1]-points[points.length-2][1])/(points[points.length-1][0]-points[points.length-2][0]);
    graphs.push(Graph.fromPointsAndGradients(points[points.length-2][0], points[points.length-2][1], m1, points[points.length-1][0], points[points.length-1][1], m2));

    // return graphs;
    return new Graph(
      x => {
        for (let graph of graphs) {
          let y = graph.evaluate(x);
          if (y != null) return y;
        }
        return null;
      },
      0,
      1
    );
  }
}
