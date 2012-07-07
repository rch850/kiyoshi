enchant();

var Niku = enchant.Class.create(enchant.Sprite, {
  initialize: function(x, y) {
    enchant.Sprite.call(this, 32, 32);
    this.image = game.assets["niku.png"];
    this.x = x * 32;
    this.y = y * 32;
    this.type = Math.floor(Math.random() * 6);
    this.frame = this.type;

    this.addEventListener("touchend", function() {
      var i;
      tappedNiku[tappedNiku.length] = this;
      // 前回と違う肉がタップされたらもとに戻す
      if (tappedNiku.length >= 2 && tappedNiku[tappedNiku.length - 1].type !== tappedNiku[tappedNiku.length - 2].type) {
        for (i = 0; i < tappedNiku.length; i++) {
          tappedNiku[i].frame = tappedNiku[i].type;
        }
        tappedNiku = [];
        return;
      }
      this.frame = 8;
    });

    game.rootScene.addChild(this);
  }
});

window.onload = function() {
    game = new Game(320, 320);
    game.preload("niku.png");
    game.onload = function() {
      var x, y;
      tappedNiku = [];
      nikuTable = [];

      for (y = 0; y < 6; y++) {
        nikuTable[y] = [];
        for (x = 0; x < 6; x++) {
          nikuTable[y][x] = new Niku(x, y);
        }
      }
    }
    game.start();
}
