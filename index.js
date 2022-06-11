const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
//canvas.height = 576
canvas.height = 535

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	imageSrc: './img/background1.png'
})

const shop = new Sprite({
	position: {
		//x: 600,
		//y: 127
		x: 400,
		y: 150
	},
	imageSrc: './img/shop.png',
	scale: 2.75,
	//6 is the value of number of actual shop picture inside the image to make an animation
	framesMax: 6
})

const eye = new Sprite({
	position: {
		x: 180,
		y: -30
	},
	imageSrc: './img/flyingEye.png',
	scale: 2,
	framesMax: 8
})
const kid = new Sprite({
	position: {
		x: 222,
		y: 410
	},
	imageSrc: './img/deadKid.png',
	scale: 2.5
})

const player = new Fighter({
	position: {
		x: 120,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	},
	offset: {
		x:0,
		y:0
	},
	imageSrc: './img/King/Idle.png',
	framesMax: 8,
	scale: 2.6,
	offset: {
		x: 215,
		//y: 122
		y: 60
	},
	sprites: {
		idle: {
			imageSrc: './img/King/Idle.png',
			framesMax: 8
		},
		run: {
			imageSrc: './img/King/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/King/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/King/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/King/Attack1.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/King/Take Hit - white silhouette.png',
			framesMax: 4
		},
		death: {
			imageSrc: './img/King/Death.png',
			framesMax: 6
		}
	},
	attackBox: {
		offset: {
			x: 50,
			y: 50
		},
		width: 120, 
		height: 50
	}
})

const enemy = new Fighter({
	position: {
		x: 800,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	},
	color: 'blue',
	offset: {
		x: -50,
		y: 0
	},
	imageSrc: './img/kenji/Idle.png',
	framesMax: 4,
	scale: 2.5,
	offset: {
		x: 215,
		//y: 172
		y: 110
	},
	sprites: {
		idle: {
			imageSrc: './img/kenji/Idle.png',
			framesMax: 4
		},
		run: {
			imageSrc: './img/kenji/Run.png',
			framesMax: 8
		},
		jump: {
			imageSrc: './img/kenji/Jump.png',
			framesMax: 2
		},
		fall: {
			imageSrc: './img/kenji/Fall.png',
			framesMax: 2
		},
		attack1: {
			imageSrc: './img/kenji/Attack2.png',
			framesMax: 4
		},
		takeHit: {
			imageSrc: './img/kenji/Take hit.png',
			framesMax: 3
		},
		death: {
			imageSrc: './img/kenji/Death.png',
			framesMax: 7
		}

	},
	attackBox: {
		offset: {
			x: -155,
			y: 50
		},
		width: 120,
		height: 50
	},

})


console.log(player)

//For accurate key responses
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	ArrowRight: {
		pressed: false
	},
	ArrowLeft: {
		pressed: false
	}
}

decreaseTimer()

function animate() {
	// console.log('go')//Check if the gravity animate is infinite
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	background.update()
	shop.update()
	eye.update()
	kid.update()
	c.fillStyle = 'rgba(255, 255, 255, 0.05)'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x = 0
	enemy.velocity.x = 0

	//main player movement
	
//Running
	if (player.health > 0) { 
		if (keys.a.pressed && player.lastKey === 'a' && player.position.x > 5){
			player.velocity.x = -5
			player.switchSprite('run')
		} else if (keys.d.pressed && player.lastKey ==='d' && player.position.x < 1000) {
			player.velocity.x = 5
			player.switchSprite('run')
		}else{
			//player.image = player.sprites.idle.image -> To switch case
			player.switchSprite('idle')
		}
	}else {
		player.switchSprite('death')
	}



//Jumping
	if (player.velocity.y < 0){
		player.switchSprite('jump')
	} else if(player.velocity.y > 0){
		player.switchSprite('fall')
	}

//enemy movement 
	//Running
	if (enemy.health > 0) { 
		if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft' && enemy.position.x > 0){
			enemy.velocity.x = -5
			enemy.switchSprite('run')
		} else if (keys.ArrowRight.pressed && enemy.lastKey ==='ArrowRight' && enemy.position.x < 980) {
			enemy.velocity.x = 5
			enemy.switchSprite('run')
		} else{
			enemy.switchSprite('idle')
		}
	}else {
		enemy.switchSprite('death')
	}

	//Jumping
	if (enemy.velocity.y < 0){
		enemy.switchSprite('jump')
	} else if(enemy.velocity.y > 0){
		enemy.switchSprite('fall')
	}

//Detect for collision
	//If player2 gets hit
	if (rectangularCollision({rectangle1: player, rectangle2: enemy})
		&& player.isAttacking && player.framesCurrent === 2){
		enemy.takeDamage()
		player.isAttacking = false
		gsap.to('#enemyHealth', {
			width: enemy.health + '%'
		})
	}

	//If player1 gets hit
	if (rectangularCollision({rectangle1: enemy, rectangle2: player})
		&& enemy.isAttacking && enemy.framesCurrent === 2){
		player.takeDamage()
		enemy.isAttacking = false 
		gsap.to('#playerHealth', {
			width: player.health + '%'
		})
	}

	//If misses
	if(player.isAttacking && player.framesCurrent === 2){
		player.isAttacking = false
	}
	if(enemy.isAttacking && enemy.framesCurrent === 2){
		enemy.isAttacking = false
	}

	if(enemy.isAttacking && enemy.health === 0){
		enemy.switchSprite('death')
	}

//End game based on health
	if (enemy.health <= 0 || player.health <= 0){
		determineWinner({player, enemy, timerId})
	}
}

animate() 

document.querySelector('.restart-btn').addEventListener('click', function(){
  window.location.reload();
  return false;
});
//If "button" press is HOLD
window.addEventListener('keydown', (event) => {
	//To show what key are you pressing
	//console.log(event.key) 
	switch (event.key){
		case 'y':
			window.location.reload();
			break;
		case 'Y':
			window.location.reload();
			break;
	}
	if(!player.dead && timer > 0){
		switch (event.key){
			case 'd':
				keys.d.pressed = true
				player.lastKey = 'd'
				break
			case 'a':
				keys.a.pressed = true
				player.lastKey = 'a'
				break
			case 'D':
				keys.d.pressed = true
				player.lastKey = 'd'
				break
			case 'A':
				keys.a.pressed = true
				player.lastKey = 'a'
				break
			case 'Shift':
				player.attack()
				break
		}
	}
	if(!enemy.dead && timer > 0){
		switch(event.key){
			case 'ArrowRight':
				keys.ArrowRight.pressed = true
				enemy.lastKey = 'ArrowRight'
				break
			case 'ArrowLeft':
				keys.ArrowLeft.pressed = true
				enemy.lastKey = 'ArrowLeft'
				break
			case 'ArrowDown':
				//enemy.isAttacking = true
				enemy.attack()
				break
		}
	}
	if(!player.dead && player.velocity.y === 0 && timer > 0){
		switch (event.key){	
			case 'w':
				player.velocity.y = -18	
				break
			case 'W':
				player.velocity.y = -18	
				break
		}
	}
	if(!enemy.dead && enemy.velocity.y === 0 && timer > 0){
		switch (event.key){	
			case 'ArrowUp':
				enemy.velocity.y = -18	
				break
		}
	}
})

//When you release the clicked button
window.addEventListener('keyup', (event) => {
	switch (event.key){
		case 'd':
			keys.d.pressed = false
			break
		case 'a':
			keys.a.pressed = false
			break
		case 'D':
			keys.d.pressed = false
			break
		case 'A':
			keys.a.pressed = false
			break
	}

	//enemy case
	switch (event.key){
		case 'ArrowRight':
			keys.ArrowRight.pressed = false
			break
		case 'ArrowLeft':
			keys.ArrowLeft.pressed = false
			break
	}
	
})

