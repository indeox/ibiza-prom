import styles from './_VideoPlayer.scss';
import AppActions from '../../actions/AppActions';
import React from 'react';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import { TIME_UPDATED } from '../../constants/AppConstants';
import _ from 'lodash';

let { Component, PropTypes } = React;

export default class VideoPlayer extends Component {

  componentDidMount = () => {
    this.container = React.findDOMNode(this);
    window.onYouTubeIframeAPIReady = this.loadPlayer;
    window.addEventListener('resize', this.resize);

    // Load YouTube iFrame API
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    this.container.appendChild(tag)

    AppDispatcher.register((action) => {
      switch(action.actionType) {
        case 'VIDEO_JUMPTO':
          this.player.seekTo(action.time);
          this.player.playVideo();
          break;
        default:
      }
    });

  }

  onPlayerReady() {
    AppActions.videoReady();
  }

  onPlayerStateChange = (event) => {
    if (event.data == YT.PlayerState.PLAYING) {
      this.interval = setInterval(() => {
        AppActions.setTime(this.player.getCurrentTime());
      }, 250)
    }

    if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }

  resize = _.debounce(() => {
    let videoWidth = this.player.f.parentNode.getBoundingClientRect().width;
    this.player.setSize(videoWidth, videoWidth * 0.5625);
  }, 250)

  loadPlayer = () => {
    var videoWidth = this.container.getBoundingClientRect().width;

    this.player = new YT.Player('player', {
      width:       videoWidth,
      height:      videoWidth * 0.5625,
      videoId:     'xs3BXVTF7mw',
      startSeconds: 0,
      playerVars: {
        controls: 1,
        enablejsapi: 1,
        modestbranding: 1,
        rel: 0,
        origin: window.location.href
      },
      events: {
        'onReady':       this.onPlayerReady,
        'onStateChange': this.onPlayerStateChange
      }
    });
  }

  render() {
    return (
      <div id="player" className={styles.video}>

      </div>
    );
  }
}
