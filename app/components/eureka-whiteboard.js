import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['graphPaper'],
  stage: null,
  shape: null,
  tempShape: null,
  wrapper: null,
  graphPaper: false,
  fillShape: false,

  drawing: false,
  oldX: null,
  oldY: null,
  startX: null,
  startY: null,
  endX: null,
  endY: null,

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
    var tempShape = new createjs.Shape();

    createjs.Ticker.addEventListener("tick", stage);

    wrapper.cache(0,0,this.get('width'),this.get('height')); // Cache it.

    stage.addChild(wrapper);
    wrapper.addChild(shape);
    stage.addChild(tempShape);

    createjs.Touch.enable(stage, false, true);

    // Setup mouse listeners
    stage.on("stagemousemove", this.mouseover.bind(this));
    stage.on("stagemousedown", this.startDrawing.bind(this));
    stage.on("stagemouseup", this.stopDrawing.bind(this));

    // Set properties
    this.set('stage', stage);
    this.set('shape', shape);
    this.set('wrapper', wrapper);
    this.set('tempShape', tempShape);
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
    this.set('startX', evt.stageX);
    this.set('startY', evt.stageY);

    this.get('tempShape').graphics.clear();
    this.get('stage').update();
  },
  stopDrawing: function(evt) {

    if (this.get('drawing') === true) {
      var shape = this.get('shape');
      var w = evt.stageX - this.get('startX');
      var h = evt.stageY - this.get('startY');

      if (this.get('current_tool') === 'circle') {
        if(this.get('fillShape')) {
          shape.graphics.beginFill(this.get('color')).drawEllipse(this.get('startX'), this.get('startY'), w, h);
        } else {
          shape.graphics.beginStroke(this.get('color')).drawEllipse(this.get('startX'), this.get('startY'), w, h);
        }
      }
      if (this.get('current_tool') === 'square') {
        if(this.get('fillShape')) {
          shape.graphics.beginFill(this.get('color')).drawRect(this.get('startX'), this.get('startY'), w, h);
        } else {
          shape.graphics.beginStroke(this.get('color')).drawRect(this.get('startX'), this.get('startY'), w, h);
        }
      }

      this.get('wrapper').updateCache("source-over");
    }

    this.set('drawing', false);
    this.set('oldX', null);
    this.set('oldY', null);
    this.set('endX', evt.stageX);
    this.set('endY', evt.stageY);

    this.get('tempShape').graphics.clear();
  },

  mouseover: function(evt) {
    if (this.get('drawing') === true) {
      var erase = this.get('current_tool') === 'eraser';
      if(this.get('oldX')) {
        var drawing = this.get('shape');
        var size = this.get('size');

        if (erase) { size = size*5; }

        if (this.get('current_tool') === 'pen' || this.get('current_tool') === 'eraser') {
          drawing.graphics.ss(size, "round").s(this.get('color'));
          drawing.graphics.mt(this.get('oldX'), this.get('oldY'));        
          drawing.graphics.lt(evt.stageX, evt.stageY);
        }

        var tempShape = this.get('tempShape');
        var w = evt.stageX - this.get('startX');
        var h = evt.stageY - this.get('startY');

        if (this.get('current_tool') === 'circle') {
          if(this.get('fillShape')) {
            tempShape.graphics.clear().beginFill(this.get('color')).drawEllipse(this.get('startX'), this.get('startY'), w, h);
          } else {
            tempShape.graphics.clear().beginStroke(this.get('color')).drawEllipse(this.get('startX'), this.get('startY'), w, h);
          }
        }
        if (this.get('current_tool') === 'square') {
          if(this.get('fillShape')) {
            tempShape.graphics.clear().beginFill(this.get('color')).drawRect(this.get('startX'), this.get('startY'), w, h);
          } else {
            tempShape.graphics.clear().beginStroke(this.get('color')).drawRect(this.get('startX'), this.get('startY'), w, h);
          }
        }
      }

      this.set('oldX', evt.stageX);
      this.set('oldY', evt.stageY);
      this.get('stage').update();
      this.get('wrapper').updateCache(erase?"destination-out":"source-over");
      this.get('shape').graphics.clear();
    }
  }
});
