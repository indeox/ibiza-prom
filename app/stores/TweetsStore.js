import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import moment from 'moment';
import _ from 'lodash';

const promStart = moment('2015-07-29 22:17:00+0100').valueOf();
const promEnd   = moment(promStart).add(5530, 'seconds').valueOf();

class TweetsStore extends BaseStore {

  setAll(items) {
    // Assign a colour index from the palette to each tweet
    var colourIndex = 4;

    items = items.map((tweet, index) => {
      tweet.colourIndex = colourIndex;
      colourIndex += 1;
      if (colourIndex > 9) { colourIndex = 4; }
      return tweet;
    });

    super.setAll(items);
  }

  getAll() {
    // Filter out tweets only between the start and end of the gig
    return super.getAll().filter(function(tweet) {
      return tweet.timestamp >= promStart &&
             tweet.timestamp <= promEnd
    });
  }

  emitChange() {
    this.emit('TWEETS_UPDATED');
  }

  addChangeListener(callback) {
    this.on('TWEETS_UPDATED', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('TWEETS_UPDATED', callback);
  }

  getTweetData() {
    var groupedTweets = _.countBy(this.getAll(), function(tweet) {
      return Math.floor(tweet.timestamp / 30000);
    });

    return _.values(groupedTweets);
  }
}

let store = new TweetsStore();

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'TWEETS_GET_SUCCESS':
      store.setAll(action.items);
      break;
    default:
  }
});

export default store;
