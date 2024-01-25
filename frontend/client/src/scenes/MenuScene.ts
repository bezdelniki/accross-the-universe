import * as Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
    private playButton!: Phaser.GameObjects.Image;
    private background!: Phaser.GameObjects.Image;

    constructor() {
        super("menu");
    }

    preload() {
        
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Установка фона или другого изображения на сцену
        this.background = this.add.image(screenWidth / 2, screenHeight / 2, "background");
        this.background.setDisplaySize(screenWidth, screenHeight);

        // Создание заголовка
        const title = this.add.text(this.cameras.main.width / 2, 100, "Accross The Universe", { fontSize: "64px", fontFamily: "dumbprofont", color: "#ffffff" });
        title.setOrigin(0.5);

        // Вычисление размеров кнопки в процентах от размера экрана
        const buttonWidth = screenWidth * 0.23; // 20% от ширины экрана
        const buttonHeight = buttonWidth; // 10% от высоты экрана

        // Добавление кнопки Play с иконкой и установка размеров
        this.playButton = this.add.image(screenWidth / 2, screenHeight / 2, "play-btn");
        this.playButton.setDisplaySize(buttonWidth, buttonHeight);
        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on("pointerdown", () => {
            this.scene.start("game");
        });

        // // Создание кнопки Play
        // const playButton = this.add.text(this.cameras.main.width / 2, 200, "Play", { fontSize: "24px", fontFamily: "Arial", color: "#ffffff", backgroundColor: "#000000" });
        // playButton.setOrigin(0.5);
        // playButton.setInteractive({ useHandCursor: true });
        // playButton.on("pointerdown", () => {
        //     this.scene.start("game");
        // });

        // // Создание бокса с юзернеймом и результатами
        // const userBox = this.add.graphics();
        // userBox.fillStyle(0xffffff, 0.8);
        // userBox.fillRect(this.cameras.main.width / 4, this.cameras.main.height / 2, 200, 100);

        // const usernameText = this.add.text(this.cameras.main.width / 4 + 10, this.cameras.main.height / 2 + 10, "Username", { fontSize: "16px", fontFamily: "Arial", color: "#000000" });
        // const coinsText = this.add.text(this.cameras.main.width / 4 + 10, this.cameras.main.height / 2 + 40, "Coins: 0", { fontSize: "16px", fontFamily: "Arial", color: "#000000" });
        // const highscoreText = this.add.text(this.cameras.main.width / 4 + 10, this.cameras.main.height / 2 + 70, "Highscore: 0", { fontSize: "16px", fontFamily: "Arial", color: "#000000" });

        // // Создание бокса для лидерборда
        // const leaderboardBox = this.add.graphics();
        // leaderboardBox.fillStyle(0xffffff, 0.8);
        // leaderboardBox.fillRect(this.cameras.main.width * 3 / 4, this.cameras.main.height / 2, 200, 300);

        // const leaderboardTitle = this.add.text(this.cameras.main.width * 3 / 4 + 100, this.cameras.main.height / 2 + 10, "Leaderboard", { fontSize: "16px", fontFamily: "Arial", color: "#000000" });
        // leaderboardTitle.setOrigin(0.5);

        // // Загрузка и отображение списка игроков
        // const players = ["Player 1", "Player 2", "Player 3"]; // Пример списка игроков
        // const leaderboardTexts = [];
        // for (let i = 0; i < players.length; i++) {
        //     const playerText = this.add.text(this.cameras.main.width * 3 / 4 + 10, this.cameras.main.height / 2 + 40 + i * 30, `${i + 1}. ${players[i]}`, { fontSize: "14px", fontFamily: "Arial", color: "#000000" });
        //     leaderboardTexts.push(playerText);
        // }
    }

    update() {
        // Логика обновления сцены
    }
}