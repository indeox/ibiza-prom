import styles from './_Body.scss';
import React from 'react';
import moment from 'moment';

import Menu from '../Menu/Menu';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import TweetWall   from '../TweetWall/TweetWall';
import TweetGraph  from '../TweetGraph/TweetGraph';
import AppActions from '../../actions/AppActions';

let { PropTypes } = React;

export default class Body extends React.Component {

  static defaultProps = {
    items: [],
    tweets: [],
    time:  0,
    state: {}
  };

  static propTypes = {
    items: PropTypes.array.isRequired
  };

  state = { hasStarted: false }

  start = () => {
    this.setState({ hasStarted: true });
    AppActions.jumpVideoTo(0);
  }

  componentWillUpdate(nextProps, nextState) {

  }

  render() {
    var headerStyle = {
      color:     this.props.colourScheme[4],
      textAlign: this.props.promProgress > 31 ? 'left' : 'right'
    };

    var promTimeStyle = {
      color:           this.props.primaryColour,
      backgroundColor: this.props.colourScheme[5]
    }

    var promPrettyTime = moment(this.props.state.promLocalTime).utcOffset(1).format('hh:mm:ssa');

    var startButtonStyle = {
      opacity: this.props.videoReady ? 1 : 0.3
    };

    var startButtonClass = this.props.videoReady ? 'fa fa-play-circle' : 'fa fa-circle-o-notch fa-spin';

    var highlightStyle = {
      color: this.props.colourScheme[4]
    }

    var videoContainerStyle = {
      visibility: this.state.hasStarted == true ? 'visible' : 'hidden',
      position:   this.state.hasStarted == true ? 'static'  : 'absolute'
    };

    // var trackInfoStyle = {
    //   opacity: this.props.track.title ? 0.5 : 0
    // };

    return (
      <div className={styles.body}>
        <h1 className={styles.header} style={headerStyle}>#IbizaProm Replay</h1>

        <TweetGraph {...this.props} active={this.state.hasStarted} />

        <div className={styles.intro} style={{ display: this.state.hasStarted == true ? 'none' : 'block' }}>
          <p>On July 29th 2015, for the BBC Proms season, <a href="http://www.bbc.co.uk/radio1" target="_new">Radio 1</a> celebrated their 20 year association with Ibiza by enlisting the <a href="http://www.theheritageorchestra.com/" target="_new">Heritage Orchestra</a> to play over twenty classic club tracks for their first night out at the Proms, turning the Royal Albert Hall into one giant nightclub and throwing the poshest rave in London.</p>
          <p>This is an experimental hack to replay the concert, in sync with all the tweets published on that evening. <em>Best viewed on larger screens. While it works on mobile, it's not an optimal experience.</em></p>
          <p>Hit <strong>Play</strong> below to kick it off.</p>

          <button className={styles.startbutton} style={startButtonStyle} onClick={this.start}>
            <i className={startButtonClass}></i>
          </button>
        </div>

        <div className={styles.videocontainer} style={videoContainerStyle}>
          <VideoPlayer/>

          <div className={styles.description}>
            <p><i className="fa fa-info-circle"></i> This is an experimental hack, attempting to synchronise the Radio 1 Ibiza Prom with the tweets of the night, exactly as they happened.</p>
            <p>It was made purely for the fun of it, and as a proof of concept, it may sometimes behave erratically. If all fails, you can still enjoy the fantastic gig for what it was. Any comments, fire them at <a href="https://twitter.com/indeox" target="_new" style={highlightStyle}>@indeox</a></p>
          </div>
          {
            /*<h2 className={styles.track} style={trackInfoStyle}>{this.props.track.title}</h2>
            <p className={styles.artist} style={trackInfoStyle}>{this.props.track.artist}</p>*/
          }
        </div>

        <TweetWall {...this.props}/>
      </div>
    );
  }
}
