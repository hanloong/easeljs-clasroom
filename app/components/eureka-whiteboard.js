import Ember from 'ember';

export default Ember.Component.extend({
  classNameBindings: ['graphPaper', 'showSidebar'],
  stage: null,
  shape: null,
  tempShape: null,
  wrapper: null,
  graphPaper: false,
  showSidebar: false,
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
  tools: ['pen', 'line', 'eraser', 'square', 'circle', 'text'],

  didInsertElement:  function() {
    var stage = new createjs.Stage("demoCanvas");
    var shape = new createjs.Shape();
    var wrapper = new createjs.Container();
    var tempShape = new createjs.Shape();

    wrapper.cache(0,0,2000, 2000);

    stage.addChild(wrapper);
    wrapper.addChild(shape);
    stage.addChild(tempShape);

    createjs.Touch.enable(stage, false, true);

    // Setup mouse listeners
    stage.on("stagemousemove", this.mouseover.bind(this));
    stage.on("stagemousedown", this.startDrawing.bind(this));
    stage.on("stagemouseup", this.stopDrawing.bind(this));
    window.onresize = () => {
      this.resizeCanvas();
    };

    // Set properties
    this.set('stage', stage);
    this.set('shape', shape);
    this.set('wrapper', wrapper);
    this.set('tempShape', tempShape);
    this.stage.update();
    
    this.resizeCanvas();
  },

  actions: {
    setTool: function(tool) {
      this.set('current_tool', tool);
    },
    toggleSidebar: function(toggle) {
      this.set('showSidebar', toggle);
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
      if (this.get('current_tool') === 'line') {
        shape.graphics.beginStroke(this.get('color'))
        .setStrokeStyle(this.get('size'), "round")
        .moveTo(this.get('startX'), this.get('startY'))
        .lineTo(evt.stageX, evt.stageY);
      }

    }

    this.set('drawing', false);
    this.set('oldX', null);
    this.set('oldY', null);
    this.set('endX', evt.stageX);
    this.set('endY', evt.stageY);

    this.get('wrapper').updateCache("source-over");
    this.get('stage').update();
    this.get('shape').graphics.clear();
  },

  mouseover: function(evt) {
    var shape = this.get('shape');
    if (this.get('drawing') === true) {
      var erase = this.get('current_tool') === 'eraser';
      if(this.get('oldX')) {
        var size = this.get('size');

        if (erase) { size = size*5; }
        if (this.get('current_tool') === 'pen' || this.get('current_tool') === 'eraser') {
          shape.graphics.beginStroke(this.get('color'))
          .setStrokeStyle(size, "round")
          .moveTo(this.get('oldX'), this.get('oldY'))
          .lineTo(evt.stageX, evt.stageY);

        } else {

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
          if (this.get('current_tool') === 'line') {
            tempShape.graphics.clear().beginStroke(this.get('color'))
            .setStrokeStyle(this.get('size'), "round")
            .moveTo(this.get('startX'), this.get('startY'))
            .lineTo(evt.stageX, evt.stageY);
          }
        }
      }

      this.set('oldX', evt.stageX);
      this.set('oldY', evt.stageY);
      this.get('stage').update();
      this.get('wrapper').updateCache(erase?"destination-out":"source-over");
      shape.graphics.clear();
    }
  },

  resizeCanvas: function() {
    var stage = this.get('stage');
    var w = window.innerWidth;
    var h = window.innerHeight;
    stage.canvas.width = w;
    stage.canvas.height = h;
    stage.update();
  }
});
