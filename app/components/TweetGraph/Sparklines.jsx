import styles from './_TweetGraph.scss';
import React from 'react';
import AppActions from '../../actions/AppActions';
import _ from 'lodash';

export default class Sparklines extends React.Component {

  static defaultProps = {
    colour:   '#ffffff',
    tweets:   [],
    width:    1000,
    height:   40,
    barWidth: 1
  }

  state = {
    tweetGraph: [],
    width:      1000,
    height:     40
  }

  componentDidMount() {
    var self = this;
    this.container = React.findDOMNode(this);
    window.addEventListener('resize', this.resize);

    this.resize();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.tweets != prevProps.tweets) {
      this.processTweets()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.colour !== nextProps.colour || this.props.tweets.length != nextProps.tweets.length;
  }

  processTweets = () => {
    var promDuration = _.max(this.props.tweets, 'timestamp').timestamp - _.min(this.props.tweets, 'timestamp').timestamp; // Total: 5530 seconds
    var numOfLines   = Math.floor(this.state.width / this.props.barWidth); // 2px for bar width + 1px spacer
    var barDuration  = Math.floor(promDuration / numOfLines);

    var tweetGraph = _(this.props.tweets)
                     .countBy((tweet) => { return Math.floor(tweet.timestamp / barDuration) })
                     .values()
                     .value();

    this.setState({
      tweetGraph: tweetGraph,
      maxValue:   _.max(tweetGraph)
    });

    // console.log(numOfLines, barDuration, tweetGraph.length);
  }

  resize = _.debounce(() => {
    var rect = this.container.getBoundingClientRect();

    this.setState({
      width:  rect.width,
      height: rect.height
    });

    this.processTweets();
  }, 250)

  render() {
    var rectStyle = {
      'fill': this.props.colour,
    };

    return (
      <div>
        <style dangerouslySetInnerHTML={{__html: 'rect { fill: ' + this.props.colour + ' }'}} />

        <svg className={styles.sparklines}>
          {this.state.tweetGraph.map((bar, i) => {
            var barHeight = (bar / this.state.maxValue) * this.state.height;
            var yPos      = this.state.height - barHeight;
            return <rect key={i} className={styles.bar} x={i*(this.props.barWidth+1)} y={yPos} width={this.props.barWidth} height={barHeight}></rect>
          })}
        </svg>
      </div>
    );
  }
}
