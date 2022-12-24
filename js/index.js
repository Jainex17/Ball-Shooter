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

//shooting bullet
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

class Enemy {
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

const player = new Player(canvas.width/2,canvas.height/2,40,'blue');
let projectiles = [];
let enimies = [];

function spawnenemies(){
    setInterval(()=>{
        const radius = Math.random() * (40 - 20) + 20;
        let x;
        let y;
        
        if(Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }else{
            x = Math.random() * canvas.width;    
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        
        const color = "yellow";
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );
    
        const valocity = {x:Math.cos(angle),y:Math.sin(angle)}
        enimies.push(new Enemy(x,y,radius,color,valocity))
    },1000);
}

// refrese page every frame
let animationID
function animation(){
    animationID = requestAnimationFrame(animation);
    c.clearRect(0,0,canvas.width,canvas.height)
    player.draw();
    projectiles.forEach(projectile=>{
        projectile.update();
    })
    enimies.forEach((enemy,eindex)=>{
        enemy.update();

        const playerdist = Math.hypot(player.x - enemy.x , player.y - enemy.y);
        // enemy touch player
        if(playerdist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationID);
            // setTimeout(()=>{
            //     enimies.splice(eindex,1);    
            // },0);
        }

        projectiles.forEach((projectile,pindex)=>{
            const dist = Math.hypot(projectile.x - enemy.x , projectile.y - enemy.y);
            // object touch 
            if(dist - enemy.radius - projectile.radius < 1){
                setTimeout(()=>{
                    enimies.splice(eindex,1);
                    projectiles.splice(pindex,1);    
                },0);
            }
        })
    })
}
    
window.addEventListener("click",(e)=>{
    const angle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
    );

    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,10,'red',{x:Math.cos(angle),y:Math.sin(angle)}))
})


animation();    
spawnenemies();