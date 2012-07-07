enchant();

// ひとつの肉の画像サイズ（縦横いっしょ）
var IMAGE_SIZE = 32;
var NIKU_NAMES = [ "Junkei", "Shirot", "Negima", "Tan", "Kyuuri", "Wakadori" ];

var Niku = enchant.Class.create(enchant.Sprite, {

  initialize: function(x, y) {
    enchant.Sprite.call(this, IMAGE_SIZE, IMAGE_SIZE);
    this.image = game.assets["niku.png"];
    this.x = 16 + x * 48;
    this.y = 56 + y * 48;
    this.scaleX = this.scaleY = 48 / IMAGE_SIZE;
    this.type = Math.floor(Math.random() * 6);
    this.frame = this.type;

    this.addEventListener("touchend", function() {
      var i, nikumatch = false;

      tappedNiku[tappedNiku.length] = this;
      // タップされたことが分かるような見た目にする
      this.rotation = 90;
      if (tappedNiku.length < 5) {
        return;
      }

      // 肉が5つ選択されたら……
      for (i = 1; i < tappedNiku.length; i++) {
        if (tappedNiku[0].type !== tappedNiku[i].type) {
          nikumatch = true;
          break;
        }
      }

      if (nikumatch) {
        // 失敗！
        for (i = 0; i < tappedNiku.length; i++) {
          tappedNiku[i].rotation = 0;
        }
      } else {
        // 成功！
        for (i = 0; i < tappedNiku.length; i++) {
          tappedNiku[i].tl.fadeOut(10).and().rotateBy(360, 10).then(function() {
            game.rootScene.removeChild(tappedNiku[i]);
          });
        }
      }

      tappedNiku = [];
    });

    game.rootScene.addChild(this);
  }
});

window.onload = function() {
    game = new Game(320, 400);
    game.preload("niku.png");
    game.onload = function() {
      var x, y;

      // 肉を並べる
      tappedNiku = [];
      nikuTable = [];
      for (y = 0; y < 6; y++) {
        nikuTable[y] = [];
        for (x = 0; x < 6; x++) {
          nikuTable[y][x] = new Niku(x, y);
        }
      }

      // 注文が入る
      var label = new Label();
      label.nikuOrder = Math.floor(Math.random() * 6);
      label.text = NIKU_NAMES[label.nikuOrder];
      game.rootScene.addChild(label);
    }
    game.start();
}
