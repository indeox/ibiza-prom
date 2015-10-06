import styles from './_TweetWall.scss';
import React from 'react';
import addons from 'react/addons'
import moment from 'moment';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import TimeoutTransitionGroup from 'timeout-transition-group'

export default class TweetWall extends React.Component {

  static defaultProps = {
  	promStart:    moment('2015-07-29 22:17:00+0100').valueOf(),
    colourScheme: [],
    tweets:       [],
    maxTweets:    13,
    time:         0
  }

  getTweetsAt(timestamp) {
    var self = this;
    var tweets = this.props.tweets.filter(function(tweet) {
      return tweet.timestamp <= timestamp &&
             tweet.timestamp >= timestamp - 2 * 60000 &&
             tweet.timestamp >= self.props.promStart;
    });

    return tweets.reverse().slice(0, this.props.maxTweets);
  }

  render() {
    var self = this;
  	var promLocalTime = this.props.promStart + (this.props.time * 1000);
    var numTweets     = this.props.tweets.length;

	  var tweets = this.getTweetsAt(promLocalTime).map(function(tweet, index) {
      var media;
      var mediaIcon;
      var tweetColour = self.props.colourScheme[tweet.colourIndex];

      if (tweet.media) {
        var mediaClassname = 'fa fa-';
        if (tweet.media[0].type == 'photo')        { mediaClassname += 'camera'; }
        if (tweet.media[0].type == 'video')        { mediaClassname += 'video-camera'; }
        if (tweet.media[0].type == 'animated_gif') { mediaClassname += 'video-camera'; }

        media = (
          <div className={styles.media}>
            <i className={mediaClassname}></i>
            <img src={tweet.media[0].media_url}/>
          </div>
        )
      }

      return (
      	<li className={styles.tweet} key={tweet.id}>
      		<a target="_blank" href={tweet.url} style={{color:tweetColour}}>
            {media}
            <span className={styles.time}>{tweet.time.split('-')[0]} | </span>
            <span dangerouslySetInnerHTML={{__html: tweet.text}}></span>
          </a>
      	</li>
      )
    });

    return (
      <TimeoutTransitionGroup component="ul"
                               transitionName="fade"
                               transitionAppear={true}
                               className={styles.tweets}
                               enterTimeout={500}
                               leaveTimeout={500}
                               style={{opacity: this.props.lightsOn ? 1 : 0}}>
      	{tweets}
      </TimeoutTransitionGroup>
    );
  }
}
