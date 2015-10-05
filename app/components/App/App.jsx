import styles from './_App.scss';

import React from 'react';
import AppActions from '../../actions/AppActions';
import AppDispatcher from '../../dispatcher/AppDispatcher';
import moment from 'moment';

import ItemsStore from '../../stores/ItemsStore';
import ColoursStore from '../../stores/ColoursStore';
import TweetsStore from '../../stores/TweetsStore';

import Body from '../Body/Body';
import Footer from '../Footer/Footer';
import Mesh from '../Mesh/Mesh';

const promStart = moment('2015-07-29 22:17:00+0100').valueOf();

function getAppState() {
  return {
    lightsOn:     false,
    items:        ItemsStore.getAll(),
    tweets:       TweetsStore.getAll(),
    tweetData:    TweetsStore.getTweetData(),
    promProgress: 0,
    colourScheme: ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']
  };
}

export default class App extends React.Component {

  state = getAppState()

  componentDidMount() {
    ItemsStore.addChangeListener(this.onChange);
    TweetsStore.addChangeListener(this.onChange);

    AppDispatcher.register((action) => {
      switch(action.actionType) {
        case 'TIME_UPDATED':
          this.setState({
            time:          action.time,
            lightsOn:      action.time > 3.1,
            promLocalTime: promStart + (action.time * 1000),
            promProgress:  Math.round((action.time / 5531) * 100),
            primaryColour: ColoursStore.getColourForTime(action.time),
            colourScheme:  ColoursStore.getColourSchemeForTime(action.time)
          });
        break;
        case 'COLOUR_UPDATED':  this.setState({ time:    action.colour }); break;
        case 'COLOURS_UPDATED': this.setState({ colours: action.item });   break;
        case 'TWEETS_UPDATED':
          this.setState({
            tweets:    action.items,
            tweetData: TweetsStore.getTweetData()
          });
          console.log(TweetsStore.getTweetData())
        break;
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
