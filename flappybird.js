let myAudio = new Audio();
myAudio.src = 'birdsong.mp3';
let end=new Audio();
end.src='end.mp3';


//board
let board;
let boardwidth=360;
let boardHeight=640;
let context;

//bird

let birdWidth=34;
let birdHeight=24;// width/height ratio= 408/228=17/12
let birdX=boardwidth/8;
let birdY=boardHeight/2;
let birdImag;

// object
let bird={
    x:birdX,
    y:birdY,
    width: birdWidth,
    height:birdHeight

}

let gameOver=false;
let score=0;
//pipes
let pipeArray=[];
let pipeWidth=64;
let pipeHeight=512;
let pipeX=boardwidth;
let pipeY=0;

let topPipeImag;
let bottomPipeImag;

//game physics
let velocityX=-2;//moving pipe left
let velocityY=0;//jump speed
let gravity=0.3   ;


window.onload=function()
{
    board=document.getElementById("board");
    board.height=boardHeight;
    board.width=boardwidth;
    context=board.getContext('2d');//used for drawing on the board

    //loding bird
    //context.fillStyle='green';
    //context.fillRect(bird.x,bird.y,birdWidth,birdHeight);
    birdImag=new Image();
    birdImag.src='./flappybird.png';
    birdImag.onload=function(){
    
        context.drawImage(birdImag,bird.x,bird.y,birdWidth,birdHeight);
    
    }

topPipeImag=new Image();
  topPipeImag.src='./toppipe.png';
  bottomPipeImag=new Image();
  bottomPipeImag.src='./bottompipe.png';
    requestAnimationFrame(update);
    setInterval(placePipes,1500);//1.5sec
    document.addEventListener("keyup",moveBird);
}

function update(){
    if(gameOver)
    {  myAudio.pause();
        return;
    }
    requestAnimationFrame(update);
context.clearRect(0,0,board.width,board.height);
//bird
myAudio.play();
velocityY+=gravity;
bird.y= Math.max(bird.y+velocityY,0);
context.drawImage(birdImag,bird.x,bird.y,birdWidth,birdHeight);
if(bird.y>board.height)
{
    gameOver=true;  
    end. play();
}
//pipes
for(let i=0;i<pipeArray.length;i++)
{
    let pipe=pipeArray[i];
    pipe.x+=velocityX;
    context.drawImage(pipe.img, pipe.x,pipe.y,pipe.width,pipe.height);
    if(!pipe.passed&&bird.x>pipe.x+pipe.width)
    {
        score+=1;
        pipe.passed=true;
    }
    if(detectCollison(bird,pipe))
    {
        gameOver=true;
        myAudio.pause();
        end.play();
        
    }
}
context.fillStyle='white';
context.font='20px sans-serif';
context.fillText("Score:"+ score/2 ,5,40); 
  
}

function placePipes(){
    if(gameOver)
    {
        return;
    }
    let randomPipeY=pipeY-pipeHeight/4-Math.random()*(pipeHeight/2);
    let openingSpace=board.height/4;
let topPipe={
    img:topPipeImag,
    x:pipeX,
    y:randomPipeY,
    height:pipeHeight,
    width:pipeWidth,
    passed:false
} 
let bottomPipe={
    img:bottomPipeImag,
    x:pipeX,
    y:randomPipeY+pipeHeight+openingSpace,
    height:pipeHeight,
    width:pipeWidth,
    passed:false
} 

pipeArray.push(topPipe);
pipeArray.push(bottomPipe);
}


function moveBird(e)
{
    if(e.code=="Space"||e.code=="ArrowUp")
    {
        //jump
        velocityY=-6; 
    }
   if(gameOver)
   {
    bird.y=birdY;
    pipeArray=[];
    score=0;
    gameOver=false; 
    myAudio.pause();
        myAudio.currentTime=0;
       end.pause();
       end.currentTime=0;
      update();
   }
} 

function detectCollison(a,b)
{   
    return a.x<b.x+b.width&&
           a.x+a.width>b.x&&
           a.y<b.y+b.height&&
           a.y + a.height>b.y;
}

//clear pipes
while(pipeArray.length>0&&pipeArray[0].x<-pipeWidth )
{
    pipeArray.shift();
}