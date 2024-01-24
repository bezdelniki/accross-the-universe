import * as Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
    constructor() {
        super('preloader')
    }

    preload() {
        this.load.image('car', 'assets/images/car/body.png')
        this.load.image('wheel', 'assets/images/car/wheel.png')
        this.load.image('coin500', 'assets/images/items/coin500.png')
        this.load.image('coin100', 'assets/images/items/coin100.png')
        this.load.image('fuel', 'assets/images/items/fuel.png')
        this.load.image('driverBody', 'assets/images/driver/body.png')
        this.load.image('driverHead', 'assets/images/driver/head.png')

        this.load.json('shapes', 'assets/JSONs/shapes.json')

        this.load.image('play-btn', 'assets/images/menu/play-btn.svg')
        this.load.image('background', 'assets/images/menu/background.jpg')

        // this.load.font('dumbprofont', 'assets/fonts/3DumbPro03.ttf');
    }

    create() {
        this.scene.start('menu')
    }

}