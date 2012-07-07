enchant();

// ひとつの肉の画像サイズ（縦横いっしょ）
var IMAGE_SIZE = 48;
var NIKU_NAMES = [ "Junkei", "Shirot", "Negima", "Tan", "Kyuuri", "Wakadori" ];

var Niku = enchant.Class.create(enchant.Sprite, {

  initialize: function(x, y, type) {
    enchant.Sprite.call(this, IMAGE_SIZE, IMAGE_SIZE);
    this.image = game.assets["niku.png"];
    this.x = 16 + x * 48;
    this.y = 56 + y * 48;
    this.scaleX = this.scaleY = 48 / IMAGE_SIZE;
    this.type = type;
    this.frame = this.type;

    this.addEventListener("touchend", function() {
      var i, nikumatch = true;

      tappedNiku[tappedNiku.length] = this;
      // タップされたことが分かるような見た目にする
      this.rotation = 90;
      if (tappedNiku.length < 5) {
        return;
      }

      // 肉が5つ選択された

      // 注文通りか判定する
      for (i = 0; i < tappedNiku.length; i++) {
        if (nikuOrder.type !== tappedNiku[i].type) {
          nikumatch = false;
          break;
        }
      }

      if (nikumatch) {
        // 成功！
        for (i = 0; i < tappedNiku.length; i++) {
          tappedNiku[i].tl.fadeOut(10).and().rotateBy(360, 10).then(function() {
            game.rootScene.removeChild(tappedNiku[i]);
          });
        }
        score += 10;
      } else {
        // 失敗！
        for (i = 0; i < tappedNiku.length; i++) {
          tappedNiku[i].rotation = 0;
        }
        game.end("なにもってきとんじゃ！");
      }

      tappedNiku = [];
      nikuOrder.newOrder();
    });

    game.rootScene.addChild(this);
  }
});

var NikuOrder = Class.create(Label, {
  initialize: function() {
    Label.call(this, "Hey, Kiyoshi!!");
    this.font = "20pt Impact";
    this.newOrder();
    this.addEventListener("enterframe", function() {
      this.text = NIKU_NAMES[this.type] + "  " + this.timelimit;
      this.timelimit--;
      if (this.timelimit < 0) {
        game.end("おそいわ！");
      }
    });
    game.rootScene.addChild(this);
  },

  newOrder: function() {
    this.type = Math.floor(Math.random() * 6);
    this.timelimit = 600;
  }
});

// 0から5までの数が6つずつ入ったランダムな配列を返す
function shuffledNumberArray() {
  var ary = [], x, y;
  for (y = 0; y < 6; y++) {
    for (x = 0; x < 6; x++) {
      ary[x + y * 6] = y;
    }
  }
  // シャッフルシャッフル
  for (i = 0; i < 6 * 6; i++) {
    var r = Math.floor(Math.random() * 6 * 6);
    var tmp = ary[i];
    ary[i] = ary[r];
    ary[r] = tmp;
  }
  return ary;
}

window.onload = function() {
    game = new Game(320, 356);
    game.preload("niku.png");
    game.onload = function() {
      score = 0;
      var i, x, y;

      // 肉を並べる.
      // 絶対に解けるようにしないと
      tappedNiku = [];
      nikuTable = [];
      var nikuTypes = shuffledNumberArray();
      for (y = 0; y < 6; y++) {
        nikuTable[y] = [];
        for (x = 0; x < 6; x++) {
          nikuTable[y][x] = new Niku(x, y, nikuTypes[x + y * 6]);
        }
      }

      // 注文を入れる
      nikuOrder = new NikuOrder();

      // スコア表示
      var scoreLabel = new Label("0 aki");
      scoreLabel.font = "20pt Impact";
      scoreLabel.x = 200;
      scoreLabel.addEventListener("enterframe", function() {
        this.text = score + " aki";
      });
      game.rootScene.addChild(scoreLabel);
    }
    game.start();
}
