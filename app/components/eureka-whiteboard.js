import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['graphPaper'],
  stage: null,
  shape: null,
  wrapper: null,
  graphPaper: false,

  drawing: false,
  oldX: null,
  oldY: null,
  color: '#000',
  owidth: 800,
  oheight: 600,
  width: 800,
  height: 600,
  size: 2,
  current_tool: 'pen',
  tools: ['pen', 'eraser', 'square', 'circle', 'text'],

  didInsertElement:  function() {
    var stage = new createjs.Stage("demoCanvas");
    var shape = new createjs.Shape();
    var wrapper = new createjs.Container();

    createjs.Ticker.addEventListener("tick", stage);

    wrapper.cache(0,0,this.get('width'),this.get('height')); // Cache it.

    stage.addChild(wrapper);
    wrapper.addChild(shape);

    createjs.Touch.enable(this.stage);

    // Setup mouse listeners
    stage.on("stagemousemove", this.mouseover.bind(this));
    stage.on("stagemousedown", this.startDrawing.bind(this));
    stage.on("stagemouseup", this.stopDrawing.bind(this));

    // Set properties
    this.set('stage', stage);
    this.set('shape', shape);
    this.set('wrapper', wrapper);
    this.stage.update();
  },

  actions: {
    setTool: function(tool) {
      this.set('current_tool', tool);
    },
    updateSize: function() {
      var stage = this.get('stage');
      stage.canvas.width = this.get('width');
      stage.canvas.height = this.get('height');
      stage.scaleX = this.get('width') / this.get('owidth');
      stage.scaleY = this.get('height') / this.get('oheight');
      stage.update();
    }
  },

  startDrawing: function(evt) {
    this.set('drawing', true);
    this.set('oldX', evt.stageX);
    this.set('oldY', evt.stageY);
  },
  stopDrawing: function(evt) {
    this.set('drawing', false);
    this.set('oldX', null);
    this.set('oldY', null);
  },

  mouseover: function(evt) {
    if (this.get('drawing') == true) {
      var erase = this.get('current_tool') === 'eraser'
      if(this.get('oldX')) {
        var drawing = this.get('shape');
        var size = this.get('size');
        if (erase) {
          size = size*5;
        }

        drawing.graphics.ss(size, "round").s(this.get('color'));
        drawing.graphics.mt(this.get('oldX'), this.get('oldY'));        
        drawing.graphics.lt(evt.stageX, evt.stageY);
      }
      this.set('oldX', evt.stageX);
      this.set('oldY', evt.stageY);

      this.get('wrapper').updateCache(erase?"destination-out":"source-over");
      this.get('shape').graphics.clear();
    }
  }
});
