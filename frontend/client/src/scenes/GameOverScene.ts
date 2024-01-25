import * as Phaser from "phaser";
import { GameScene } from "./GameScene";


interface GameOverData {
    characterDead: boolean;
    distance: number;
    distanceRecord: number;
    money: number;
}


export class GameOverScene extends Phaser.Scene {
    private blackScreen!: Phaser.GameObjects.Image;
    private restartBtn!: Phaser.GameObjects.Image;
    private mainManuBtn!: Phaser.GameObjects.Image;
    private newRecord!: Phaser.GameObjects.Image;

    private deathText!: Phaser.GameObjects.Text;
    private distanceText!: Phaser.GameObjects.Text;
    private goldText!: Phaser.GameObjects.Text;
    private recordText!: Phaser.GameObjects.Text;

    private money: number = 0;
    private distance: number = 0;
    private distanceRecord: number = this.distance;
    private characterDead!: boolean;

    private isRecord: boolean = false;
    

    constructor() {
        super("game-over");
    }

    init(data: GameOverData) {
        this.characterDead = data.characterDead;
        this.distance = data.distance;
        this.distanceRecord = data.distanceRecord;
        this.money = data.money;

        if (this.distance > this.distanceRecord) {
            this.distanceRecord = this.distance;
            this.isRecord = true;
        }
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // установка черного прозрачного фона
        this.blackScreen = this.add.image(screenWidth / 2, screenHeight / 2, 'black-screen');
        this.blackScreen.setDisplaySize(screenWidth, screenHeight);

        // текст об окоынчании игры
        this.deathText = this.add.text(screenWidth / 2, 100, "DRIVER IS DEAD", { fontSize: "64px", fontFamily: "dumbprofont", color: "#ffffff" });
        this.deathText.setOrigin(0.5);

        // показатели в игре
        this.distanceText = this.add.text(screenWidth / 5, screenHeight * 1.1 / 3, "Distance: ", { fontSize: "36px", fontFamily: "dumbprofont", color: "#ffffff" });
        this.distanceText.setOrigin(0.5);

        this.goldText = this.add.text(screenWidth / 5, screenHeight * 1.4 / 3, "Gold: ", { fontSize: "36px", fontFamily: "dumbprofont", color: "#ffffff" });
        this.goldText.setOrigin(0.5);

        this.recordText = this.add.text(screenWidth / 5, screenHeight * 1.7 / 3, "Record: ", { fontSize: "36px", fontFamily: "dumbprofont", color: "#ffffff" });
        this.recordText.setOrigin(0.5);

        this.updateDisplayedValues();

        const buttonSideSize = screenWidth * 0.13;

        if (this.isRecord) {
            this.newRecord = this.add.image(screenWidth * 3.7 / 5, screenHeight * 0.9 / 2, "new-record");
            this.newRecord.setDisplaySize(screenWidth * 0.4, screenWidth * 0.4);
            const glow = this.newRecord.preFX?.addShine()
        }

        this.restartBtn = this.add.image(screenWidth * 1.1 / 3, screenHeight * 3 / 4, "restart-btn");
        this.restartBtn.setDisplaySize(buttonSideSize, buttonSideSize);
        this.restartBtn.setInteractive({ useHandCursor: true });
        this.restartBtn.on("pointerdown", () => {
            this.scene.add('game', GameScene, true);
            this.scene.setVisible(false, 'game-over');
        });
        
        this.mainManuBtn = this.add.image(screenWidth * 1.9 / 3, screenHeight * 3 / 4, "main-page-btn");
        this.mainManuBtn.setDisplaySize(buttonSideSize, buttonSideSize);
        this.mainManuBtn.setInteractive({ useHandCursor: true });
        this.mainManuBtn.on("pointerdown", () => {
            this.scene.start('menu');
            this.scene.setVisible(false, 'game-over');
        });
    }

    updateSize(screenWidth: number, screenHeight: number): void {
        this.blackScreen.setPosition(screenWidth / 2, screenHeight / 2);
        this.blackScreen.setDisplaySize(screenWidth, screenHeight);
    
        this.deathText.setPosition(screenWidth / 2, 100);
        this.distanceText.setPosition(screenWidth / 5, screenHeight * 1.1 / 3);
        this.goldText.setPosition(screenWidth / 5, screenHeight * 1.4 / 3);
        this.recordText.setPosition(screenWidth / 5, screenHeight * 1.7 / 3);

        const buttonSideSize = screenWidth * 0.13;

        if (this.isRecord) {
            this.newRecord.setPosition(screenWidth * 3.7 / 5, screenHeight * 0.9 / 2);
            this.newRecord.setDisplaySize(screenWidth * 0.4, screenWidth * 0.4);
            const glow = this.newRecord.preFX?.addShine()
        }

        this.restartBtn.setPosition(screenWidth * 1.1 / 3, screenHeight * 3 / 4);
        this.restartBtn.setDisplaySize(buttonSideSize, buttonSideSize);        

        this.mainManuBtn.setPosition(screenWidth * 1.9 / 3, screenHeight * 3 / 4);
        this.mainManuBtn.setDisplaySize(buttonSideSize, buttonSideSize);
    }

    updateDisplayedValues() {
        this.deathText.setText(this.characterDead ? `DRIVER IS DEAD` : `OUT OF FUEL`);
        this.distanceText.setText(`Distance: ${this.distance}m`);
        this.recordText.setText(`Record: ${this.distanceRecord}m`);
        this.goldText.setText(`Gold: ${this.money}g`);
    }

    sendData(): void {
        const money = this.money;
        const distanceRecord = this.distanceRecord;
    }
}