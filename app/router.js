import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

export default Router.map(function() {
  this.route('whiteboards', function() {
    this.route('show', {path: '/:whiteboard_id'});
  });
});
