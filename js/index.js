const canvas = document.querySelector("canvas");
const c = canvas.getContext('2d');
const scoreel = document.getElementById("score");
const endscore = document.getElementById("endscore");
const menu = document.querySelector('.menu');
const startbtn = document.getElementById('startbtn');
let score = 0;
// scoreel.innerHTML = parseInt(score)

//music
// let backgroundmusic1 = new Audio('../music/Glory-Eternal.mp3');
let backgroundmusic = new Audio('../music/Powerful-Trap-.mp3');
let firesound = new Audio('../music/fire-magic-6947.mp3');

canvas.width= innerWidth ;
canvas.height= innerHeight;

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
const faction = 0.98;
class Partical {
    constructor(x,y,radius,color,valocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.valocity = valocity;
        this.alpha = 1
    }
    draw(){
        c.save();
        c.globalAlpha = this.alpha;
        c.beginPath();
        c.arc(this.x,this.y,this.radius, Math.PI * 2,false);
        c.fillStyle = this.color;
        c.fill();
        c.restore();
    }
    update(){
        this.draw();
        this.valocity.x *= faction;
        this.valocity.y *= faction;
        this.x = this.x + this.valocity.x;
        this.y = this.y + this.valocity.y; 
        this.alpha -= 0.01;
    }
}

let player = new Player(canvas.width/2,canvas.height/2,40,'white');
let projectiles = [];
let enimies = [];
let particals = [];

function init(){
    player = new Player(canvas.width/2,canvas.height/2,40,'white');
    projectiles = [];
    enimies = [];
    particals = [];
    score = 0;
}

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
        
        const color = `hsl(${Math.random()*360},50%,50%)`;
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x
        );
    
        const valocity = {x:Math.cos(angle),y:Math.sin(angle)}
        enimies.push(new Enemy(x,y,radius,color,valocity))
    },1200);
}

// refrese page every frame
let animationID
function animation(){
    
    animationID = requestAnimationFrame(animation);
    c.fillStyle = "rgb(0,0,0,0.1)";
    c.fillRect(0,0,canvas.width,canvas.height)
    player.draw();

    particals.forEach((partical,parindex)=>{
        if(partical.alpha <= 0){
            particals.splice(parindex,1)
        }else{
            partical.update();
        }
    })
    projectiles.forEach((projectile,pindex)=>{
        projectile.update();

        if(projectile.x + projectile.radius < 0 || 
           projectile.x - projectile.radius > canvas.width ||
           projectile.y + projectile.radius <0 ||
           projectile.y - projectile.radius > canvas.height){
            setTimeout(()=>{
                projectiles.splice(pindex,1);    
            },0);
        }
    })
    enimies.forEach((enemy,eindex)=>{
        enemy.update();

        const playerdist = Math.hypot(player.x - enemy.x , player.y - enemy.y);
        // enemy touch player
        //end game
        if(playerdist - enemy.radius - player.radius < 1){
            backgroundmusic.pause();
            endscore.innerHTML = score;
            scoreel.innerHTML = 0;
            cancelAnimationFrame(animationID);
            menu.style.display = 'flex';
        }

        projectiles.forEach((projectile,pindex)=>{
            const dist = Math.hypot(projectile.x - enemy.x , projectile.y - enemy.y);
            // projectile touch enemy
            if(dist - enemy.radius - projectile.radius < 1){
                
                //create particals
                for (let i = 0; i < 8; i++) {
                    particals.push(new Partical(projectile.x,
                        projectile.y,
                        Math.random() * 5,
                        enemy.color,
                        {
                            x:Math.random() - 0.5 * (Math.random() * 6),
                            y:Math.random() - 0.5 * (Math.random() * 6)
                        }))
                }
                if(enemy.radius - 20  > 5){
                    score += 100;
                    scoreel.innerHTML = score
                    gsap.to(enemy,{
                        radius: enemy.radius - 10
                    })

                    setTimeout(()=>{
                        projectiles.splice(pindex,1);    
                    },0);
                }//remove from enemy from scene
                else{       
                    score += 250;
                    scoreel.innerHTML = score
                    setTimeout(()=>{
                        enimies.splice(eindex,1);
                        projectiles.splice(pindex,1);    
                    },0);
            }
            }
        })
    })
    
}
    
window.addEventListener("click",(e)=>{
    firesound.play();
    const angle = Math.atan2(
        e.clientY - canvas.height / 2,
        e.clientX - canvas.width / 2
        );
    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,10,'white',{x:Math.cos(angle) * 5,y:Math.sin(angle) * 5}))
    
})
startbtn.addEventListener("click",()=>{
    backgroundmusic.play();
    init();
    animation();    
    spawnenemies();
    menu.style.display = 'none';
})
