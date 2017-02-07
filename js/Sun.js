function Sun() {
  this.x = 200;
  this.y = 200;
  this.radius = {
    sun: 100,
    sunshine: 500,
  }

  this.color = {
    sun: '#FAF332',
    sunshine: '#FAF332',
  }

  this.initPromise = $.Deferred();
  this.initPromise.resolve();
}

Sun.prototype.draw = function() {
  var _this = this;

  game.ctx.fillStyle = this.color;
  game.ctx.beginPath();
  game.ctx.arc(game.basis.x - _this.x, game.basis.y - _this.y, _this.radius.sun, 0, 2*Math.PI);
  game.ctx.fill();
};

Sun.prototype.drawSunshine = function() {
  var _this = this;

  var grd = game.ctx.createRadialGradient(game.basis.x - _this.x, game.basis.y - _this.y, 0, game.basis.x - _this.x, game.basis.y - _this.y, _this.radius.sunshine);
  grd.addColorStop(0, _this.color.sunshine);
  grd.addColorStop(1, 'transparent');

  game.ctx.fillStyle = grd;
  game.ctx.beginPath();
  game.ctx.arc(game.basis.x - _this.x, game.basis.y - _this.y, _this.radius.sunshine, 0, 2*Math.PI);
  game.ctx.fill();
};