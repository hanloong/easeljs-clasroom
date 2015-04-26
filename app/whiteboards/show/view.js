import Ember from 'ember';

export default Ember.View.extend({
  _modelChange: function() {
    this.rerender();
  }.observes('controller.model')
});
