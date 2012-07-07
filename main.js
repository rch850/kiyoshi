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
          niku.type = Math.floor(Math.random() * 6);
          niku.frame = niku.type;

          niku.addEventListener("touchend", function() {
            var i;
            tappedNiku[tappedNiku.length] = this;
            // 前回と違う肉がタップされたらもとに戻す
            if (tappedNiku.length >= 2 && tappedNiku[tappedNiku.length - 1].type !== tappedNiku[tappedNiku.length - 2].type) {
              for (i = 0; i < tappedNiku.length; i++) {
                console.log("revert niku: "+ i);
                tappedNiku[i].frame = tappedNiku[i].type;
              }
              tappedNiku = [];
              return;
            }
            this.frame = 8;
          });

          game.rootScene.addChild(niku);
          nikuTable[y][x] = niku;
        }
      }
    }
    game.start();
}
