function Stars() {
  this.count = 1500;
  this.stars = [];
  this.color = '#fff';

  this.initPromise = $.Deferred();
  this.spawn();
}

Stars.prototype.spawn = function() {
  var _this = this;

  for (var i = 0; i < _this.count; i++) {
    _this.stars[i] = {};

    var k = 2;
    _this.stars[i].x = getRandomInt(-canvas.width*k, canvas.width*k);
    _this.stars[i].y = getRandomInt(-canvas.height*k, canvas.height*k);
    _this.stars[i].r = getRandomInt(1, 2);

    if (i == _this.count -1) {
      _this.initPromise.resolve();
    }
  }
}

Stars.prototype.draw = function() {
  var _this = this;

  game.ctx.fillStyle = this.color;

  for (var i = 0; i < _this.count; i++) {
    game.ctx.beginPath();
    game.ctx.arc(game.basis.x - _this.stars[i].x, game.basis.y - _this.stars[i].y, _this.stars[i].r, 0, 2*Math.PI);
    game.ctx.fill();
  }
};