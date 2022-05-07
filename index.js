const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

class Sprite {
	constructor({position, velocity}){ //Wrap position and velocity for easier to call/track
		this.position = position
		this.velocity = velocity
		this.height = 150
	}
	//Characters
	draw() { 
		c.fillStyle = 'red'
		c.fillRect(this.position.x, this.position.y, 50, this.height) //Width & Height player
	}
	//Moving Characters
	update(){
		this.draw()

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		//So that the player won't move outside the canvas
		if (this.position.y + this.height + this.velocity.y >= canvas.height){
			this.velocity.y = 0
		} else {
			this.velocity.y += gravity
		}
	}
}

const player = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	velocity: {
		x: 0,
		y: 0
	}
})

const enemy = new Sprite({
	position: {
		x: 400,
		y: 100
	},
	velocity: {
		x: 0,
		y: 0
	}
})


console.log(player)

//For accurate key responses
const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	}
}
let lastKey

function animate() {
	// console.log('go')//Check if the gravity animate is infinite
	window.requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0, 0, canvas.width, canvas.height)
	player.update()
	enemy.update()

	player.velocity.x = 0
	if (keys.a.pressed && lastKey === 'a'){
		player.velocity.x = -1
	} else if (keys.d.pressed && lastKey ==='d') {
		player.velocity.x = 1
	}
}

animate() 

//If "button" press is HOLD
window.addEventListener('keydown', (event) => {
	switch (event.key){
		case 'd':
			keys.d.pressed = true
			lastKey = 'd'
			break
		case 'a':
			keys.a.pressed = true
			lastKey = 'a'
			break
	}
	console.log(event.key)
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
	}
	console.log(event.key)
})

//40:00