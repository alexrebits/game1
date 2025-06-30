
//answers the question: are these two objects colliding?
//REQUIRES: first and second have x, y, width, height. x and y are the top left pixel of the sprite
export function isColliding(first,second){
return first.x + first.width > second.x && first.x < second.x + second.width && first.y + first.height > second.y && first.y < second.y + second.height
}

//places the entity correctly in bounds if they are out of bounds
//REQUIRES: entity has x, y, width, height
export function keepInBounds(entity){
  const bounds = document.getElementById('game');
  	if(entity.y < 0) entity.y = 0;
		else if(entity.y > bounds.height - entity.height) entity.y = bounds.height - entity.height;
		if(entity.x <0) entity.x = 0;
		else if(entity.x > bounds.width - entity.width) entity.x = bounds.width - entity.width;
}