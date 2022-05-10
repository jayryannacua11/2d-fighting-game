class Sprite {
	constructor({position, imageSrc, scale = 1, framesMax = 1}){ 
		this.position = position
		this.width = 50
		this.height = 150
		this.image = new Image()
		this.image.src = imageSrc
		this.scale = scale
		this.framesMax = framesMax
		this.framesCurrent = 0
		this.framesElapsed = 0
		this.framesHold = 15
	}
	
	draw() { 
		//Crop the shop image. 6 is the value of number of actual shop picture inside the image to make an animation
		c.drawImage(
			this.image,
			this.framesCurrent * (this.image.width/this.framesMax),
			0,
			this.image.width/this.framesMax, 
			this.image.height,
			this.position.x, 
			this.position.y,
			(this.image.width/this.framesMax) * this.scale, 
			this.image.height * this.scale)
	}
	update(){
		this.draw()
		//Shop animation
		this.framesElapsed++

		if (this.framesElapsed % this.framesHold === 0){
			if(this.framesCurrent < this.framesMax -1){
				this.framesCurrent++

			} else {
				this.framesCurrent = 0

			}
		}	
	}
}

class Fighter {
	constructor({position, velocity, color = 'red', offset}){ //Wrap position and velocity for easier to call/track
		this.position = position
		this.velocity = velocity
		this.width = 50
		this.height = 150
		this.lastKey
		this.attackBox = {
			position: {
				x: this.position.x,
				y: this.position.y
			},
			offset: offset,
			width: 100,
			height: 50,
		}
		this.color = color
		this.isAttacking
		this.health = 100
	}
	
	draw() { 
		//Characters
		c.fillStyle = this.color
		c.fillRect(this.position.x, this.position.y, this.width, this.height) //Width & Height player
		
		//Attack box
		if (this.isAttacking){
			c.fillStyle = 'green'
			c.fillRect(
			this.attackBox.position.x,
			this.attackBox.position.y, 
			this.attackBox.width, 
			this.attackBox.height
			)
		}
	}
	//Moving Characters
	update(){
		this.draw()
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x
		this.attackBox.position.y = this.position.y

		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		//So that the player won't move outside the canvas
		if (this.position.y + this.height + this.velocity.y >= canvas.height - 96){
			this.velocity.y = 0
		} else {
			this.velocity.y += gravity
		}
	}

	attack() {
		this.isAttacking = true
		setTimeout(() => {
			this.isAttacking = false 
		}, 100)
	}
}