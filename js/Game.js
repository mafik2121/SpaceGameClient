function Game() {
  this.server = 'http://149.202.205.26:9092';
  this.updateInterval = 20;

  this.colors = {
    background: '#000010',
  }

  this.basis = {
    x: 0,
    y: 0,
  }

  this.initCanvasPromise = $.Deferred();

  this.init();
}

Game.prototype.init = function() {
  var _this = this;

  this.initCanvas('canvas');

  this.initCanvasPromise.done(function () {
    myUFO = new MyUFO();
    stars = new Stars();
    sun = new Sun();
  });

  $.when(myUFO.initPromise, stars.initPromise, sun.initPromise).done(function () {
    _this.play();
  });
};

Game.prototype.initCanvas = function(containerId) {
  this.canvas  = document.getElementById(containerId);
  this.ctx     = canvas.getContext('2d');

  this.canvas.width  = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.initCanvasPromise.resolve();
};

Game.prototype.connect = function() {
  var _this = this;

  this.socket = io(_this.server);
};

Game.prototype.setListens = function() {
  var _this = this;

  this.socket.on('connect', function () {
    _this.socket.emit('login', {userName: myUFO.name});
  });

  this.socket.on('login_handshake', function (ufo) {
    console.log('login_handshake', ufo);
    myUFO.uuid = ufo.uuid;
    myUFO.loginPromise.resolve();
  });

  this.socket.on('entity_info', function (entity) {
    // console.log('entity_info', entity);

    entities[entity.uuid] = merge_options(entities[entity.uuid], entity);

    entity = entities[entity.uuid];
    entity.view_position = entity.view_position || {x: 0, y: 0};
  });

  this.socket.on('entity_spawn', function (entity) {
    console.log('entity_spawn', entity);
    entity.view_position = entity.position;
    entities[entity.uuid] = entity;
  });

  this.socket.on('entity_leave', function (entity) {
    console.log('entity_leave', entity);
    delete entities[entity.uuid];
  });
};

Game.prototype.play = function() {
  var _this = this;

  this.timer = setInterval(function () {
    _this.updateCanvas();
  }, _this.updateInterval);
};

Game.prototype.updateCanvas = function() {
  this.updateBasis();

  if (myUFO.uuid != undefined) {
    myUFO.move();
  }

  this.draw();
};

Game.prototype.clearCanvas = function() {
  this.ctx.fillStyle = this.colors.background;
  this.ctx.fillRect(0, 0, canvas.width, canvas.height);
};

Game.prototype.draw = function() {
  var _this = this;

  this.clearCanvas();

  stars.draw();
  sun.draw();

  // Entities
  for (var uuid in entities) {
    var entity = entities[uuid];
    entity.view_position.x += (entity.position.x - entity.view_position.x) / 10.0;
    entity.view_position.y += (entity.position.y - entity.view_position.y) / 10.0;

    var pos = {
      x: _this.basis.x - entity.view_position.x,
      y: _this.basis.y - entity.view_position.y
    };

    if (entity.type == "ENTITY_PLAYER") {
      this.ctx.fillStyle = '#333';
      this.ctx.beginPath();
      this.ctx.arc(pos.x, pos.y, 20, 0, 2*Math.PI);
      this.ctx.fill();
      this.ctx.fillStyle = '#999'
      this.ctx.font="18px sb";
      this.ctx.fillText(entity.name, pos.x - (this.ctx.measureText(entity.name).width / 2), pos.y - 30);
    }

    this.ctx.fillStyle = 'red';
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, 10, 0, 2*Math.PI);
    this.ctx.fill();
  }

  sun.drawSunshine();
};

Game.prototype.updateBasis = function() {
  this.basis.x = game.canvas.width / 2;
  this.basis.y = game.canvas.height / 2;

  var me = entities[myUFO.uuid];
  if (!me) return;

  this.basis.x += me.view_position.x;
  this.basis.y += me.view_position.y;
};