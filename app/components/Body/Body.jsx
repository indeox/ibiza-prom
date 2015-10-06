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

  constructor(props) {
    super(props);
    this.state = {hasStarted: false};
  }

  start = () => {
    this.setState({ hasStarted: true });
    AppActions.jumpVideoTo(0);
  }

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

    var startButtonStyle = {
      display: this.props.time > 0 || this.state.hasStarted ? 'none' : 'block'
    };

    return (
      <div className={styles.body}>
        <h1 className={styles.header} style={headerStyle}>#IbizaProm</h1>

        <TweetGraph {...this.props}/>

        <TweetWall {...this.props}/>

        <button className={styles.startbutton} style={startButtonStyle} onClick={this.start}>
          <i className="fa fa-play-circle"></i>
        </button>

        <VideoPlayer/>
      </div>
    );
  }
}
