const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');

canvas.width= innerWidth - 2;
canvas.height= innerHeight - 5;

//player circle
class Player {
    constructor(x,y,radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius, Math.PI * 2,false);
        c.fillStyle = this.color;
        c.fill();
    }
}

//shooting bullate
class Projectile {
    constructor(x,y,radius,color,valocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.valocity = valocity;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radius, Math.PI * 2,false);
        c.fillStyle = this.color;
        c.fill();
    }
    update(){
        this.draw();
        this.x = this.x + this.valocity.x;
        this.y = this.y + this.valocity.y; 
    }
}

const player = new Player(canvas.width/2,canvas.height/2,50,'blue');
let projectiles = [];

// refrese page every frame
function animation(){
    requestAnimationFrame(animation);
    c.clearRect(0,0,canvas.width,canvas.height)
    player.draw();
    projectiles.forEach(projectile=>{
        projectile.update();
    })
}
animation();    

    
window.addEventListener("click",(e)=>{
    const angle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    );

    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,10,'red',{x:Math.cos(angle),y:Math.sin(angle)}))
})
