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
const profilingEnabled = false;

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
          if (profilingEnabled) {
            Perf.start();
          }

          this.setState({
            time:          action.time,
            lightsOn:      action.time > 3.1,
            promLocalTime: promStart + (action.time * 1000),
            promProgress:  Math.round((action.time / 5531) * 100),
            primaryColour: ColoursStore.getColourForTime(action.time),
            colourScheme:  ColoursStore.getColourSchemeForTime(action.time),
            track:         TrackStore.getTrackAt(action.time)
          });

          if (profilingEnabled) {
            Perf.stop();
            Perf.printWasted();
          }
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
    var styleSheet = `
      .color-primary  { color: ${this.state.primaryColour};   }
      .color-0        { color: ${this.state.colourScheme[0]}; }
      .color-1        { color: ${this.state.colourScheme[1]}; }
      .color-2        { color: ${this.state.colourScheme[2]}; }
      .color-3        { color: ${this.state.colourScheme[3]}; }
      .color-4        { color: ${this.state.colourScheme[4]}; }
      .color-5        { color: ${this.state.colourScheme[5]}; }
      .color-6        { color: ${this.state.colourScheme[6]}; }
      .color-7        { color: ${this.state.colourScheme[7]}; }
      .color-8        { color: ${this.state.colourScheme[8]}; }
      .color-9        { color: ${this.state.colourScheme[9]}; }
      .bg-primary     { background-color: ${this.state.primaryColour}; }
      .bg-0           { background-color: ${this.state.colourScheme[0]}; }
      .bg-1           { background-color: ${this.state.colourScheme[1]}; }
      .bg-2           { background-color: ${this.state.colourScheme[2]}; }
      .bg-3           { background-color: ${this.state.colourScheme[3]}; }
      .bg-4           { background-color: ${this.state.colourScheme[4]}; }
      .border-primary { border-color: ${this.state.primaryColour};   }
      .border-0       { border-color: ${this.state.colourScheme[0]}; }
      .border-1       { border-color: ${this.state.colourScheme[1]}; }
      .border-2       { border-color: ${this.state.colourScheme[2]}; }
      .border-3       { border-color: ${this.state.colourScheme[3]}; }
      .border-4       { border-color: ${this.state.colourScheme[4]}; }
    `;

    return (
      <div className={styles.app}>
        <style dangerouslySetInnerHTML={{__html: styleSheet}} />

        <Mesh colour={this.state.primaryColour} />
        <Body {...this.state}/>
        {/* <Footer /> */}
      </div>
    );
  }
}
