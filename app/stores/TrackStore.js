import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';
import moment from 'moment';
import _ from 'lodash';

import playlist from '../content/playlist.json';

// Prepare playlist
// Convert HH:MM:SS to seconds only
playlist = playlist.map(function(entry) {
  var ts = entry.time.split(':');
  entry.time = Date.UTC(1970, 0, 1, ts[0], ts[1], ts[2]) / 1000;
  return entry;
});


class TrackStore extends BaseStore {

  getTrackAt(time) {
    return _.findLast(playlist, function(entry) {
      return time >= entry.time;
    });
  }
}

let store = new TrackStore();

export default store;
