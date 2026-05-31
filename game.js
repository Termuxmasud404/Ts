let levelIndex = localStorage.getItem("level") || 0;
levelIndex = parseInt(levelIndex);

let player, platforms, spikes, door;
let left=false,right=false,jump=false;

const config = {
type: Phaser.AUTO,
width: window.innerWidth,
height: window.innerHeight,
physics:{
  default:'arcade',
  arcade:{gravity:{y:900},debug:false}
},
scene:{preload,create,update}
};

new Phaser.Game(config);

function preload(){}

function create(){
loadLevel(this);

// mobile controls
document.getElementById("left").ontouchstart=()=>left=true;
document.getElementById("left").ontouchend=()=>left=false;

document.getElementById("right").ontouchstart=()=>right=true;
document.getElementById("right").ontouchend=()=>right=false;

document.getElementById("jump").ontouchstart=()=>jump=true;
document.getElementById("jump").ontouchend=()=>jump=false;
}

function loadLevel(scene){

let level = LEVELS[levelIndex];

platforms = scene.physics.add.staticGroup();
spikes = scene.physics.add.staticGroup();

player = scene.physics.add.sprite(120,300,'');
player.setSize(28,28);
player.setTint(0x00ffcc);
player.setCollideWorldBounds(true);

level.platforms.forEach(p=>{
let b = platforms.create(p.x,p.y,'');
b.displayWidth=130;
b.displayHeight=20;
b.trap=p.trap;
b.setTint(p.trap?0xff3333:0x777777);
});

level.spikes.forEach(s=>{
let sp = spikes.create(s.x,s.y,'');
sp.displayWidth=30;
sp.displayHeight=30;
sp.setTint(0xff0000);
});

door = scene.physics.add.staticSprite(level.door.x,level.door.y,'');
door.displayWidth=50;
door.displayHeight=70;
door.setTint(0xffd700);

scene.physics.add.collider(player,platforms,hit,null,scene);
scene.physics.add.overlap(player,spikes,die,null,scene);
scene.physics.add.overlap(player,door,next,null,scene);
}

function update(){

if(!player) return;

if(left) player.setVelocityX(-250);
else if(right) player.setVelocityX(250);
else player.setVelocityX(0);

if(jump && player.body.touching.down){
player.setVelocityY(-500);
}
}

function hit(player,plat){
if(plat.trap){
die.call(this);
}
}

function die(){
this.cameras.main.shake(150,0.01);
this.scene.restart();
}

function next(){
levelIndex++;
localStorage.setItem("level",levelIndex);

if(levelIndex>=LEVELS.length){
alert("YOU WIN ULTRA PRO!");
levelIndex=0;
}

this.scene.restart();
}
