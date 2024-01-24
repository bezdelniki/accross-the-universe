import * as Phaser from "phaser";


export class GameOverScene extends Phaser.Scene {
    private playButton!: Phaser.GameObjects.Image;

    constructor() {
        super("game-over");
    }

    preload() {
        
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        
    }

    update() {
        
    }
}