import styles from './_Body.scss';
import React from 'react';
import moment from 'moment';

import Menu from '../Menu/Menu';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import TweetWall   from '../TweetWall/TweetWall';
import TweetGraph  from '../TweetGraph/TweetGraph';

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

  render() {
    var headerStyle = {
      color:     this.props.colourScheme[4],
      textAlign: this.props.promProgress > 25 ? 'left' : 'right'
    };

    var promTimeStyle = {
      color:           this.props.primaryColour,
      backgroundColor: this.props.colourScheme[5]
    }

    var promPrettyTime = moment(this.props.state.promLocalTime).utcOffset(1).format('hh:mm:ssa');

    return (
      <div className={styles.body}>
        <h1 className={styles.header} style={headerStyle}>#IbizaProm</h1>

        <TweetGraph {...this.props}/>

        <TweetWall {...this.props}/>
        <VideoPlayer/>
      </div>
    );
  }
}
