import AppDispatcher from '../dispatcher/AppDispatcher';
import WebAPI from '../util/WebAPI';


export default {
  setTime(time) {
    AppDispatcher.dispatch({
      actionType: 'TIME_UPDATED',
      time: time
    });
  },

  jumpVideoTo(time){
    AppDispatcher.dispatch({
      actionType: 'VIDEO_JUMPTO',
      time: time
    });
  },

  videoReady(time){
    AppDispatcher.dispatch({
      actionType: 'VIDEO_READY'
    });
  },

  loadContent() {
    var coloursPromise = WebAPI.getColours()
          .then((items) => {
            AppDispatcher.dispatch({ actionType: 'COLOURS_GET_SUCCESS', items: items })
          })

    var tweetsPromise = WebAPI.getTweets()
          .then((items) => {
            AppDispatcher.dispatch({ actionType: 'TWEETS_GET_SUCCESS', items: items })
          })

    return Promise.all([coloursPromise,tweetsPromise]);
  },

  getItems() {
    WebAPI.getItems()
    .then((items) => {
      AppDispatcher.dispatch({
        actionType: 'ITEMS_GET_SUCCESS',
        items: items
      });
    })
    .catch(() => {
      AppDispatcher.dispatch({
        actionType: 'ITEMS_GET_ERROR'
      });
    });
  }
}

