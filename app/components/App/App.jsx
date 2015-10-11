import styles from './_App.scss';

import React from 'react';
import AppActions from '../../actions/AppActions';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import moment from 'moment';

import ItemsStore from '../../stores/ItemsStore';
import ColoursStore from '../../stores/ColoursStore';
import TweetsStore from '../../stores/TweetsStore';
import TrackStore from '../../stores/TrackStore';

import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Mesh from '../Mesh/Mesh';

// import addons from 'react/addons';
// const Perf = React.addons.Perf;

const promStart = moment('2015-07-29 22:17:00+0100').valueOf();

function getAppState() {
  return {
    lightsOn:     false,
    videoReady:   false,
    items:        ItemsStore.getAll(),
    tweets:       TweetsStore.getAll(),
    tweetData:    TweetsStore.getTweetData(),
    promProgress: 0,
    colourScheme: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'],
  };
}

export default class App extends React.Component {

  state = getAppState()

  componentDidMount() {
    ItemsStore.addChangeListener(this.onChange);
    TweetsStore.addChangeListener(this.onChange);

    // Set prom start/end
    this.setState({
      promStart: promStart,
      promEnd:   moment(promStart).add(5530, 'seconds').valueOf(),
      track:     { title: '', artist: '' }
    });

    AppDispatcher.register((action) => {
      switch(action.actionType) {
        case 'TIME_UPDATED':
          // Perf.start();
          this.setState({
            time:          action.time,
            lightsOn:      action.time > 3.1,
            promLocalTime: promStart + (action.time * 1000),
            promProgress:  Math.round((action.time / 5531) * 100),
            primaryColour: ColoursStore.getColourForTime(action.time),
            colourScheme:  ColoursStore.getColourSchemeForTime(action.time),
            track:         TrackStore.getTrackAt(action.time)
          });
          // Perf.stop();
          // Perf.printWasted();
        break;
        case 'VIDEO_READY':     this.setState({ videoReady: true }); break;
        case 'COLOUR_UPDATED':  this.setState({ time:    action.colour }); break;
        case 'COLOURS_UPDATED': this.setState({ colours: action.item });   break;
        default:
      }
    });

    // Load colours and tweets
    AppActions.loadContent().then(function() {
      AppActions.setTime(0);
    });


  }

  componentWillUnmount() {
    ItemsStore.removeChangeListener(this.onChange);
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {
    return (
      <div className={styles.app}>
        <Mesh colour={this.state.primaryColour} />
        <Body {...this.state}/>
        { /*<Footer />*/ }
      </div>
    );
  }
}
