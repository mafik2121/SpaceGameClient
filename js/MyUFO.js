function MyUFO() {
  this.uuid;
  this.name = "Klesh" + getRandomInt(-10,10);

  this.speed = {
    x: 0,
    y: 0,
  }

  this.initPromise = $.Deferred();
  this.loginPromise = $.Deferred();
  this.initPromise.resolve();
}

MyUFO.prototype.move = function(first_argument) {
  var _this = this;

  game.socket.emit('entity_move', {
    uuid: _this.uuid,
    velocity: {x: _this.speed.x, y: _this.speed.y},
    rotation: 0
  });
};