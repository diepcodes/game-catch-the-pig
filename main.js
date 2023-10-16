
const sizes = {
    width: 500,
    height: 500
}

const speedDown = 400

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartBtn = document.querySelector("#gameStartBtn")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gameEndScoreSpan = document.querySelector("#gameEndScoreSpan")

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game")
        this.player
        this.cursor
        this.playerSpeed = speedDown +50
        //this.target
        this.targetPoop
        this.points = 0
        this.textScore
        this.textTime
        this.timedEvent
        this.remainingTime
        this.pigSound
        this.farmSound
        this.oops

    }

    preload(){
        this.load.image("bg", "assets/bg.png")
        this.load.image("cart", "assets/cart.png")
        this.load.image("pig", "assets/pig.png")
        this.load.image("poop", "assets/poop.png")
        this.load.audio("pigsound", "audios/pigsound.mp3")
        this.load.audio("farmsound", "audios/farmsound.mp3")
        this.load.audio("oops", "audios/oops.mp3")

    }
    create(){

        this.scene.pause("game-scene")

        this.pigSound = this.sound.add("pigsound", {volume: 0.2})
        this.oops = this.sound.add("oops", {volume: 0.2})
        this.farmSound = this.sound.add("farmsound", {volume: 0.01})
        this.farmSound.play()

        this.add.image(0,0,"bg").setOrigin(0,0)
        this.player = this.physics.add.image(0,sizes.height-100,"cart").setOrigin(0,0)
        this.player.setImmovable(true)
        this.player.body.allowGravity = false
        
        //Set hit sizes
        this.player.setSize(this.player.width - this.player.width/4, this.player.height-this.player.height/4).setOffset(this.player.width/10, this.player.width/8)

        this.target = this.physics.add.image(sizes.width-30,sizes.height-5,"pig").setOrigin(0,0)
        this.target.setMaxVelocity(0, speedDown)

        this.targetPoop = this.physics.add.image(sizes.width-45,sizes.height-5,"poop").setOrigin(0,0)
        this.targetPoop.setMaxVelocity(0, speedDown)


        this.physics.add.overlap(this.target, this.player, this.targetHit, null, this)

        this.physics.add.overlap(this.targetPoop, this.player, this.targetHitPoop, null, this)

        this.cursor = this.input.keyboard.createCursorKeys()

        this.textScore = this.add.text(sizes.width - 490, 10, "Pigs: 0", {
            font: "26px Helvetica",
            fill: "#000000"
        })

        this.textTime = this.add.text(sizes.width - 125, 10, "Time: 0s", {
            font: "26px Helvetica",
            fill: "#000000"
        })

        this.timedEvent = this.time.delayedCall(45000, this.gameOver, [], this)

    }


    update() {
        this.remainingTime = this.timedEvent.getRemainingSeconds()
        this.textTime.setText(`Time: ${Math.round(this.remainingTime).toString()}s`)


        if (this.target.y >= sizes.height) {
            this.target.setY(0)
            this.target.setX(this.getRandomX())
        }

        if (this.targetPoop.y >= sizes.height) {
            this.targetPoop.setY(0)
            this.targetPoop.setX(this.getRandomXX())
        }

        const {left, right} = this.cursor;

        if (left.isDown) {
            this.player.setVelocityX(-this.playerSpeed)
        } else if (right.isDown) {
            this.player.setVelocityX(this.playerSpeed)
        } else {
            this.player.setVelocityX(0)
        }

    }

    getRandomX() {
        return Math.floor(Math.random()*480)
    }

    getRandomXX() {
        return Math.floor(Math.random()*900)
    }

    targetHit() {
        this.pigSound.play()
        this.target.setY(0)
        this.target.setX(this.getRandomX())
        this.points++
        this.textScore.setText(`Pigs: ${this.points}`)
    }


    targetHitPoop() {
        this.oops.play()
        this.targetPoop.setY(0)
        this.targetPoop.setX(this.getRandomXX())
        this.gameOver()
    }

    gameOver() {
        this.sys.game.destroy(true)
        gameEndScoreSpan.textContent = `You got ${this.points} pigs!`
        gameStartDiv.style.display = "none"
        gameEndDiv.style.display = "flex"
    }
}

const config = {
    type: Phaser.WEBGL,
    width: sizes.width,
    height: sizes.height,
    canvas: gameCanvas,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y:speedDown},
            debug: true
        }
    },
    scene: [GameScene]
}

const game = new Phaser.Game(config)

gameStartBtn.addEventListener("click", () => {
    gameStartDiv.style.display = "none"
    game.scene.resume("scene-game")
})