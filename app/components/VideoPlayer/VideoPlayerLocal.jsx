import styles from './_VideoPlayer.scss';
import AppActions from '../../actions/AppActions';
import React from 'react';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import { TIME_UPDATED } from '../../constants/AppConstants';
var videojs = require('video.js');

window.videojs = videojs;
var videojsYT = require('../../../node_modules/videojs-youtube/dist/Youtube.js');
// window.videojs = videojs;
// import videojsYT from '../../../node_modules/videojs-youtube/dist/Youtube.js';

import _ from 'lodash';

let { Component, PropTypes } = React;

export default class VideoPlayer extends Component {

  videoAtStart = false;

  state = { videoWidth: 640, height: 340 }

  componentDidMount = () => {
    let self = this;
    this.container = React.findDOMNode(this);
    this.playerNode = this.refs.videoPlayer.getDOMNode();
    window.addEventListener('resize', this.resize);

    var playerOpts = {
      techOrder: ['html5', 'youtube'],
      sources: [
        // { type: 'video/mp4',     src: 'http://localhost:8888/ibizaprom/ibizaprom.mp4' },
        { type: 'video/youtube', src: 'https://www.youtube.com/watch?v=xs3BXVTF7mw' }
      ]
    };

    this.player = videojs(this.playerNode, playerOpts, function() {
      this.volume(0);
      this.play();

      this.on('play', () => {
        if (!this.videoAtStart) {
          // This is a horrible hack to work around YouTube's 'Remember video position feature'
          // that keep starting the video midway through, if you're logged in to YT
          this.volume(0);
          this.currentTime(0);
          this.pause();
          this.volume(1);
          this.videoAtStart = true;
          AppActions.videoReady();
        }

        self.interval = setInterval(() => {
          AppActions.setTime(self.player.currentTime());
        }, 500)
      });

      this.on('pause', () => {
        if (self.interval) {
          clearInterval(self.interval);
        }
      });

      // This is just in case the play doesn't fire the ready event
      setTimeout(() => {
        this.volume(1);
        AppActions.videoReady();
      }, 10 * 1000);
    });

    AppDispatcher.register((action) => {
      switch(action.actionType) {
        case 'VIDEO_JUMPTO':
          this.player.currentTime(action.time);
          this.player.play();
          break;
        default:
      }
    });

    this.resize();
  }

  resize = _.debounce(() => {
    var videoWidth = this.container.getBoundingClientRect().width;

    this.setState({
      videoWidth:  videoWidth,
      videoHeight: videoWidth * 0.5625
    });
  }, 250)

  render() {
    return (
      <div className={styles.video}>
        <video
          ref="videoPlayer"
          id="video"
          className="video-js vjs-16-9 vjs-default-skin"
          controls
          preload="auto"
          width={this.state.videoWidth}
          height={this.state.videoHeight}
        >
        </video>
      </div>
    );
  }
}
