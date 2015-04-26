import DS from 'ember-data';

export default DS.Model.extend({
  whiteboard:           DS.belongsTo('whiteboard'),
  tool:                 DS.attr('string'),
  startX:               DS.attr('number'),
  startY:               DS.attr('number'),
  endX:                 DS.attr('number'),
  endY:                 DS.attr('number'),
  color:                DS.attr('string')
});
