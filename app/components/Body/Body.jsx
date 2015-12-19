import styles from './_Body.scss';
import React  from 'react';
import moment from 'moment';

import VideoPlayer from '../VideoPlayer/VideoPlayer';
import TweetWall   from '../TweetWall/TweetWall';
import TweetGraph  from '../TweetGraph/TweetGraph';
import AppActions  from '../../actions/AppActions';

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

  componentDidMount() {
    setTimeout(() => { this.setState({ headerActive:     true }) }, 1000);
    setTimeout(() => { this.setState({ tweetGraphActive: true }) }, 1500);
    setTimeout(() => { this.setState({ introTextActive:  true }) }, 2000);
  }

  start = () => {
    if (this.props.videoReady) {
      this.setState({ hasStarted: true });
      AppActions.jumpVideoTo(0);
    }
  }

  render() {
    var headerStyle = {
      textAlign: this.props.promProgress > 31 ? 'left' : 'right',
      opacity:   this.state.headerActive ? 1 : 0
    };

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
        <h1 className={styles.header + ' ' + styles.fade + ' color-4'} style={headerStyle}>
          <span className={styles.headerFade}>#</span>
          IbizaProm
          <span className={styles.headerFade}>Replay</span>
        </h1>

        <div className={styles.fade} style={{ opacity: this.state.tweetGraphActive ? 1 : 0}}>
          <TweetGraph {...this.props} active={this.state.hasStarted}/>
        </div>

        <div className={styles.intro + ' ' + styles.fade} style={{
          display: this.state.hasStarted == true ? 'none' : 'block',
          opacity: this.state.introTextActive ? 1 : 0
        }}>
          <p>On July 29th 2015, for the BBC Proms season, <a href="http://www.bbc.co.uk/radio1" target="_new">Radio 1</a> celebrated their 20 year association with Ibiza by enlisting the <a href="http://www.theheritageorchestra.com/" target="_new">Heritage Orchestra</a> to play over twenty classic club tracks for the station's first night out at the Proms, turning the Royal Albert Hall into one giant nightclub and throwing the poshest rave in London.</p>
          <p>This is an experimental hack to replay the concert, in sync with all the tweets published on that evening. <em>Best viewed on larger screens.</em></p>
          <p>Hit <strong>Play</strong> below to kick it off.</p>

          <button className={styles.startbutton} style={startButtonStyle} onClick={this.start}>
            <i className={startButtonClass}></i>
          </button>
        </div>

        <div className={styles.videocontainer} style={videoContainerStyle}>
          <VideoPlayer/>

          <div className={styles.description}>
            <p><i className="fa fa-info-circle"></i> This is an experimental music hack, synchronising the Radio 1 Ibiza Prom with the live tweets of the night. The project is a proof of concept, made for fun, so there may be bugs. If all fails, you can still enjoy the fantastic gig for what it was. Any comments, fire them at <a href="https://twitter.com/indeox" target="_new" className="color-4">@indeox</a></p>
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
