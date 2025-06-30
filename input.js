export class InputHandler{
    constructor(game,canvas){
        this.canvas = canvas;
        this.canvasRect = canvas.getBoundingClientRect();
        this.mouse = {
            x: 0,
            y: 0
        }
        this.keys = new Set([]);
        this.projectiles = game.projectiles;
        this.player = game.player;
        window.addEventListener("keydown", (event) =>{
            switch(event.key){
                case 'w':
                    this.keys.add(event.key);
                    break;
                case 's':
                    this.keys.add(event.key);
                    break;
                case 'a':
                    this.keys.add(event.key);
                    break;
                case 'd':
                    this.keys.add(event.key);
                    break;
                case ' ':
                    this.keys.add(event.key);
                    break;
            }
            
        });
        window.addEventListener("keyup", (event) =>{
            switch(event.key){
            case 'w':
                this.keys.delete(event.key);
                break;
            case 's':
                this.keys.delete(event.key);
                break;
            case 'a':
                this.keys.delete(event.key);
                break;
            case 'd':
                this.keys.delete(event.key);
                break;
            case ' ':
                this.keys.delete(event.key);
                break;
            }

        });
        document.addEventListener('mousemove',(event)=>{     
            this.mouse.x = event.clientX - this.canvasRect.left;
            this.mouse.y = event.clientY - this.canvasRect.top - 0.5;
        });

        window.addEventListener('resize', () =>{
            this.canvasRect = canvas.getBoundingClientRect();
        });
        document.addEventListener('click',()=>{
            game.player.attack(this.mouse.x,this.mouse.y);
        });

        



    }
}