enchant();

window.onload = function() {
    var game = new Game(320, 320);

    game.preload("niku.png");
    game.onload = function() {
      var nikuTable = [];
      var x, y;
      var niku;
      var tappedNiku = [];

      for (y = 0; y < 6; y++) {
        nikuTable[y] = [];
        for (x = 0; x < 6; x++) {

          niku = new Sprite(32, 32);
          niku.image = game.assets["niku.png"];
          niku.x = x * 32;
          niku.y = y * 32;
          niku.frame = Math.floor(Math.random() * 6);

          niku.addEventListener("touchend", function() {
            this.frame = 3;
          });

          game.rootScene.addChild(niku);
          nikuTable[y][x] = niku;
        }
      }
    }
    game.start();
}
