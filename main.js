enchant();

var IMAGE_SIZE = 32;

var Niku = enchant.Class.create(enchant.Sprite, {
  // ひとつの肉の画像サイズ（縦横いっしょ）

  initialize: function(x, y) {
    enchant.Sprite.call(this, IMAGE_SIZE, IMAGE_SIZE);
    this.image = game.assets["niku.png"];
    this.x = 16 + x * 48;
    this.y = 16 + y * 48;
    this.scaleX = this.scaleY = 48 / IMAGE_SIZE;
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

      // 同じ肉が5回連続でタップされたら消す
      if (tappedNiku.length === 5) {
        for (i = 0; i < tappedNiku.length; i++) {
          tappedNiku[i].tl.fadeOut(10).and().rotateBy(360, 10).then(function() {
            game.rootScene.removeChild(tappedNiku[i]);
          });
        }
        tappedNiku = [];
        return;
      }

      // とりあえず肉が消えたかのような画像にしておく
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
