import * as utils from './utils.js';

document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid');
    const doodlerWidth = 60;
    const doodlerHeight = 85;
    const platformWidth = 85;
    const platformHeight = 15;
    const timeInterval = 30;

    let startPoint = 150;
    let score = 0;
    let doodler;
    let isGameOver = false;
    let platformCount = 5;
    let platforms = [];
    let upTimerId;
    let platformTimerId;
    let downTimerId;
    let leftTimerId;
    let rightTimerId;
    let isJumping = false;
    let isGoingLeft = false;
    let isGoingRight = false;


    function createDoodler(){
        doodler = new Doodler(platforms[0].left,startPoint,doodlerWidth,doodlerHeight,grid);
    }

    class Doodler {
        constructor(left, bottom,width,height, parent){
            this.left = left;
            this.bottom = bottom;
            this.width = width;
            this.height = height;
            this.right = left + width;
            this.upper = bottom +  height;
            this.createVisual();
            this.updateVisual();
            parent.appendChild(this.visual);
        }

        createVisual(){
            this.visual = document.createElement('div');
            this.visual.classList.add('doodler');
            this.visual.style.width = this.width + 'px';
            this.visual.style.height = this.height + 'px';
        }

        updateVisual(){
            this.visual.style.left = this.left + 'px';
            this.visual.style.bottom = this.bottom + 'px';
        }

        move(leftSpace,bottomSpace) {
            this.left += leftSpace;
            this.right += leftSpace;
            this.bottom += bottomSpace;
            this.upper += bottomSpace;
            this.updateVisual();
        }
    }

    class Platform {
        constructor(bottom,width,height,parent) {
            this.bottom = bottom;
            this.left = Math.round(Math.random()*315);
            this.width = width;
            this.height = height;
            this.right = this.left + this.width;
            this.upper = this.bottom + this.height;
            this.createVisual();
            this.updateVisual();
            parent.appendChild(this.visual);
        }

        createVisual() {
            this.visual = document.createElement('div');
            this.visual.classList.add('platform');
            this.visual.style.width = this.width + 'px';
            this.visual.style.height = this.height + 'px';
        }

        updateVisual() {
            this.visual.style.bottom = this.bottom + 'px';
            this.visual.style.left = this.left + 'px';
        }

        move(bottomSpace){
            this.bottom += bottomSpace;
            this.upper += bottomSpace;
            this.updateVisual();
        }

    }

    function createPlatforms() {
        for (let i = 0; i < platformCount; i++) {
            let platGap = 600 / platformCount;
            let newPlatBottom = 100 + i*platGap;
            let newPlatform = new Platform(newPlatBottom,platformWidth,platformHeight,grid);   
            platforms.push(newPlatform);   
        }
    }

    function movePlatforms(){
        platformTimerId = setInterval(function(){
            platforms.forEach(platform => {
                platform.move(-4);
                if(platform.bottom < 0){
                    platform.bottom = 600 - platform.height;
                    platform.upper = 600;
                    platform.left = Math.round(Math.random()*315);
                    platform.right = platform.left + platform.width;
                    platform.updateVisual();
                    score += 1;
                }
            });
        },timeInterval);
    }

    function jump() {
        isJumping = true;
        clearInterval(downTimerId);
        upTimerId = setInterval(function () {
            doodler.move(0,20);
            if (doodler.bottom > startPoint + 200) {
                fall();
            }
        },timeInterval);
    }

    function fall() {
        clearInterval(upTimerId);
        isJumping = false;
        downTimerId = setInterval(function () {
            doodler.move(0,-5);
            if (doodler.bottom <= 0) {
                gameOver();
            }
            if(checkFallCollision()){
                console.log("landed");
                startPoint = doodler.bottom;
                jump();
            }
        }, timeInterval);
    }

    function checkFallCollision(){
        let isCollision = false;
        platforms.forEach((platform)=>{
            if(
                (
                    utils.between(doodler.bottom,platform.bottom,platform.upper)
                )&&
                (
                    (utils.between(doodler.left,platform.left,platform.right))||
                    (utils.between(doodler.right,platform.left,platform.right))
                )
            )
            {
                isCollision = true;
            }
        });
        return isCollision;
    }

    function gameOver(){
        clearInterval(upTimerId);
        clearInterval(downTimerId);
        clearInterval(leftTimerId);
        clearInterval(rightTimerId);
        clearInterval(platformTimerId);
        isGameOver = true;
        console.log("Game over!");
        console.log(score);
    }

    function control(e) {
        if (e.key == "ArrowLeft") {
            if (!isGoingLeft) {
                moveLeft();
            }
        } else if (e.key == "ArrowRight"){
            if(!isGoingRight){
                moveRight();
            }
        } else {
            moveStraight();
        }
    }

    function moveStraight(){
        isGoingRight = false;
        isGoingLeft = false;
        clearInterval(rightTimerId);
        clearInterval(leftTimerId);
    }

    function moveLeft(){
        isGoingLeft = true;
        isGoingRight = false;
        clearInterval(rightTimerId);
        leftTimerId = setInterval(function() {
            if (doodler.left > 0 ) {
                doodler.move(-5,0);
            } else {
                moveRight();
            }
        },timeInterval);
    }

    function moveRight() {
        isGoingLeft = false;
        isGoingRight = true;
        clearInterval(leftTimerId);
        rightTimerId = setInterval(function() {
            if (doodler.right < 400){
                doodler.move(+5,0);
            }else {
                moveLeft();
            }
        },timeInterval);
    }

    function showKey(e) {
        console.log(e.key);
    }

    function start(){
        if (!isGameOver) {
            createPlatforms();
            createDoodler();
            movePlatforms();
            jump();
            document.addEventListener("keyup",control);
        }
    }

    start();

});