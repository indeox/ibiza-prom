import request from 'superagent';

export default {
  getItems() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(['Item 1', 'Item 2', 'Item 3'].map((item, i) => {
          return {
            id: i,
            label: item
          };
        }));
      }, 500);
    });
  },

  getColours() {
    return new Promise((resolve) => {
      var loadJson = require('bundle!../content/colours-per-second.json');
      loadJson(function(response) {
        resolve(response);
      });
    });
  },

  getTweets() {
    return new Promise((resolve) => {
      var loadJson = require('bundle!../content/tweets.json');
      loadJson(function(response) {
        resolve(response);
      });
    });
  }

};
