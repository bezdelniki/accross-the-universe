import * as Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('car', 'assets/images/car/body.png')
        this.load.image('wheel', 'assets/images/car/wheel.png')
        this.load.image('coin5', 'assets/images/items/coin5.png')
        this.load.image('coin25', 'assets/images/items/coin25.png')
        this.load.image('coin100', 'assets/images/items/coin100.png')
        this.load.image('coin500', 'assets/images/items/coin500.png')
        this.load.image('fuel', 'assets/images/items/fuel.png')
        this.load.image('driverBody', 'assets/images/driver/body.png')
        this.load.image('driverHead', 'assets/images/driver/head.png')
        this.load.image('fuel-bg', 'assets/images/items/fuelBg.svg')
        this.load.image('fuel-lvl', 'assets/images/items/fuelLevel.svg')

        this.load.json('shapes', 'assets/JSONs/shapes.json')

        this.load.image('play-btn', 'assets/images/menu/play-btn.svg')
        this.load.image('background', 'assets/images/menu/background.jpg')
        this.load.image('user-frame', 'assets/images/menu/frame1.svg')
        this.load.image('leaderboard-frame', 'assets/images/menu/frame2.svg')
        this.load.image('login-btn', 'assets/images/menu/loginBtn.svg')

        this.load.image('restart-btn', 'assets/images/menu/restart.png')
        this.load.image('main-page-btn', 'assets/images/menu/main-page.png')
        this.load.image('black-screen', 'assets/images/menu/black-screen.png')
        this.load.image('new-record', 'assets/images/menu/new-record.png')
    }

    create() {
        this.scene.start('menu')
    }

}