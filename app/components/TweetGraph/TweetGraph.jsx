import styles from './_TweetGraph.scss';
import React from 'react';
import moment from 'moment';
import chroma from 'chroma-js';
import Sparklines from './Sparklines';
import AppActions from '../../actions/AppActions';
import _ from 'lodash';

export default class TweetGraph extends React.Component {

  static defaultProps = {
    colourScheme: [],
    tweets:       [],
    tweetData:    [],
    time:         0
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.container = React.findDOMNode(this);
    this.promTime   = this.container.querySelector('.' + styles.promtime);
    this.timeMarker = this.container.querySelector('.' + styles.marker);
  }

  componentDidUpdate() {
    // console.log(this.timeMarker.getBoundingClientRect());
  }

  componentWillReceiveProps(props) {

  }

  getTweetsAt(timestamp) {
    var tweets = this.props.tweets.filter(function(tweet) {
      return tweet.timestamp <= timestamp && tweet.timestamp >= timestamp - 2 * 60000;
    });

    return tweets.reverse().slice(0,15);
  }

  jumpToTime = (e) => {
    var x          = e.pageX - this.container.getBoundingClientRect().left;
    var xPercent   = (x/this.container.offsetWidth);
    var timeToJump = 5531 * xPercent;

    AppActions.jumpVideoTo(timeToJump);
  }

  render() {
    var backgroundRGB = chroma.hex(this.props.colourScheme[5] || '#ffffff').alpha(0.25);
    var progress      = (this.props.time / 5531) * 100;

    var graphStyle = {
      //backgroundColor:   backgroundRGB.css(),
      borderTopColor:    this.props.colourScheme[5],
      borderBottomColor: this.props.colourScheme[5],
    }

    // Prom time horizontal position
    if (this.promTime) {
      var promTimeWidth = this.promTime.getBoundingClientRect().width;
      var markerX       = this.timeMarker.getBoundingClientRect().left;
      var isPastLeftBoundary  = markerX - (promTimeWidth/2) <= 0;
      var isPastRightBoundary = markerX + (promTimeWidth/2) >= window.innerWidth;
    }

    var promTimePosition = progress;
    if      (progress < 4.5)  { promTimePosition = 4.5; }
    else if (progress > 95.1) { promTimePosition = 95.1; }

    var promTimeStyle = {
      color:           this.props.primaryColour,
      backgroundColor: this.props.colourScheme[4],
      left:            promTimePosition + '%',
      marginLeft:      null
    }

    if (isPastLeftBoundary)  { promTimeStyle.left = 0; promTimeStyle.marginLeft = 0; }
    if (isPastRightBoundary) { promTimeStyle.left = window.innerWidth - promTimeWidth; promTimeStyle.marginLeft = 0; }

    var promPrettyTime = moment(this.props.promLocalTime).utcOffset(1).format('hh:mm:ssa');

    var markerStyle = {
      backgroundColor: this.props.colourScheme[4],
      left:            progress + '%'
    }

    var sparkLinesStyle = {
      stroke:      this.props.primaryColour || '#ccc',
      strokeWidth: 1,
      fill:        this.props.colourScheme ? this.props.colourScheme[5] : '#ccc',
      fillOpacity: 1
    }

    return (
      <div className={styles.graph} style={graphStyle} onClick={this.jumpToTime}>
        <div className={styles.promtime} style={promTimeStyle}>{promPrettyTime}</div>

        <Sparklines colour={sparkLinesStyle.fill} tweets={this.props.tweets} width={1000} height={40} />

        <div className={styles.marker} style={markerStyle}/>
      </div>
    );
  }
}
