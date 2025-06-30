// import {Projectiles} from '/entities/projectiles.js';
import {Player} from '/entities/player.js'
import {InputHandler} from '/input.js'
import { Enemies } from '/entities/enemies.js';
import { Projectiles } from '/entities/weapon.js';

window.addEventListener('load',function(){
    const canvas = document.getElementById("game");
    const ctx = canvas.getContext("2d");
    // const canvasRect = canvas.getBoundingClientRect(); //for mouse s
    canvas.width = 1000;
    canvas.height = 600;


    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.projectiles = new Projectiles();

            this.player = new Player(this);
            this.input = new InputHandler(this,canvas);
            
            
            this.enemies = new Enemies(this.projectiles);
            
        }
        update(){
            if(this.player.x == 0 && this.player.y ==0) game.loadFloor();
            if(this.player.x+ this.player.width == this.width && this.player.y+this.player.height == this.height) this.enemies.clearEnemies();
            this.enemies.update(game);
            this.player.update(this.input.keys, this.input.clicks);
            this.projectiles.update(game);
        }

        draw(context){
            this.player.draw(context);
            this.enemies.draw(context);
            this.projectiles.draw(context);
        }
        loadFloor(){
            this.player.x = this.width/2 - this.player.width;
            this.player.y = this.height;

            game.enemies.generateEnemy(500,100,50,50,5);
        }
    }

    const game = new Game(canvas.width,canvas.height);
    // game.loadFloor();
    function animate(){
        requestAnimationFrame(animate);
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update();
        game.draw(ctx);
        
    }
    animate();
})
