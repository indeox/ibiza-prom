import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'lodash';

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
