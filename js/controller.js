// NameSpace
var game = {};
game.config = {};

/*************************************************/
// Constantes

game.STAGE_WIDTH = 500;
game.STAGE_HEIGHT = 600;
game.BACKGROUND_COLOR = "0x000000";
game.NB_ITEM_LINE = 11;
game.MARGE_ITEM = 10;

game.P1_POINTS = 30;
game.P2_POINTS = 20;
game.P3_POINTS = 10;
game.BIG_BOSS_POINTS = 100;

game.LIFE = 3;
game.SCORE = 0;
game.LEVEL = 1;

game.NB_ITEM = 55;
game.POURCENTAGE_LEVEL = 0;

game.SPACESHIP_SPEED = 2;
// Temps d'attente entre 2 tirs
game.PAUSE_BEHIND_FIRE_SPACESHIP = 410;
// Min X Line
game.MIN_X_LINE = 20;
// Max X Line
game.MAX_X_LINE = 80;
// Incr X Line
game.INCR_X_LINE = 5;
// Incr Y Line
game.INCR_Y_LINE = 5;
// Vitesse des bullets
game.SPEED_BULLET_S = 8;
game.SPEED_BULLET_P = 5;

/************************************************/

/************************************************/
// Arrays

game.bullets_S = [];
game.bullets_P = [];
game.monsters = [];
game.bridges = [];
game.lines = [];
game.result = [];

/*************************************************/

/**************************************************/
// Keyboard

var keycode = {};
keycode.LEFT = false;
keycode.RIGHT = false;
keycode.SPACE = false;

/**************************************************/

/**************************************************/
// Var
var stage, renderer, spaceship, monsterContainer, bulletContainer, spaceshipContainer,
line1Container, line2Container, line3Container, line4Container, line5Container, loader,
bigMonster, lifeContainer, bridgeContainer;

// Texture

var textureSpaceship1, textureSpaceship2, textureSpaceship, textureP1_1, textureP1_2, textureP2_1, textureP2_2,
textureP3_1, textureP3_2, textureP1, textureP2, textureP3, texturePdie, textureBoss, textureBulletSpaceship,
textureBulletMonster, textureBossDie;

var pont1, pont1_2, pont2, pont2_2, pont3, pont3_2, pont4, pont4_2, pont5, pont5_2, pont6, pont6_2,
pont7, pont7_2, pont8, pont8_2, pont9, pont9_2;

var texturePont1, texturePont2, texturePont3, texturePont4, texturePont5, texturePont6, texturePont7, texturePont8, texturePont9;

// QuadTree

var quadBulletP, quadBulletS;

// TimeOut

var timerMonster, intervalLineAnim, timerKeyboard, timerLine, timerDie;

/**************************************************/

/**************************************************/
// var to reset

var canFire = false;
var isTouch = false;
var reverse = false;
var onEnterFrame = false;
var counterLine = 0;
var monsterHeight = 26;
var monsterShow = 0;
var delayedVar = 0;

var lastFireRandom;
var lastFireRandomPositionX;

var scoreToBeInTop10;

/**************************************************/

// GamePlay

var gamePlay = [
{LEVEL:1,INTERVAL_LINE:335,INTERVAL_FIRE_MONSTER_MIN:1000,INTERVAL_FIRE_MONSTER_MAX:1700,INTERVAL_FIRE_MONSTER_STEP:100,SPEED_BIG_MONSTER:1.5},
{LEVEL:2,INTERVAL_LINE:275,INTERVAL_FIRE_MONSTER_MIN:800,INTERVAL_FIRE_MONSTER_MAX:1400,INTERVAL_FIRE_MONSTER_STEP:100,SPEED_BIG_MONSTER:2},
{LEVEL:3,INTERVAL_LINE:250,INTERVAL_FIRE_MONSTER_MIN:650,INTERVAL_FIRE_MONSTER_MAX:1050,INTERVAL_FIRE_MONSTER_STEP:50,SPEED_BIG_MONSTER:2.5},
{LEVEL:4,INTERVAL_LINE:210,INTERVAL_FIRE_MONSTER_MIN:500,INTERVAL_FIRE_MONSTER_MAX:800,INTERVAL_FIRE_MONSTER_STEP:35,SPEED_BIG_MONSTER:3},
{LEVEL:5,INTERVAL_LINE:180,INTERVAL_FIRE_MONSTER_MIN:375,INTERVAL_FIRE_MONSTER_MAX:550,INTERVAL_FIRE_MONSTER_STEP:30,SPEED_BIG_MONSTER:3.5},
{LEVEL:6,INTERVAL_LINE:150,INTERVAL_FIRE_MONSTER_MIN:260,INTERVAL_FIRE_MONSTER_MAX:420,INTERVAL_FIRE_MONSTER_STEP:30,SPEED_BIG_MONSTER:4},
{LEVEL:7,INTERVAL_LINE:120,INTERVAL_FIRE_MONSTER_MIN:200,INTERVAL_FIRE_MONSTER_MAX:375,INTERVAL_FIRE_MONSTER_STEP:30,SPEED_BIG_MONSTER:4},
{LEVEL:8,INTERVAL_LINE:100,INTERVAL_FIRE_MONSTER_MIN:170,INTERVAL_FIRE_MONSTER_MAX:340,INTERVAL_FIRE_MONSTER_STEP:30,SPEED_BIG_MONSTER:4.5},
{LEVEL:9,INTERVAL_LINE:80,INTERVAL_FIRE_MONSTER_MIN:125,INTERVAL_FIRE_MONSTER_MAX:300,INTERVAL_FIRE_MONSTER_STEP:30,SPEED_BIG_MONSTER:5.5},
{LEVEL:10,INTERVAL_LINE:65,INTERVAL_FIRE_MONSTER_MIN:80,INTERVAL_FIRE_MONSTER_MAX:200,INTERVAL_FIRE_MONSTER_STEP:20,SPEED_BIG_MONSTER:6}
]

// Jquery Ready

$(document).ready(init);

function init() {

  // Recupere le HighScore
  var scoreCollectionTemp = new app.Collections.ScoreCollection();
  scoreCollectionTemp.fetch({success:function(){

  $("#highScore").html(convertScore(scoreCollectionTemp.models[0].get("score")));
  $("#titleHighScore").html("HI SCORE &rsaquo;"+scoreCollectionTemp.models[0].get("pseudo")+"&lsaquo;");
  scoreToBeInTop10 = scoreCollectionTemp.models[9].get("score");

  }});

  // PIXI
  stage = new PIXI.Stage(game.BACKGROUND_COLOR);
  renderer = PIXI.autoDetectRenderer(game.STAGE_WIDTH, game.STAGE_HEIGHT);

  $("#container").append(renderer.view);

  // create an array of assets to load
  var assetsToLoader = ["assets/sprites.json"];

  // create a new loader
  loader = new PIXI.AssetLoader(assetsToLoader);

  // use callback
  loader.onProgress = loading
  loader.onComplete = buildTexture

  //begin load
  loader.load();

}

function loading(e){

  //console.log("loading...");

}

function buildTexture(){

  $("#loading").hide();

  // texture spaceship
  textureSpaceship1 = PIXI.Texture.fromFrame("spaceship_01.png");
  textureSpaceship2 = PIXI.Texture.fromFrame("spaceship_02.png");
  textureSpaceship3 = PIXI.Texture.fromFrame("empty.png");

  // array texture spaceship
  textureSpaceship = [textureSpaceship1];
  textureSpaceshipDie = [textureSpaceship2,textureSpaceship3];

  // texture monster
  textureP1_1 = PIXI.Texture.fromFrame("p1_01.png");
  textureP1_2 = PIXI.Texture.fromFrame("p1_02.png");
  textureP2_1 = PIXI.Texture.fromFrame("p2_01.png");
  textureP2_2 = PIXI.Texture.fromFrame("p2_02.png");
  textureP3_1 = PIXI.Texture.fromFrame("p3_01.png");
  textureP3_2 = PIXI.Texture.fromFrame("p3_02.png");
  textureP1 = [textureP1_1,textureP1_2];
  textureP2 = [textureP2_1,textureP2_2];
  textureP3 = [textureP3_1,textureP3_2];
  texturePdie = [PIXI.Texture.fromFrame("p_die.png")];
  textureBoss = [PIXI.Texture.fromFrame("boss.png")];
  textureBossDie = [PIXI.Texture.fromFrame("boss_die.png")];

  // texture Bullet
  textureBulletSpaceship = PIXI.Texture.fromFrame("s_bullet.png");
  textureBulletMonster = PIXI.Texture.fromFrame("p_bullet.png");

  // texture Pont
  pont1 = PIXI.Texture.fromFrame("pont1.png");
  pont1_2 = PIXI.Texture.fromFrame("pont1_2.png");
  pont2 = PIXI.Texture.fromFrame("pont2.png");
  pont2_2 = PIXI.Texture.fromFrame("pont2_2.png");
  pont3 = PIXI.Texture.fromFrame("pont3.png");
  pont3_2 = PIXI.Texture.fromFrame("pont3_2.png");
  pont4 = PIXI.Texture.fromFrame("pont4.png");
  pont4_2 = PIXI.Texture.fromFrame("pont4_2.png");
  pont5 = PIXI.Texture.fromFrame("pont5.png");
  pont5_2 = PIXI.Texture.fromFrame("pont5_2.png");
  pont6 = PIXI.Texture.fromFrame("pont6.png");
  pont6_2 = PIXI.Texture.fromFrame("pont6_2.png");
  pont7 = PIXI.Texture.fromFrame("pont7.png");
  pont7_2 = PIXI.Texture.fromFrame("pont7_2.png");
  pont8 = PIXI.Texture.fromFrame("pont8.png");
  pont8_2 = PIXI.Texture.fromFrame("pont8_2.png");
  pont9 = PIXI.Texture.fromFrame("pont9.png");
  pont9_2 = PIXI.Texture.fromFrame("pont9_2.png");

  texturePont1 = [pont1,pont1_2];
  texturePont2 = [pont2,pont2_2];
  texturePont3 = [pont3,pont3_2];
  texturePont4 = [pont4,pont4_2];
  texturePont5 = [pont5,pont5_2];
  texturePont6 = [pont6,pont6_2];
  texturePont7 = [pont7,pont7_2];
  texturePont8 = [pont8,pont8_2];
  texturePont9 = [pont9,pont9_2];

  startScreen();

}

function buildContainer(){


  startScreen();

}

function startScreen(){

  $("#startGame").fadeIn(300);
  $(document).bind("keyup",keyDownStart);

  // Life
  updateLife();
  renderer.render(stage);

}

function keyDownStart(e){

  if (e.keyCode == 13) {
    $(document).unbind("keyup",keyDownStart);
    $("#startGame").fadeOut(300, showLevel);
  }

}

function showLevel(){

  // Credit = 0
  $("#nbCredit").html("00");

  $("#level").html("LEVEL "+game.LEVEL);
  $("#level").fadeIn(300).delay(1500).fadeOut(200,newGame);

}

function newGame(){

  bulletContainer = new PIXI.DisplayObjectContainer();
  stage.addChild(bulletContainer);

  bridgeContainer = new PIXI.DisplayObjectContainer();
  stage.addChild(bridgeContainer);

  spaceshipContainer = new PIXI.DisplayObjectContainer();
  stage.addChild(spaceshipContainer);

  monsterContainer = new PIXI.DisplayObjectContainer();
  stage.addChild(monsterContainer);

  line1Container = new Line();
  monsterContainer.addChild(line1Container);

  line2Container = new Line();
  monsterContainer.addChild(line2Container);

  line3Container = new Line();
  monsterContainer.addChild(line3Container);

  line4Container = new Line();
  monsterContainer.addChild(line4Container);

  line5Container = new Line();
  monsterContainer.addChild(line5Container);

  game.lines =  [line1Container,line2Container,line3Container,line4Container,line5Container];

  // QuadTree
  var bounds = {
      x:0,
      y:0,
      width:game.STAGE_WIDTH,
      height:game.STAGE_HEIGHT
  }

  quadBulletP = new QuadTree(bounds, false, 8);
  quadBulletS = new QuadTree(bounds, false, 8);

  onEnterFrame = true;
  // EnterFrame
  requestAnimFrame(animate);

  // Spaceship
  spaceship = new Spaceship(textureSpaceship,textureSpaceshipDie,(renderer.width / 2) - (textureSpaceship1.width / 2), 475);
  spaceshipContainer.addChild(spaceship);

  // Monster
  buildMonster();

  // Pont
  buildBridge();

  // Life
  updateLife();

  // Keyboard Event
  $(document).bind("keydown",keydown);
  $(document).bind("keyup",keyup);

}

function keydown (e) {

	if (e.keyCode == 37) keycode.LEFT = true;
	if (e.keyCode == 39) keycode.RIGHT = true;
	if (e.keyCode == 32) {
    if (canFire) {
      fire();
      disableFire();
      timerKeyboard = setTimeout(enableFire,game.PAUSE_BEHIND_FIRE_SPACESHIP);
    }
  }


}

function keyup (e) {

	if (e.keyCode == 37) keycode.LEFT = false;
	if (e.keyCode == 39) keycode.RIGHT = false;

}

function enableFire(){

  clearTimeout(timerKeyboard);
  canFire = true;

}

function disableFire(){

  canFire = false;

}

function buildMonster(){

  var p1 = {textures:textureP1,points:game.P1_POINTS};
  var p2 = {textures:textureP2,points:game.P2_POINTS};
  var p3 = {textures:textureP3,points:game.P3_POINTS};

  var pTab = [p1,p2,p2,p3,p3];
  var pContainer = [line1Container,line2Container,line3Container,line4Container,line5Container];

  var posY = 170;

  // All small monster

  for (var i = 0;i<pTab.length;i++) {

    var posX = 0;

    for (var j = 0;j<game.NB_ITEM_LINE;j++) {

      var monster = new Monster(pTab[i].textures, texturePdie, pTab[i].points,posX,0,"normal");
      monster.alpha = 0;
      game.monsters.push(monster);
      posX += monster.texture.width + game.MARGE_ITEM;
      var container = pContainer[i];
      container.position.x = 20;
      container.position.y = posY;
      container.addChild(monster);

    }

    posY += monsterHeight;

  }

  TweenLite.delayedCall(0.5,animMonster);

}

function buildBridge(){


  var tabBridge = [];
  var posX = 90;

  for (var i=0;i<4;i++) {

    var bridge = new Bridge(texturePont1,texturePont2,texturePont3,texturePont4,texturePont5,texturePont6,texturePont7,texturePont8,texturePont9);
    bridge.position.x = posX;
    bridge.position.y = 427;
    posX = posX + 44 + 45;
    bridgeContainer.addChild(bridge);
    tabBridge.push(bridge);

  }

  for (var j=0;j<tabBridge.length;j++) {

    for (var k=0;k<tabBridge[j].children.length;k++) game.bridges.push(tabBridge[j].children[k]);

  }

}

function animMonster(){

  for (var i = 0;i<game.monsters.length;i++) {

    var m = game.monsters[i];
    TweenLite.delayedCall(i/50,showMonster,[m]);

  }

}

function showMonster(monster){

  monster.alpha = 1;
  monsterShow++;

  if (monsterShow == game.monsters.length) animateLineMonster();

}

function animateLineMonster(){

  canFire = true;

  // A big monster

  bigMonster = new Monster(textureBoss, textureBossDie, game.BIG_BOSS_POINTS, -100, 125,"boss");
  monsterContainer.addChild(bigMonster);
  game.monsters.push(bigMonster);

  animateLine();
  timerMonster = setTimeout(fireRandom,random(gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_MIN,gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_MAX,gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_STEP));

}

function fire(){

  var bullet = new Bullet(textureBulletSpaceship);
  bullet.setPosition(spaceship.position.x + spaceship.texture.width/2 ,spaceship.position.y);
  game.bullets_S.push(bullet);
  bulletContainer.addChild(bullet);

}

function fireRandom(){

  // Clean
  clearTimeout(timerMonster);
  timerMonster = null;

  var bullet = new Bullet(textureBulletMonster);
  var r = random(0,game.monsters.length-1,1);
  if (lastFireRandom == r) r = random(0,game.monsters.length-1,1);
  lastFireRandom = r;
  var m = game.monsters[r];

  if (m.type == "boss") return timerMonster = setTimeout(fireRandom,random(gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_MIN,gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_MAX,gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_STEP));

  var x = m.localToGlobal().x;
  if (lastFireRandomPositionX == x) x = m.localToGlobal().x + 1;
  lastFireRandomPositionX = x;
  bullet.setPosition(x + m.texture.width/2 ,m.localToGlobal().y);
  game.bullets_P.push(bullet);
  bulletContainer.addChild(bullet);

  timerMonster = setTimeout(fireRandom,random(gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_MIN,gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_MAX,gamePlay[game.LEVEL-1].INTERVAL_FIRE_MONSTER_STEP));

}

function checkKeyboard() {

    if (spaceship) {

      if (keycode.LEFT) {
        if (spaceship.position.x > 0) spaceship.position.x -= game.SPACESHIP_SPEED;
        else spaceship.position.x = 0;
      }
      if (keycode.RIGHT) {
        if (spaceship.position.x < renderer.width - spaceship.texture.width) spaceship.position.x += game.SPACESHIP_SPEED;
        else spaceship.position.x = renderer.width - spaceship.texture.width;
      }

    }

}

function checkBulletS(){

  if (game.bullets_S.length > 0) {

    $(game.bullets_S).each(function(index){

      if(this.position.y > 105 + this.texture.height) {
        this.position.y -= game.SPEED_BULLET_S;
      }
      else {
        bulletContainer.removeChild(this);
        game.bullets_S.splice(index,1);
      }

    });

  }

}

function checkBulletP(){

  if (game.bullets_P.length > 0) {

    for (var i = 0;i<game.bullets_P.length;i++) {

      var t = game.bullets_P[i];

      if(t.position.y < 520 - t.texture.height) {
        t.position.y += game.SPEED_BULLET_P;
      }
      else {
        if (t) {
          bulletContainer.removeChild(t);
          game.bullets_P.splice(i,1);
          break;
        }
      }
    }

  }

}

function animateLine(){

  clearTimeout(timerLine);

  var line1 = game.lines[0];
  var line2 = game.lines[1];
  var line3 = game.lines[2];
  var line4 = game.lines[3];
  var line5 = game.lines[4];

  var min = game.MIN_X_LINE;
  var max = game.MAX_X_LINE;
  var incrX = game.INCR_X_LINE;
  var incrY = game.INCR_Y_LINE;

  if (delayedVar == 1) delayedVar = 0;
  else delayedVar = 1;

  if (counterLine == 50) {
    counterLine = 0;

    for (var i=0;i<game.lines.length;i++) game.lines[i].position.y +=incrY;
  }

  if (delayedVar == 0) {

    // line1
    if(!line1.reverse) (line1.position.x <max) ? line1.position.x += incrX : line1.reverse = true
    if(line1.reverse) (line1.position.x >min) ? line1.position.x -= incrX : line1.reverse = false

    // line3
    if(!line3.reverse) (line3.position.x <max) ? line3.position.x += incrX : line3.reverse = true
    if(line3.reverse) (line3.position.x >min) ? line3.position.x -= incrX : line3.reverse = false

    // line5
    if(!line5.reverse) (line5.position.x <max) ? line5.position.x += incrX : line5.reverse = true
    if(line5.reverse) (line5.position.x >min) ? line5.position.x -= incrX : line5.reverse = false

  } else {

    // line2
    if(!line2.reverse) (line2.position.x <max) ? line2.position.x += incrX : line2.reverse = true
    if(line2.reverse) (line2.position.x >min) ? line2.position.x -= incrX : line2.reverse = false

    // line5
    if(!line4.reverse) (line4.position.x <max) ? line4.position.x += incrX : line4.reverse = true
    if(line4.reverse) (line4.position.x >min) ? line4.position.x -= incrX : line4.reverse = false

  }

  counterLine++;

  timerLine = setTimeout(animateLine,gamePlay[game.LEVEL-1].INTERVAL_LINE);

}

function checkBigMonster(){

  if (bigMonster) {

    if (bigMonster.position.x >= -200 & bigMonster.position.x < 700) {
      bigMonster.position.x += gamePlay[game.LEVEL-1].SPEED_BIG_MONSTER;
    } else {
      bigMonster.position.x = -200;
    }

  }

}

function updateTree(){

  quadBulletP.clear();

  for (var i = 0;i<game.bullets_P.length ;i++) {

    var obj = {};
    obj.item = game.bullets_P[i];
    obj.id = i;
    obj.dataRef = game.bullets_P;
    obj.x = game.bullets_P[i].position.x;
    obj.y = game.bullets_P[i].position.y;
    obj.width = game.bullets_P[i].texture.width;
    obj.height = game.bullets_P[i].texture.height;
    quadBulletP.insert(obj);
    obj = null;

  }

  quadBulletS.clear();

  for (var j = 0;j<game.bullets_S.length ;j++) {

    var obj2 = {};
    obj2.item = game.bullets_S[j];
    obj2.id = j;
    obj2.dataRef = game.bullets_S;
    obj2.x = game.bullets_S[j].position.x;
    obj2.y = game.bullets_S[j].position.y;
    obj2.width = game.bullets_S[j].texture.width;
    obj2.height = game.bullets_S[j].texture.height;
    quadBulletS.insert(obj2);
    obj2 = null;

  }

}

function checkCollisionP(){


  // Collision check entre Bullet Spaceship & Ennemy

  for (var i = 0;i<game.monsters.length ;i++) {

    var find = false;

    var monster = game.monsters[i];
    var items = quadBulletS.retrieve({x:monster.localToGlobal().x, y:monster.localToGlobal().y, height:monster.texture.height, width:monster.texture.width});

    if (items.length > 0) {

      for(var j = 0; j < items.length; j++)
      {

        var bullet = items[j];
        var itemP = bullet.item;
        colliding = detectCollision(bullet.x,bullet.y,bullet.width,bullet.height,monster.localToGlobal().x,monster.localToGlobal().y,monster.texture.width,monster.texture.height);

        if (colliding) {

          // Compte les points
          game.SCORE += monster.points;
          updateScore(game.SCORE);

          bulletContainer.removeChild(itemP);
          game.monsters.splice(i,1);
          game.bullets_S.splice(bullet.id,1);
          monster.die();

          checkProgress();

          find = true;
          break;

        }

      }

    }

    if (find) break;

  }

}

function checkCollisionS(){


  // Collision check entre Bullet Ennemy & Spaceship


  var items = quadBulletP.retrieve({x:spaceship.position.x, y:spaceship.position.y, height:spaceship.texture.height, width:spaceship.texture.width});

  if (items.length > 0) {

    for(var i = 0; i < items.length; i++)
    {

      var bullet = items[i];
      colliding = detectCollision(bullet.x+1,bullet.y-1,bullet.width-2,bullet.height,spaceship.position.x+1,spaceship.position.y-1,spaceship.texture.width-2,spaceship.texture.height);

      if (colliding) {

        bulletContainer.removeChild(bullet.item);
        game.bullets_P.splice(bullet.id,1);
        canFire = false;
        spaceship.die();
        isTouch = true;
        timerDie = setTimeout(function(){
          clearTimeout(timerDie);
          canFire = true;
          isTouch = false;
        },1000);
        game.LIFE--;
        updateLife();
        if (game.LIFE == 0) gameOver();
        break;

      }

    }

  }

}

function checkCollisionBP(){

  // Collision check entre Bullet Ennemy & Bridge

  for (var i = 0;i<game.bridges.length ;i++) {

    var find = false;

    var bridgeS = game.bridges[i];
    var itemP = quadBulletP.retrieve({x:bridgeS.localToGlobal().x, y:bridgeS.localToGlobal().y, height:bridgeS.texture.height, width:bridgeS.texture.width});

    if (itemP.length > 0) {

      for(var j = 0; j < itemP.length; j++)
      {

        var bulletP = itemP[j];
        var _itemP = bulletP.item;
        colliding = detectCollision(bulletP.x,bulletP.y,bulletP.width,bulletP.height,bridgeS.localToGlobal().x,bridgeS.localToGlobal().y,bridgeS.texture.width,bridgeS.texture.height);

        if (colliding) {

          if (_itemP) {

            bulletContainer.removeChild(_itemP);
            game.bullets_P.splice(bulletP.id,1);

            bridgeS.touch();


            if (bridgeS.count > 1) {
              game.bridges.splice(i,1);
              bridgeS.parent.removeChild(bridgeS);
            }
              find = true;

          }

          break;

        }

      }

    }

    if (find) break;

  }

}

function checkCollisionBS(){

  // Collision check entre Bullet Ennemy & Spaceship

  for (var i = 0;i<game.bridges.length ;i++) {

    var find = false;

    var bridgeS = game.bridges[i];
    var itemS = quadBulletS.retrieve({x:bridgeS.localToGlobal().x, y:bridgeS.localToGlobal().y, height:bridgeS.texture.height, width:bridgeS.texture.width});

    if (itemS.length > 0) {

      for(var j = 0; j < itemS.length; j++)
      {

        var bulletS = itemS[j];
        var _itemS = bulletS.item;
        colliding = detectCollision(bulletS.x,bulletS.y,bulletS.width,bulletS.height,bridgeS.localToGlobal().x,bridgeS.localToGlobal().y,bridgeS.texture.width,bridgeS.texture.height);

        if (colliding) {

          if (_itemS) {

            bulletContainer.removeChild(_itemS);
            game.bullets_S.splice(bulletS.id,1);

            bridgeS.touch();


            if (bridgeS.count > 1) {
              game.bridges.splice(i,1);
              bridgeS.parent.removeChild(bridgeS);
            }
              find = true;

          }

          break;

        }

      }

    }

    if (find) break;

  }

}


function updateScore(score){

  var nbCharMax = 6;
  var str ="";
  var nbChar = score.toString().length;
  var len = nbCharMax - nbChar;
  for (var i=0;i<len;i++) str += "0";
  str += score.toString();

  $("#score").html(str);

}

function convertScore(score){

  var nbCharMax = 6;
  var str ="";
  var nbChar = score.toString().length;
  var len = nbCharMax - nbChar;
  for (var i=0;i<len;i++) str += "0";
  str += score.toString();
  return str;

}

function updateLife(){

  $("#life").html(game.LIFE);

  if (lifeContainer) stage.removeChild(lifeContainer);
  lifeContainer = null;

  lifeContainer = new PIXI.DisplayObjectContainer();
  lifeContainer.position.x = 60;
  lifeContainer.position.y = 528;
  stage.addChild(lifeContainer);

  var posX = 0;

  for (var i=0;i<game.LIFE-1;i++) {

    var life = new SpaceshipLife(textureSpaceship1);
    life.setPosition(posX,0);
    lifeContainer.addChild(life);
    posX = posX + life.texture.width;

  }

}

function checkProgress(){

  game.result = [];

  for (var i = 0;i<game.monsters.length;i++) {

    if (game.monsters[i].type == "normal") {
      game.result.push(game.monsters[i]);
    }

  }

  // Calcul pourcentage
  game.POURCENTAGE_LEVEL = Math.round((100/game.NB_ITEM) * (game.NB_ITEM-game.result.length));

  if (game.result.length == 0) {

    game.POURCENTAGE_LEVEL = 100;
    nextLevel();
  }

}

function clearGame(){

  onEnterFrame = false;
  canFire = false;
  reverse = false;

  // Timer
  clearTimeout(timerMonster);
  clearTimeout(intervalLineAnim);
  clearTimeout(timerKeyboard);
  clearTimeout(timerLine);

  for (var i in game.bullets_S) {
    bulletContainer.removeChild(game.bullets_S[i]);
    game.bullets_S[i] = null;
  }
  for (var j in game.bullets_P) {
    bulletContainer.removeChild(game.bullets_P[j]);
    game.bullets_P[j] = null;
  }
  for (var k in game.monsters) {
    game.monsters[k].parent.removeChild(game.monsters[k]);
    game.monsters[k] = null;
  }
  for (var l in game.bridges) {
    game.bridges[l].parent.removeChild(game.bridges[l]);
    game.bridges[l] = null;
  }

  // Remove Container

  game.bullets_S = [];
  game.bullets_P = [];
  game.monsters = [];
  game.bridges = [];
  game.lines = [];
  game.result = [];

  stage.removeChild(bulletContainer);
  bulletContainer = null;

  stage.removeChild(bridgeContainer);
  bridgeContainer = null;

  spaceshipContainer.removeChild(spaceship);
  spaceship = null;
  stage.removeChild(spaceshipContainer);
  spaceshipContainer = null;

  monsterContainer.removeChild(line1Container);
  line1Container = null;

  monsterContainer.removeChild(line2Container);
  line2Container = null;

  monsterContainer.removeChild(line3Container);
  line3Container = null;

  monsterContainer.removeChild(line4Container);
  line4Container = null;

  monsterContainer.removeChild(line5Container);
  line5Container = null;

  stage.removeChild(monsterContainer);
  monsterContainer = null;

  // QuadTree
  quadBulletP = null;
  quadBulletS = null;

  //
  monsterShow = 0;
  delayedVar = 0;
  game.POURCENTAGE_LEVEL = 0;
  counterLine = 0;
  isTouch = false;

  keycode.LEFT = false;
  keycode.RIGHT = false;
  keycode.SPACE = false;

}

function nextLevel(){

  console.log("NEXT LEVEL");

  clearGame();
  game.LEVEL++;
  showLevel();

}

function gameOver(){

  onEnterFrame = false;
  clearGame();
  if (game.SCORE > scoreToBeInTop10) $("#gameOver").fadeIn(300).delay(2000).fadeOut(200,recordName);
  else $("#gameOver").fadeIn(300).delay(2000).fadeOut(200,showHighScores);

}

function recordName(){

    // customNameView
  var customNameView = new app.Views.CustomNameView();
  customNameView.setScore(game.SCORE);
  $("#saveScore").append(customNameView.render().el);
  $("#saveScore").show();
  $("#saveGame").show();
  customNameView.on("complete",showHighScores);


}

function showHighScores(){

  $("#saveScore").hide();
  $("#saveGame").hide();

  $("#highscores").fadeIn(300);

  // Collection HighScore
  var scoreCollection = new app.Collections.ScoreCollection();
  scoreCollection.fetch({success: function(){
    var highScoresView = new app.Views.HighScoresView({collection:scoreCollection});
    $("#highscores #list").append(highScoresView.render().el);
  }});

  $(window).bind("keydown",reStart);

}

function reStart(e){

  if (e.keyCode == 13) {

      game.LIFE = 3;
      game.LEVEL = 1;
      game.SCORE = 0;
      updateScore(game.SCORE);

      $(window).unbind("keydown",reStart);
      $("#highscores").hide();
      $("#highscores #list").html("");
      // restart

      updateLife();
      renderer.render(stage);
      showLevel();


  }

}

function animate() {

    if (onEnterFrame) {

      updateTree();

      checkKeyboard();

      checkBigMonster();

      checkCollisionBP();
      checkCollisionBS();

      if (!isTouch) checkCollisionS();
      checkCollisionP();

      checkBulletS();
      checkBulletP();

      // render Stage
      renderer.render(stage);

      requestAnimFrame( animate );

    }
}

/* HELPERS */

function detectCollision(x1, y1, Wsize1,Hsize1, x2, y2, Wsize2,Hsize2) {
  var bottom1, bottom2, left1, left2, right1, right2, top1, top2;
  left1 = x1;
  right1 = x1 + Wsize1;
  top1 = y1;
  bottom1 = y1 + Hsize1;
  left2 = x2;
  right2 = x2 + Wsize2;
  top2 = y2;
  bottom2 = y2 + Hsize2;
  return !(left1 > right2 || left2 > right1 || top1 > bottom2 || top2 > bottom1);
};

function random(nMinimum, nMaximum, nRoundToInterval) {

  if (!nRoundToInterval || nRoundToInterval == null || nRoundToInterval == undefined) nRoundToInterval = 1;

  if(nMinimum > nMaximum) {
    var nTemp = nMinimum;
    nMinimum = nMaximum;
    nMaximum = nTemp;
  }

  var nDeltaRange = (nMaximum - nMinimum) + (1 * nRoundToInterval);
  var nRandomNumber = Math.random() * nDeltaRange;
  nRandomNumber += nMinimum;
  return floor(nRandomNumber, nRoundToInterval);

}

function floor(nNumber, nRoundToInterval) {

  return Math.floor(nNumber / nRoundToInterval) * nRoundToInterval;
}