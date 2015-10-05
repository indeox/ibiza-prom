import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import _ from 'lodash';

class TweetsStore extends BaseStore {

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
      return Math.floor(tweet.timestamp / 35000);
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
