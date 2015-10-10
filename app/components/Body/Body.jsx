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
      // display: this.props.time > 0 || this.state.hasStarted ? 'none' : 'block'
      opacity: this.props.videoReady ? 1 : 0
    };

    var highlightStyle = {
      color: this.props.colourScheme[4]
    }

    var introStyle = {
      width:      '55%',
      visibility: this.state.hasStarted == true ? 'visible' : 'hidden'
    };

    // var trackInfoStyle = {
    //   opacity: this.props.track.title ? 0.5 : 0
    // };

    return (
      <div className={styles.body}>
        <h1 className={styles.header} style={headerStyle}>#IbizaProm Replay</h1>

        <TweetGraph {...this.props}/>

        <TweetWall {...this.props}/>

        <div className={styles.intro} style={{ display: this.state.hasStarted == true ? 'none' : 'block' }}>
          <p>On July 29th 2015, for the BBC Proms season, <a href="http://www.bbc.co.uk/radio1" target="_new">Radio 1</a> celebrated their 20 year association with the island of Ibiza by enlisting the <a href="http://www.theheritageorchestra.com/" target="_new">Heritage Orchestra</a> to play over twenty classic dance club tracks for their first times at the Proms, turning the Royal Albert Hall into one giant nightclub and having the poshest rave in London.</p>
          <p>Hit <strong>Play</strong> below to replay the concert, along with all the tweets published at the same time.</p>

          <button className={styles.startbutton} style={startButtonStyle} onClick={this.start}>
            <i className="fa fa-play-circle"></i>
          </button>
        </div>

        <div style={introStyle}>
          <VideoPlayer/>

          <div className={styles.description}>
            <p><i className="fa fa-info-circle"></i> This is an experimental hack, attempting to synchronise the Radio 1 Ibiza Prom with the tweets of the night, exactly as they happened. In addition, the colour scheme of the page changes to match the predominant colour in the playing video. It is only a proof of concept and may not always be on its best behaviour. Any comments, fire them my way <a href="https://twitter.com/indeox" target="_new" style={highlightStyle}>@indeox</a></p>
          </div>
          {
            /*<h2 className={styles.track} style={trackInfoStyle}>{this.props.track.title}</h2>
            <p className={styles.artist} style={trackInfoStyle}>{this.props.track.artist}</p>*/
          }
        </div>
      </div>
    );
  }
}
