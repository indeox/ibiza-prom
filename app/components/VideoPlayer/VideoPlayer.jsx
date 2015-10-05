import styles from './_VideoPlayer.scss';
import AppActions from '../../actions/AppActions';
import React from 'react';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import { TIME_UPDATED } from '../../constants/AppConstants';

let { Component, PropTypes } = React;

export default class VideoPlayer extends Component {

  componentDidMount = () => {
    this.container = React.findDOMNode(this);
    window.onYouTubeIframeAPIReady = this.loadPlayer;

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

  }

  onPlayerStateChange = (event) => {
    if (event.data == YT.PlayerState.PLAYING) {
      this.interval = setInterval(() => {
        AppActions.setTime(this.player.getCurrentTime());
      }, 100)
    }

    if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
      if (this.interval) {
        clearInterval(this.interval);
      }
    }
  }

  loadPlayer = () => {
    var videoWidth = this.container.offsetWidth;

    this.player = new YT.Player('player', {
      width:       videoWidth,
      height:      videoWidth * 0.5625,
      videoId:     'xs3BXVTF7mw',
      startSeconds: 0,
      playerVars: { controls: 1, enablejsapi: 1, modestbranding: 1, rel: 0 },
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
