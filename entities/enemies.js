import { Weapon } from "/entities/weapon.js";

export class Enemies{
    constructor(projectiles){
        this.enemies = [];
        this.projectiles = projectiles;
    }
    update(game){
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].update(game);
            if(this.enemies[i].health <= 0){
                this.enemies.splice(i--,1);
            }
        }
    }
    draw(context){
        for(let i = 0; i < this.enemies.length; i++){
            this.enemies[i].draw(context);
        }
    }
    generateEnemy(x,y,width,height,health){
        let fiend = new Enemy(x,y,width,height,health,this.projectiles);
        this.enemies.push(fiend);
    }
    clearEnemies(){
        this.enemies = [];
    }
}

export class Enemy{
    constructor(x,y,width,height,health,projectiles){
        this.x = x;
        this.y = y;
        this.prevX;
        this.prevY;
        this.dx = 0;
        this.dy = 0;
        this.width = width;
        this.height = height;
        this.health = health;
        this.attackTimer = 16;
        this.hitTimer = 0;
        this.movementTimer = 128;
        this.weapon = new Weapon(this,false,projectiles,64,16,4);
    }
    update(game){
        if(this.attackTimer-- < 0){
            this.attack(game.player.x + game.player.width/2,game.player.y + game.player.height/2);
        }
        this.weapon.update(game);

        if(this.movementTimer-- < 0){
            this.movementTimer = 128;
            let movement = Math.floor(Math.random()*4);
            if(movement == 0){
                this.dx+=4;
            }else if(movement ==1){
                this.dx-=4;
            }else if(movement ==2){
                this.dy+=4;
            }else{
                this.dy-=4;
            }
        }


        let previousX = this.x;
        let previousY = this.y;
        this.x += this.dx*game.player.speed;
        this.y += this.dy*game.player.speed;
        
        //border collision
        if(this.y < 0) this.y = 0;
        else if(this.y > game.height - this.height) this.y = game.height - this.height;
        if(this.x <0) this.x = 0;
        else if(this.x > game.width - this.width) this.x = game.width - this.width;  

        let player = game.player;
        //player collision
        
        //NEW COLLISION IDEA
        //if: hitboxes overlap
        //calculate dx and dy
        //displace the player and enemy coordinates proportional to their masses and the dx and dy values

        if(this.x + this.width > player.x && this.x < player.x + player.width && this.y + this.height > player.y && this.y < player.y + player.height){
            if(previousY <= player.y + player.height && previousY + this.height >= player.y){
                if(previousX + this.width <=player.x){
                    this.x = player.x - this.width;
                }else{
                    this.x = player.x + player.width;
                }
            }else if(previousX <= player.x + player.width && previousX + this.width >= player.x){
                if(previousY + this.height <= player.y){
                    this.y = player.y - this.height;
                }else{
                    this.y = player.y + player.width;
                }
            }
        }


        //other enemies collision

        //coming to a stop
        if(this.dx >= 1)this.dx--;
        else if(this.dx <= -1) this.dx++;
        else this.dx = 0;

        if(this.dy >= 1) this.dy--;
        else if(this.dy <= -1) this.dy++;
        else this.dy = 0;
    }
    draw(context){
        if(this.hitTimer-- > 0) context.fillStyle = 'blue'
        else context.fillStyle = 'red';
        context.fillRect(this.x,this.y,this.width,this.height);
        this.weapon.draw(context);
    }
    takeDamage(){
        this.health--;
        this.hitTimer = 8;
    }
    attack(targetX,targetY){
        this.weapon.attack(targetX,targetY);
    }
}
