import styles from './_TweetWall.scss';
import React from 'react';
import addons from 'react/addons'
import moment from 'moment';
import cx from 'classnames';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import TimeoutTransitionGroup from 'timeout-transition-group'

export default class TweetWall extends React.Component {

  static defaultProps = {
    promStart:    moment('2015-07-29 22:17:00+0100').valueOf(),
    colourScheme: [],
    tweets:       [],
    maxTweets:    10,
    time:         0
  }

  constructor() {
    super();
    this.state = {
      activeFilterType: 'all'
    }
  }

  tweetsToRender = [];

  getTweetsAt(timestamp) {
    var self = this;
    var tweets = this.props.tweets.filter(function(tweet) {
      return tweet.timestamp <= timestamp &&
             // tweet.timestamp >= timestamp - 2 * 60000 &&
             tweet.timestamp >= self.props.promStart;
    });

    return tweets.reverse();
  }

  shouldComponentUpdate(nextProps, nextState) {
    var promLocalTime       = this.props.promStart + (this.props.time * 1000);
    var tweetsAtCurrentTime = this.getTweetsAt(promLocalTime);

    // Update on filter change
    if (this.state.activeFilterType != nextState.activeFilterType) {
      return true;
    }

    // Update on colour change
    if (this.props.colourScheme.toString() != nextProps.colourScheme.toString()) {
      return true;
    }

    // First run - populate tweetsToRender
    if (tweetsAtCurrentTime.length && this.tweetsToRender.length === 0) {
      this.tweetsToRender = tweetsAtCurrentTime;
      return true;
    }

    // Force an update if the top tweet doesn't match what's already rendered
    if (this.tweetsToRender.length && tweetsAtCurrentTime[0].id != this.tweetsToRender[0].id) {
      this.tweetsToRender = tweetsAtCurrentTime;
      return true;
    }

    return false;
  }

  filterBy(type) {
    this.setState({
      activeFilterType: type,
    });
  }

  renderTweets() {
    var tweetsToRender = this.tweetsToRender;

    // Filter tweets if a specific filter is active (ie: not 'all')
    if (this.state.activeFilterType != 'all') {
      tweetsToRender = tweetsToRender.filter((tweet) => {
        let tweetType = tweet.media ? tweet.media[0].type : 'text';
        if (tweetType == this.state.activeFilterType) { return true; }
        if (tweetType == 'animated_gif' && this.state.activeFilterType == 'video') { return true; }
      })
    };

    // Truncate tweets only when media filters are off
    if (this.state.activeFilterType == 'all') {
      tweetsToRender = tweetsToRender.slice(0, this.props.maxTweets);
    }

    return tweetsToRender.map((tweet, index) => {
      var media;
      var mediaIcon;
      var tweetColour = this.props.colourScheme[tweet.colourIndex];

      if (tweet.media) {
        var mediaClassname = 'fa fa-';
        if (tweet.media[0].type == 'photo')        { mediaClassname += 'camera'; }
        if (tweet.media[0].type == 'video')        { mediaClassname += 'video-camera'; }
        if (tweet.media[0].type == 'animated_gif') { mediaClassname += 'video-camera'; }

        let mediaUrl = tweet.media[0].expanded_url || tweet.url;
        let mediaSrc = tweet.media[0].media_url || '';

        // Scale down images
        mediaSrc = 'http://cdn.deepcobalt.com/api/ic/x90/' + mediaSrc.replace(/https?:\/\//, '');

        media = (
          <a target="_blank" href={mediaUrl} className={cx('color-' + tweet.colourIndex, styles.media)}>
            <i className={mediaClassname}></i>
            <img src={mediaSrc}/>
          </a>
        )
      }

      let tweetBody = (
        <a target="_blank" href={tweet.url} className={'color-' + tweet.colourIndex}>
          <div className={styles.tweetMeta}>
            { /*<img className={styles.userimage} src={tweet.userProfileImageUrl} /> */ }
            <span className={styles.content} dangerouslySetInnerHTML={{__html: tweet.text}}></span>
          </div>

          <div className={styles.tweetMeta}>
            <span className={styles.time}>{tweet.time.split('-')[0]} | </span>
            <span className={styles.username}>@{tweet.userScreenName} ({tweet.userName})</span>
          </div>
        </a>
      );


      let tweetCls = styles.tweet;

      if (this.state.activeFilterType != 'all') {
        tweetBody = false;
        tweetCls  = styles.tweetNoBody
      }


      // Render Tweet
      return (
        <li className={tweetCls} key={tweet.id}>
          {media}
          {tweetBody}
        </li>
      )
    });
  }

  renderTweetStats() {
    let tweetStats = _.countBy(this.tweetsToRender, (tweet) => {
      let type = tweet.media ? tweet.media[0].type : 'text';
      if (type == 'animated_gif') { type = 'video'; }
      return type;
    });

    let activeFilterCls = styles.tweetStatsActive;

    return (
      <ul className={styles.tweetStats}>
        {/* All Tweets */}
        <li onClick={this.filterBy.bind(this, 'all')}
            className={cx({[`${activeFilterCls}`]: this.state.activeFilterType == 'all'}, 'border-5')}>
              { this.tweetsToRender.length } tweets
        </li>

        {/* Photo Tweets */}
        <li onClick={this.filterBy.bind(this, 'photo')}
            className={cx({[`${activeFilterCls}`]: this.state.activeFilterType == 'photo'}, 'border-5')}>
              { tweetStats.photo || 0 } photos
        </li>

        {/* Video Tweets */}
        <li onClick={this.filterBy.bind(this, 'video')}
            className={cx({[`${activeFilterCls}`]: this.state.activeFilterType == 'video'}, 'border-5')}
            style={{opacity: tweetStats.video ? 1 : 0.5}}>
              { tweetStats.video || 0 } videos
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div className={styles.tweetWall} style={{opacity: this.props.lightsOn ? 1 : 0}}>

        { this.renderTweetStats() }

        <TimeoutTransitionGroup component="ul"
                                 transitionName="fade"
                                 transitionAppear={true}
                                 className={styles.tweets}
                                 enterTimeout={500}
                                 leaveTimeout={500}>
          { this.renderTweets() }
        </TimeoutTransitionGroup>
      </div>
    );
  }
}
