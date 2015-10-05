import BaseStore from './BaseStore';
import AppDispatcher from '../dispatcher/AppDispatcher';

// import ColourScheme from 'color-scheme';
var scm = new ColorScheme;
// import Please from 'pleasejs';

class ColoursStore extends BaseStore {

  _cache: [];

  emitChange() {
    this.emit('COLOURS_UPDATED');
  }

  addChangeListener(callback) {
    this.on('COLOURS_UPDATED', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('COLOURS_UPDATED', callback);
  }

  getColourForTime(time) {
    this._cache = this._cache || this.getAll();

    var roundedTime = Math.floor(time);
    var colour      = this._cache[roundedTime] ? this._cache[roundedTime][0] : '#000000';
    return colour;
  }

  getColourSchemeForTime(time) {
    var colourHex = this.getColourForTime(time);
    if (!colourHex) { return;}

    return scm.from_hex(colourHex.substr(1))
              .distance(0.1)
              .scheme('triade')
              .variation('light')
              .colors()
              .map(function(colourHex) {
                return '#' + colourHex
              });
  }
}

let store = new ColoursStore();

AppDispatcher.register((action) => {
  switch(action.actionType) {
    case 'COLOURS_GET_SUCCESS':
      store.setAll(action.items);
      store._cache = null;
      break;
    default:
  }
});

export default store;
