export class Projectiles{
    constructor(){
        this.projectiles = [];
    }
    push(projectile){
        this.projectiles.push(projectile);
    }
    update(game){
        for(let i = 0; i< this.projectiles.length; i++){
            if(!this.projectiles[i].update(game)){
                this.projectiles.splice(i--,1);
            }
        }
    }
    draw(context){
        for(let i = 0; i< this.projectiles.length; i++){
            this.projectiles[i].draw(context);
        }
    }

}
export class Weapon {
    constructor(shooter,isPlayer,projectiles,attackSpeed,projectileSpeed,projectileSize){
        this.x = shooter.x + shooter.width/2 - 5;
        this.y = shooter.y + shooter.height;
        this.shooter = shooter;
        this.isPlayer = isPlayer;
        this.projectiles = projectiles;
        this.attackCooldown = 0;
        this.attackSpeed = attackSpeed;
        this.projectileSpeed = projectileSpeed;
        this.projectileSize = projectileSize;
    }

    update(game){
        //use mouse and player position to determine where the weapon is pointing
        let dx = 0;
        let dy = 0;
        if(this.isPlayer){
            dx = game.input.mouse.x - (this.shooter.x + this.shooter.width/2);
            dy = game.input.mouse.y - (this.shooter.y + this.shooter.height/2);
        }else{
            dx = game.player.x - this.shooter.x;
            dy = game.player.y - this.shooter.y;
        }
        if(Math.abs(dx) > Math.abs(dy)){
            if(dx >0){
                this.x = this.shooter.x +this.shooter.width;
                this.y = this.shooter.y + this.shooter.height/2 - 5;
            }else{
                this.x = this.shooter.x - 10;
                this.y = this.shooter.y + this.shooter.height/2 -5;
            }   
        }else{
            if(dy > 0){
                this.y = this.shooter.y + this.shooter.height;
                this.x = this.shooter.x + this.shooter.width/2 -5;
            }else{
                this.y = this.shooter.y - 10;
                this.x = this.shooter.x + this.shooter.width/2 -5;
            }
        }

        this.attackCooldown--;
    }
    draw(context){
        context.fillStyle = 'black';
        context.fillRect(this.x,this.y,10,10);
    }
    attack(targetX,targetY){
        if(this.attackCooldown > 0) return;
        this.attackCooldown = this.attackSpeed;
        let projectile = new Projectile(this,targetX,targetY);
        this.projectiles.projectiles.push(projectile);
    }

}



class Projectile {
    
    constructor(weapon,targetX,targetY){ 
        //do math to add to attack
        let dx = targetX - weapon.x;
        let dy = targetY - weapon.y;

        const distance = Math.sqrt(dx*dx + dy*dy);

        dx /=distance;
        dy /=distance;

        this.x = weapon.x;
        this.y = weapon.y;
        this.weapon = weapon;
        this.projectileSpeed = weapon.projectileSpeed;
        this.dx = dx;
        this.dy = dy;
        this.width = 8;
        this.height = 8;
    }
    //returns answer to "the projectile has not hit anything"
    update(game){
        this.y += this.projectileSpeed*this.dy;
        this.x += this.projectileSpeed*this.dx;


        if(this.x < 0 || this.x >game.width || this.y < 0 || this.y > game.height) return false;

        if(!this.weapon.isPlayer){
            let player = game.player;
            if(this.x + this.width > player.x && this.x < player.x + player.width && this.y + this.height > player.y && this.y < player.y + player.height){
                player.takeDamage();
                return false;
            }
            return true;
        }else{
            for(let i = 0; i < game.enemies.enemies.length; i++){
                let enemy = game.enemies.enemies[i];
                if(this.x + this.width > enemy.x && this.x < enemy.x + enemy.width && this.y + this.height > enemy.y && this.y < enemy.y + enemy.height){
                    enemy.takeDamage();
                    return false;
                }
            }
            return true;
        }

        
    }
    draw(context){
        context.fillStyle = 'black';
        context.fillRect(this.x,this.y,this.width,this.height);
    }
}