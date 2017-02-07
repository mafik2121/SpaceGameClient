;
var game, stars, sun, myUFO;
var entities = [];

$(function () {
  // Init game
  game = new Game();

  // Login button
  $('#login').click(function () {
    $('#login').off();

    myUFO.name = $('#name').val();

    // Connect to server
    game.connect();
    game.setListens();

    // Successfully connected
    myUFO.loginPromise.done(function () {
      $('.modal').fadeOut(100);
    });
  });
});

window.onresize = function () {
  if (game != undefined && game.initCanvasPromise.state() == 'resolved') {
    game.canvas.width = window.innerWidth;
    game.canvas.height = window.innerHeight;
  }
}

// Need optimize it: send to server only mouse coords
window.onmousemove = function (e) {
  if (myUFO != undefined && myUFO.loginPromise.state() == 'resolved') {
    myUFO.speed.x = -(e.clientX - game.canvas.width/2) / 20;
    myUFO.speed.y = -(e.clientY - game.canvas.height/2) / 20;
  }
}

window.onclick = function (e) {
  if (myUFO != undefined && myUFO.loginPromise.state() == 'resolved') {
    game.socket.emit('entity_shot', {velocity: myUFO.speed});
  }
}