import { use } from "matter";
import * as Phaser from "phaser";
import { GameScene } from "./GameScene";


export class MenuScene extends Phaser.Scene {
    private playButton!: Phaser.GameObjects.Image;
    private background!: Phaser.GameObjects.Image;
    private userBox!: Phaser.GameObjects.Image;
    private leaderboardBox!: Phaser.GameObjects.Image;

    constructor() {
        super("menu");
    }

    preload() {
        
    }

    create() {
        console.log("create menu scene");
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Установка фона или другого изображения на сцену
        this.background = this.add.image(screenWidth / 2, screenHeight / 2, "background");
        this.background.setDisplaySize(screenWidth, screenHeight);

        // Создание заголовка
        const title = this.add.text(screenWidth / 2, screenHeight * 0.15, "Accross The Universe", { fontSize: "64px", fontFamily: "dumbprofont", color: "#ffffff" });
        title.setOrigin(0.5);

        const buttonWidth = screenWidth * 0.23;
        const buttonHeight = buttonWidth;

        this.playButton = this.add.image(screenWidth / 2, screenHeight / 2, "play-btn");
        this.playButton.setDisplaySize(buttonWidth, buttonHeight);
        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on("pointerdown", () => {
            this.scene.add('game', GameScene, true);
            this.scene.setVisible(false, 'menu');
        });

        this.leaderboardBox = this.add.image(screenWidth * 0.02, this.cameras.main.centerY, 'leaderboard-frame');
        this.leaderboardBox.setOrigin(0, 0.5);

        const leaderboardBoxHeight = screenHeight * 0.7;
        const leaderboardBoxWidth = leaderboardBoxHeight / 1.4;
        this.leaderboardBox.setDisplaySize(leaderboardBoxWidth, leaderboardBoxHeight);
        this.leaderboardBox.setPosition(screenWidth - leaderboardBoxWidth, this.cameras.main.centerY * 1.2);

        
        this.userBox = this.add.image(0, this.cameras.main.centerY, 'user-frame');
        this.userBox.setOrigin(0, 0.5);
        
        const userBoxHeight = screenHeight * 0.5;
        const userBoxWidth = userBoxHeight ;
        this.userBox.setDisplaySize(userBoxWidth, userBoxHeight);
    }

    update() {
        
    }

    updateSize(screenWidth: number, screenHeight: number) {
        this.background.setPosition(screenWidth / 2, screenHeight / 2);
        this.background.setDisplaySize(screenWidth, screenHeight);

        const buttonWidth = screenWidth * 0.23;
        const buttonHeight = buttonWidth;
        this.playButton.setDisplaySize(buttonWidth, buttonHeight);
        this.playButton.setPosition(screenWidth / 2, screenHeight / 2);

        const leaderboardBoxHeight = screenHeight * 0.7;
        const leaderboardBoxWidth = leaderboardBoxHeight / 1.4;
        this.leaderboardBox.setDisplaySize(leaderboardBoxWidth, leaderboardBoxHeight);
        this.leaderboardBox.setPosition(screenWidth - leaderboardBoxWidth, this.cameras.main.centerY * 1.2);

        const userBoxHeight = screenHeight * 0.5;
        const userBoxWidth = userBoxHeight ;
        this.userBox.setDisplaySize(userBoxWidth, userBoxHeight);
    }

    updateData(): void {
        const token = sessionStorage.getItem('token');

        // send request for data to server
        // requested data:
        //               username
        //               money
        //               distanceRecord

        this.updateLeaderboard();
    }

    updateLeaderboard(): void {

    }
}