import {Weapon} from '/entities/weapon.js'
import {keepInBounds,isColliding} from '../collisions.js';
export class Player {
	constructor(game){
		this.game = game;
		this.width = 50;
		this.height = 50;

		this.x = 0;
		this.y = game.height - this.height;
		this.prevX = 0;
		this.prevY = game.height - this.height;
		this.dx = 0;
		this.dy = 0;
		this.speed = 4;

		this.weapon = new Weapon(this,true,this.game.projectiles,16,6,4);
		this.health = 5;

		
		this.damageImmunityTimer = 1000;
		this.lastDamage = 0;

		this.dashTimer = 600;
		this.dashLength = 15;
		this.lastDash = 0;
		this.dashY = 0;
		this.dashX = 0;

	}
	update(keys){
		
		//currently dashing?
		if(this.dashY || this.dashX){
			let dashSpeed = this.speed*3;
			if(this.dashY > 0) {
				if(this.dashX > 0){
					this.y += Math.floor(dashSpeed/1.4);
					this.dashY--;
					this.x += Math.floor(dashSpeed/1.4);
					this.dashX--;
				}else if(this.dashX < 0){
					this.y += Math.floor(dashSpeed/1.4);
					this.dashY--;
					this.x -= Math.floor(dashSpeed/1.4);
					this.dashX++;
				}else{
					this.y +=dashSpeed;
					this.dashY--;
				}
			}
			else if(this.dashY < 0) {
				if(this.dashX > 0){
					this.y -= Math.floor(dashSpeed/1.4);
					this.dashY++
					this.x += Math.floor(dashSpeed/1.4);
					this.dashX--;
				}else if(this.dashX < 0){
					this.y -= Math.floor(dashSpeed/1.4);
					this.dashY++;
					this.x -= Math.floor(dashSpeed/1.4);
					this.dashX++;
				}else{
					this.y -=dashSpeed;
					this.dashY++;
				}
			}
			else if(this.dashX > 0){
				this.x +=dashSpeed;
				this.dashX--;
			}
			else if(this.dashX < 0){
				this.x -=dashSpeed;
				this.dashX++;
			}
		}
		//not dashing? move with wasd then
		else{
			//handling direction inputs
			if(keys.has('w')) this.dy--;
			if(keys.has('s')) this.dy++;
			if(keys.has('a')) this.dx--;
			if(keys.has('d')) this.dx++;
			if(keys.has(' ')) this.dash(keys);

			//correcting for diagonal movement
			if(this.dx != 0 &&this.dy != 0){
					this.dx /=1.414;
					this.dy /=1.414;
			}
			
			//move
			this.prevX = this.x;
			this.prevY = this.y;
			this.x += this.dx*this.speed;
			this.y += this.dy*this.speed;

			//friction
			if(this.dx >= 2) this.dx-=2;
			else if(this.dx >= 1) this.dx--;
			else if(this.dx <= -2) this.dx +=2;
			else if(this.dx <= -1) this.dx++;
			else this.dx = 0;

			if(this.dy >= 2) this.dy -= 2;
			else if(this.dy >= 1) this.dy--;
			else if(this.dy <= -2) this.dy +=2;
			else if(this.dy <= -1) this.dy++;
			else this.dy = 0;
		}

		//handling boundaries
		keepInBounds(this);
		

		//handling enemies
		//maybe make enemies handle this?
		let enemies = this.game.enemies.enemies;
		for(let i = 0; i < enemies.length; i++){
				let enemy = enemies[i];

				if(isColliding(this,enemy)){
						//seperate handling for horizontal, verticle, and corner edge collisions
						if(this.prevY + this.height >= enemy.y && this.prevY <= enemy.y + enemy.height){
								
								if(this.prevX >= enemy.x + enemy.width){
										this.x = enemy.x + enemy.width;
								} 
								else if(this.prevX + this.width <= enemy.x ){
										this.x = enemy.x -this.width;
								} 
								enemy.dx = (this.dx /=3);
								enemy.dy = (enemy.y - this.y)/(enemy.height*2);

						}
						else if(this.prevX + this.width >= enemy.x && this.prevX <= enemy.x + enemy.width){
								if(this.prevY >= enemy.y + enemy.height){
										this.y = enemy.y + enemy.height;
								}
								else if(this.prevY +this.height <= enemy.y){
										this.y = enemy.y -this.height;
								}
								enemy.dy = (this.dy/=3);
								enemy.dx = (enemy.x - this.x)/(enemy.height*2);
						}
						else{
								this.y =this.prevY;
								this.x = this.prevX;
								enemy.dx = this.dx/=2;
								enemy.dy = this.dy/=3;
						}
				}
		}


	
		this.weapon.update(this.game);
	}


	draw(context){
		if(this.dashX || this.dashY){

		}else this.weapon.draw(context);
			
			if(Date.now() - this.lastDamage > this.damageImmunityTimer) context.fillStyle = 'green';
			else context.fillStyle = 'red';
			context.fillRect(this.x,this.y,this.width,this.height);


	}

	attack(targetX,targetY){
			this.weapon.attack(targetX,targetY);
	}

	takeDamage(){
			const now = Date.now();
			if(now - this.lastDamage > this.damageImmunityTimer){
					this.lastDamage = now;
					this.health--;
			}
	}
	dash(keys){
			if(Date.now() - this.lastDash > this.dashTimer){
					this.lastDash = Date.now();
					if(keys.has('w')) this.dashY--;
					if(keys.has('s')) this.dashY++;
					if(keys.has('a')) this.dashX--;
					if(keys.has('d')) this.dashX++;
					
					this.dashX*=this.dashLength;
					this.dashY*=this.dashLength;
			}

	}
	teleport(){

	}
	barrelRoll(){

	}
}