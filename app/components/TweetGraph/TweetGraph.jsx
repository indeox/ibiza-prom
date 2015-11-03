import styles from './_TweetGraph.scss';
import React from 'react';
import moment from 'moment';
import chroma from 'chroma-js';
import Sparklines from './Sparklines';
import AppActions from '../../actions/AppActions';
import _ from 'lodash';

export default class TweetGraph extends React.Component {

  static defaultProps = {
    active:       false,
    colourScheme: [],
    tweets:       [],
    tweetData:    [],
    time:         0
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.container  = React.findDOMNode(this);
    this.promTime   = this.container.querySelector('.' + styles.promtime);
    this.timeMarker = this.container.querySelector('.' + styles.marker);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.time == 0 || Math.floor(this.props.time) !== Math.floor(nextProps.time);
  }

  jumpToTime = (e) => {
    if (!this.props.active) {
      e.preventDefault();
      return;
    }

    var x          = e.pageX - this.container.getBoundingClientRect().left;
    var xPercent   = (x/this.container.offsetWidth);
    var timeToJump = 5531 * xPercent;

    AppActions.jumpVideoTo(timeToJump);
  }

  render() {
    var backgroundRGB = chroma.hex(this.props.colourScheme[5] || '#ffffff').alpha(0.25);
    var progress      = (this.props.time / 5531) * 100;

    // Round progress to 1 decimal point
    progress = _.round(progress, 1);

    // Prom time horizontal position
    if (this.promTime) {
      var promTimeWidth = 80; //this.promTime.getBoundingClientRect().width;
      var markerX       = this.timeMarker.getBoundingClientRect().left;
      var isPastLeftBoundary  = markerX - (promTimeWidth/2) <= 0;
      var isPastRightBoundary = markerX + (promTimeWidth/2) >= window.innerWidth;
    }

    var promTimePosition = progress;
    if      (progress < 4.5)  { promTimePosition = 4.5; }
    else if (progress > 95.1) { promTimePosition = 95.1; }

    var promTimeStyle = {
      left:       promTimePosition + '%',
      marginLeft: -promTimeWidth / 2
    }

    if (isPastLeftBoundary)  { promTimeStyle.left = 0; promTimeStyle.marginLeft = 0; }
    if (isPastRightBoundary) { promTimeStyle.left = window.innerWidth - promTimeWidth; promTimeStyle.marginLeft = 0; }

    var promPrettyTime = moment(this.props.promLocalTime).utcOffset(1).format('hh:mm:ssa');

    var markerStyle = {
      left:       progress + '%'
    }

    var sparkLinesStyle = {
      stroke:      this.props.primaryColour || '#ccc',
      strokeWidth: 1,
      fill:        this.props.colourScheme ? this.props.colourScheme[5] : '#ccc',
      fillOpacity: 1
    }

    return (
      <div className={styles.graph} onClick={this.jumpToTime}>
        <div className={styles.promtime + ' color-primary bg-4'} style={promTimeStyle}>
          <span dangerouslySetInnerHTML={{__html: promPrettyTime}} />
        </div>

        <Sparklines colour={sparkLinesStyle.fill} tweets={this.props.tweets} width={1000} height={40} />

        <div className={styles.marker + ' bg-4'} style={markerStyle}/>
      </div>
    );
  }
}
