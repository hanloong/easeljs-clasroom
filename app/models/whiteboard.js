import DS from 'ember-data';

let Whiteboard = DS.Model.extend({
  graph_paper:          DS.attr('boolean'),
  tool:                 DS.attr('string'),
  color:                DS.attr('color'),
  thickness:            DS.attr('number'),
  drawings:             DS.hasMany('drawing', {async: true})
});

Whiteboard.reopenClass({
  FIXTURES: [
    {id: 1, graph_paper: false, tool: 'pen', color: '#000', thickness: 2},
    {id: 2, graph_paper: false, tool: 'pen', color: '#000', thickness: 2},
    {id: 3, graph_paper: false, tool: 'pen', color: '#000', thickness: 2},
    {id: 4, graph_paper: false, tool: 'pen', color: '#000', thickness: 2},
    {id: 5, graph_paper: false, tool: 'pen', color: '#000', thickness: 2}
  ]
});

export default Whiteboard;
