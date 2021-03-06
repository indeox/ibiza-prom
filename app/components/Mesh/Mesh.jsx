import styles from './_Mesh.scss';
import React  from 'react';
import chroma from 'chroma-js';
import favicolor from 'favicolor';
import _ from 'lodash';

let { PropTypes } = React;

// This is a really crappy way to disable the Mesh rendering
// on touch devices (the assumption is that it's too battery intensive)
var hasTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints;

export default class Mesh extends React.Component {

  static defaultProps = {
    colour:         '#BE2761',
    simpleMode:     hasTouch ? true : false,
    meshUpdateInMs: 60
  };

  static propTypes = {
    items: PropTypes.string
  };

  constructor() {
    super();

    this.resize = _.debounce(this.resize, 500).bind(this);
    this.state  = { opacity: 0 };
  }

  componentDidMount() {
    // Needs setTimeout as offsetWidth/offsetHeight seem to be
    // getting the wrong dimensions on pageload
    setTimeout(() => {
      this.container = React.findDOMNode(this);
      this.faviconEl = document.querySelector('[rel=icon]');

      this.renderer = new FSS.CanvasRenderer();
      this.buildScene();
      this.container.appendChild(this.renderer.element);

      window.addEventListener('resize', this.resize);

      window.mesh = this;
      window.light = this.light;

      if (!this.props.simpleMode) {
        this.animate();
      }

      this.setState({ opacity: 1 });
    }, 10);
  }

  componentDidUpdate(newProps) {
    // this.light.diffuse.set(this.props.colour);
    if (this.props.colour !== this.finalLightColour) {
      newProps.colour = chroma(newProps.colour).brighten(1).hex();
      this.animateLightTo(newProps.colour);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.colour !== nextProps.colour;
  }

  buildScene = () => {
    delete this.scene;
    var docSize = this.getDocSize();
    this.renderer.setSize(docSize[0], docSize[1]);

    this.scene    = new FSS.Scene();
    this.light    = new FSS.Light('#880066', this.props.colour);
    this.geometry = new FSS.Plane(docSize[0] + 60, docSize[1] + 30, 12, 10);
    this.material = new FSS.Material('#555555', '#ffffff');
    this.mesh     = new FSS.Mesh(this.geometry, this.material);
    this.now      = Date.now();
    this.start    = Date.now();

    this.light.ambient.set('#880066');
    this.light.setPosition(0, this.container.offsetHeight/2, 300);
    //this.mesh.setPosition(90,20);
    this.scene.add(this.mesh);
    this.scene.add(this.light);

    this.finalLightColour = this.light.diffuse.hex;
    this.chromaScale = chroma.scale([this.finalLightColour, this.finalLightColour]);
    this.chromaStep  = 0;

    this.tweakMesh();
  }

  resize = () => {
    var docSize = this.getDocSize();
    this.buildScene();
    this.renderer.setSize(docSize[0], docSize[1]);
  }

  getDocSize() {
    var body = document.body;
    var html = document.documentElement;

    var width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth);
    var height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

    return [width, height];
  }

  animateLightTo(colour) {
    if (!this.light) { return; }

    var currentLightColour = this.light.diffuse.format();
    this.finalLightColour  = this.props.colour;
    this.chromaScale = chroma.scale([currentLightColour, this.finalLightColour]);
    this.chromaStep  = 0;

    // favicolor(this.faviconEl, this.finalLightColour);
  }

  animate = () => {
    this.now = Date.now() - this.start;
    this.distortMesh();

    // Animate the new colour
    var newLightColour = this.chromaScale(this.chromaStep).hex();
    this.light.diffuse.set(newLightColour);
    this.chromaStep += (this.props.meshUpdateInMs/1000);

    this.renderer.render(this.scene);

    // requestAnimationFrame(this.animate);

    setTimeout(() => {
      requestAnimationFrame(this.animate);
    }, this.props.meshUpdateInMs);
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
      <div className={styles.mesh + ' bg-primary'} style={{ opacity: this.state.opacity }}/>
    );
  }
}
