enchant();

// ひとつの肉の画像サイズ（縦横いっしょ）
var IMAGE_SIZE = 48;
// 肉の名前（日本語だと文字化けする……）
var NIKU_NAMES = [ "Junkei", "Shiro", "Negima", "Tan", "Kyuuri", "Wakadori" ];
// タイマー（フレーム単位）
var ORDER_TIMER = 30 * 10;
// フォント
var DEFAULT_FONT = "20pt Serif";

function removeAllNiku(callback) {
  var x, y;
  for (y = 0; y < 6; y++) {
    for (x = 0; x < 6; x++) {
      if (x !== 0 || y !== 0) {
        nikuTable[y][x].tl.fadeOut(10);
      } else {
        nikuTable[y][x].tl.fadeOut(10).then(function() {
          var x, y;
          for (y = 0; y < 6; y++) {
            for (x = 0; x < 6; x++) {
              game.rootScene.removeChild(nikuTable[y][x]);
            }
          }
          callback();
        });
      }
    }
  }
}

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
      var i, j, nikumatch = true;

      // 一度押した肉は反応しない
      for (i = 0; i < tappedNiku.length; i++) {
        if (tappedNiku[i] === this) {
          return;
        }
      }

      tappedNiku[tappedNiku.length] = this;
      // タップされたことが分かるような見た目にする
      this.tl.rotateBy(90, 3);
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
          if (i !== 0) {
            tappedNiku[i].tl.fadeOut(10).and().rotateBy(360, 10);
          } else {
            tappedNiku[i].tl.fadeOut(10).and().rotateBy(360, 10).then(function() {
              var okimg = new Sprite(320, 250);
              okimg.image = game.assets["okng.png"];
              okimg.x = 0;
              okimg.y = 40;
              okimg.frame = 0;
              okimg.addEventListener("enterframe", function() {
                if (this.age < 30) {
                  return;
                }
                game.rootScene.removeChild(this);
                removeAllNiku(function() {
                  setNiku();
                  tappedNiku = [];
                  nikuOrder.newOrder();
                });
              });
              game.rootScene.addChild(okimg);
            });
          }
        }
        score += Math.floor(nikuOrder.timelimit / 3 * 10);
      } else {
        // 失敗！
        for (i = 0; i < tappedNiku.length; i++) {
          if (nikuOrder.type === tappedNiku[i].type) {
            score += Math.floor(nikuOrder.timelimit / 3 / 5 * 10);
          }
        }
        var okimg = new Sprite(320, 250);
        okimg.image = game.assets["okng.png"];
        okimg.x = 0;
        okimg.y = 40;
        okimg.frame = 1;
        okimg.addEventListener("enterframe", function() {
          if (this.age < 30) {
            return;
          }
          game.rootScene.removeChild(this);
          removeAllNiku(function() {
            setNiku();
            tappedNiku = [];
            nikuOrder.newOrder();
          });
        });
        game.rootScene.addChild(okimg);
      }
    });

    game.rootScene.addChild(this);
  }
});

var NikuOrder = Class.create(Sprite, {
  initialize: function() {
    Sprite.call(this, 100, 32);
    this.image = game.assets["menu.png"];
    this.y = 4;
    this.newOrder();
    this.addEventListener("enterframe", function() {
      this.frame = this.type;
      this.timelimit--;
      this.timelimitLabel.text = Math.floor(nikuOrder.timelimit / 3 * 10);
      if (this.timelimit < 0) {
        game.end(score, score + " AKY");
      }
    });

    this.timelimitLabel = new Label("");
    this.timelimitLabel.font = DEFAULT_FONT;
    this.timelimitLabel.color = "#FF0";
    this.timelimitLabel.x = 110;
    game.rootScene.addChild(this);
    game.rootScene.addChild(this.timelimitLabel);
  },

  newOrder: function() {
    this.type = Math.floor(Math.random() * 6);
    this.timelimit = ORDER_TIMER;
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

function setNiku() {
  // 肉を並べる.
  // 絶対に解けるようにしないと
  tappedNiku = [];
  nikuTable = [];
  var x, y, nikuTypes = shuffledNumberArray();
  for (y = 0; y < 6; y++) {
    nikuTable[y] = [];
    for (x = 0; x < 6; x++) {
      nikuTable[y][x] = new Niku(x, y, nikuTypes[x + y * 6]);
    }
  }
}

window.onload = function() {
    game = new Game(320, 356);
    game.rootScene.backgroundColor = "#200";
    game.preload("niku.png", "menu.png", "okng.png");
    game.onload = function() {
      score = 0;

      // 肉を並べる
      setNiku();

      // 注文を入れる
      nikuOrder = new NikuOrder();

      // スコア表示
      var scoreLabel = new Label("AKY 0");
      scoreLabel.font = DEFAULT_FONT;
      scoreLabel.color = "#FF0";
      scoreLabel.x = 200;
      scoreLabel.addEventListener("enterframe", function() {
        this.text = "AKY " + score;
      });
      game.rootScene.addChild(scoreLabel);

    }
    game.start();
}
