import styles from './_Mesh.scss';
import React  from 'react';
import chroma from 'chroma-js';

let { PropTypes } = React;

export default class Mesh extends React.Component {

  static defaultProps = {
    colour: '#BE2761'
  };

  static propTypes = {
    items: PropTypes.string
  };

  componentDidMount() {
    // Needs setTimeout as offsetWidth/offsetHeight seem to be
    // getting the wrong dimensions on pageload
    setTimeout(() => {
      this.container = React.findDOMNode(this);

      this.renderer = new FSS.CanvasRenderer();
      this.scene    = new FSS.Scene();
      this.light    = new FSS.Light('#880066', this.props.colour);
      this.geometry = new FSS.Plane(this.container.offsetWidth, this.container.offsetHeight, 12, 10);
      this.material = new FSS.Material('#555555', '#ffffff');
      this.mesh     = new FSS.Mesh(this.geometry, this.material);
      this.now      = Date.now();
      this.start    = Date.now();

      this.light.ambient.set('#333333');
      this.light.setPosition(-this.container.offsetWidth/3, this.container.offsetHeight/2, 1000);
      this.scene.add(this.mesh);
      this.scene.add(this.light);

      this.finalLightColour = this.light.diffuse.hex;
      this.chromaScale = chroma.scale([this.finalLightColour, this.finalLightColour]);
      this.chromaStep  = 0;

      window.mesh = this;

      this.container.appendChild(this.renderer.element);
      window.addEventListener('resize', this.resize);
      window.light = this.light;

      this.resize();
      this.tweakMesh();
      this.animate();
    }, 10);
  }

  componentDidUpdate(newProps) {
    // this.light.diffuse.set(this.props.colour);
    if (this.props.colour !== this.finalLightColour) {
      newProps.colour = chroma(newProps.colour).brighten().hex();
      this.animateLightTo(newProps.colour);
    }
  }

  resize = () => {
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
  }

  animateLightTo(colour) {
    var currentLightColour = this.light.diffuse.format();
    this.finalLightColour  = this.props.colour;
    this.chromaScale = chroma.scale([currentLightColour, this.finalLightColour]);
    this.chromaStep  = 0;
  }

  animate = () => {
    this.now = Date.now() - this.start;
    this.distortMesh();

    var newLightColour = this.chromaScale(this.chromaStep).hex();
    this.light.diffuse.set(newLightColour);
    this.chromaStep += 0.1;

    this.renderer.render(this.scene);
    // requestAnimationFrame(this.animate);
    setTimeout(this.animate, 100);
  }

  tweakMesh() {
    var v, vertex;

    for (v = this.geometry.vertices.length - 1; v >= 0; v--) {
          vertex = this.geometry.vertices[v];
          vertex.anchor = FSS.Vector3.clone(vertex.position);
          vertex.step = FSS.Vector3.create(
            Math.randomInRange(0.2, 1.0),
            Math.randomInRange(0.2, 1.0),
            Math.randomInRange(0.2, 1.0)
          );
      vertex.time = Math.randomInRange(0, Math.PIM2);
    }
  }

  distortMesh() {
    var v,
      vertex,
      ox, oy, oz,
      offset = 10 / 2,
      force = 0.005;

    // var extra = keydown ? 1.005 : 0;
    var extra = 0;

    for (v = this.geometry.vertices.length - 1; v >= 0; v--) {
      vertex = this.geometry.vertices[v];
      ox = Math.sin(vertex.time + vertex.step[0] * this.now * force * extra);
      oy = Math.cos(vertex.time + vertex.step[1] * this.now * force);
      oz = Math.sin(vertex.time + vertex.step[2] * this.now * force);
      FSS.Vector3.set(vertex.position,
        0.2 * this.geometry.segmentWidth * ox,
        0.1 * this.geometry.sliceHeight * oy,
        0.7 * offset * oz - offset);
      FSS.Vector3.add(vertex.position, vertex.anchor);
    }

    this.geometry.dirty = true;
  }

  render() {
    return (
      <div className={styles.mesh} style={{backgroundColor: this.finalLightColour}}>

      </div>
    );
  }
}
