// import { use } from "matter";
import * as Phaser from "phaser";
import { GameScene } from "./GameScene";
import createClient from "../Tools";

interface MenuData {
    distanceRecord: number;
    money: number;
}

const exampleData: [string, number, number][] = [
    ['CoffeeAddict', 99432, 5283],
    ['CoolGamer', 98765, 5100],
    ['Bookworm', 90123, 5092],
    ['Traveler', 82933, 5001],
    ['User123', 54321, 4837],
    ['SportsFan', 43428, 3934],
    ['NatureLover', 6789, 3473],
    ['TechWizard', 6247, 3284],
    ['RhythmJunkie', 2348, 2984],
    ['sush', 1000, 2743],
    ['MusicLover', 200, 2587],
    ['CodeNinja', 123, 2096],
    ['FitnessEnthusiast', 34, 1300],
    ['Kitten', 20, 804],
    ['CATS', 10, 21],
];


export class MenuScene extends Phaser.Scene {
    private playButton!: Phaser.GameObjects.Image;
    private background!: Phaser.GameObjects.Image;
    private userBox!: Phaser.GameObjects.Image;
    private leaderboardBox!: Phaser.GameObjects.Image;

    private username: string = "...";
    private money: number = 0;
    private distanceRecord: number = 0;

    private usernameText!: Phaser.GameObjects.Text;
    private distanceRecordText!: Phaser.GameObjects.Text;
    private moneyText!: Phaser.GameObjects.Text;

    private leaderboardTitle!: Phaser.GameObjects.Text;

    private scrollContainer!: Phaser.GameObjects.Container;

    private leadersList!: Phaser.GameObjects.Text[];
    private scrollMask!: Phaser.GameObjects.Graphics;

    private loginForm!: Phaser.GameObjects.DOMElement;
    private loginFormOpened: boolean = false;

    private openFormBtn!: Phaser.GameObjects.Image;

    private authorized: boolean = false;

    preload() {
        this.load.html("form", "form.html");
    }

    init(data: MenuData) {
        // if (!this.authorized) {
        //     if (data.money) {
        //         this.money = data.money;
        //     }
        //     if (data.distanceRecord) {
        //         this.distanceRecord = data.distanceRecord;
        //     }
        // }
        if (data.money) {
            this.money = data.money;
        }
        if (data.distanceRecord) {
            this.distanceRecord = data.distanceRecord;
        }
    }

    constructor() {
        super("menu");

        this.leadersList = [];
    }

    create() {
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Установка фона или другого изображения на сцену
        this.background = this.add.image(screenWidth / 2, screenHeight / 2, "background");
        this.background.setDisplaySize(screenWidth, screenHeight);

        // Создание заголовка
        const title = this.add.text(screenWidth / 2, screenHeight * 0.15, "Accross The Universe", { fontSize: "64px", fontFamily: "dumbprofont", color: "#ffffff" });
        title.setOrigin(0.5);

        const buttonWidth = screenWidth * 0.14;
        const buttonHeight = buttonWidth;

        this.playButton = this.add.image(screenWidth / 2, screenHeight / 2, "play-btn");
        this.playButton.setDisplaySize(buttonWidth, buttonHeight);
        this.playButton.setInteractive({ useHandCursor: true });
        this.playButton.on("pointerdown", () => {
            this.scene.add('game', GameScene, true, { money: this.money, distanceRecord: this.distanceRecord });
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
        const userBoxWidth = userBoxHeight;
        this.userBox.setDisplaySize(userBoxWidth, userBoxHeight);

        this.usernameText = this.add.text(0, 0, "username", { fontSize: "32px", fontFamily: "aidafont", color: "#ffffff" });
        this.moneyText = this.add.text(0, 0, "123456g", { fontSize: "24px", fontFamily: "aidafont", color: "#ffffff" })
        this.distanceRecordText = this.add.text(0, 0, "1234m", { fontSize: "24px", fontFamily: "aidafont", color: "#ffffff" });

        const userBoxCenterX = this.userBox.displayWidth * 0.5;
        const userBoxTopTextY = this.userBox.y - this.userBox.displayHeight * 0.25;

        this.usernameText.setPosition(userBoxCenterX, userBoxTopTextY);
        this.usernameText.setOrigin(0.5, 0);

        this.distanceRecordText.setPosition(userBoxCenterX, userBoxTopTextY + this.userBox.displayHeight * 0.2);
        this.distanceRecordText.setOrigin(0.5, 0);

        this.moneyText.setPosition(userBoxCenterX, userBoxTopTextY + this.userBox.displayHeight * 0.4);
        this.moneyText.setOrigin(0.5, 0);


        // штука для авторизации

        this.openFormBtn = this.add.image(0, 0, "login-btn");
        this.openFormBtn.setDisplaySize(screenWidth * 0.03, screenWidth * 0.03);
        this.openFormBtn.setPosition(userBoxCenterX, userBoxTopTextY);
        this.openFormBtn.setOrigin(0.5, 0);
        this.openFormBtn.setInteractive({ useHandCursor: true });
        this.openFormBtn.on("pointerdown", () => {
            if (!this.loginFormOpened) {
                this.openLoginForm();
            } else {
                this.closeLoginForm();
            }
        });
        if (this.authorized) {
            this.openFormBtn.setVisible(false);
            this.openFormBtn.disableInteractive();
        } else {
            this.usernameText.setVisible(false);
        }

        //

        this.leaderboardTitle = this.add.text(0, 0, "LEADERBOARD ", { fontSize: "36px", fontFamily: "aidafont", color: "#ffffff" });

        const leaderboardBoxCenterX = screenWidth - this.leaderboardBox.displayWidth * 0.55;
        const leaderboardBoxTopY = this.leaderboardBox.y - this.leaderboardBox.displayHeight * 0.56;

        this.leaderboardTitle.setPosition(leaderboardBoxCenterX, leaderboardBoxTopY);
        this.leaderboardTitle.setOrigin(0.5, 0);
        // this.leaderboardBox.displayWidth = this.leaderboardBox.displayWidth;

        const scrollPosX = screenWidth - this.leaderboardBox.displayWidth * 0.875;
        const scrollPosY = this.leaderboardBox.y - this.leaderboardBox.displayHeight * 0.419;
        const scrollWidth = this.leaderboardBox.displayWidth * 0.64;
        const scrollHeight = this.leaderboardBox.displayHeight * 0.805;

        this.scrollContainer = this.add.container(scrollPosX, scrollPosY);
        this.scrollContainer.setScrollFactor(0);

        // фон области прокрутки
        this.scrollMask = this.add.graphics();
        // this.scrollMask.fillStyle(0x000000, 0.5);
        this.scrollMask.fillRect(scrollPosX, scrollPosY, scrollWidth, scrollHeight);
        this.scrollContainer.setMask(this.scrollMask.createGeometryMask());

        this.leadersList = [];

        const leadersCount = 15;
        const itemHeight = scrollHeight / leadersCount;
        for (let i = 0; i < leadersCount; i++) {
            const listItem = this.add.text(0, i * itemHeight, '', { fontSize: "20px", fontFamily: "aidafont", color: "#ffffff" });
            listItem.setVisible(false); // Установить видимость элемента списка в false
            this.scrollContainer.add(listItem);
            this.leadersList.push(listItem);
        }

        this.updateData();
        this.updateDisplayedValues();
    }

    updateSize(screenWidth: number, screenHeight: number) {
        this.background.setPosition(screenWidth / 2, screenHeight / 2);
        this.background.setDisplaySize(screenWidth, screenHeight);

        const buttonWidth = screenWidth * 0.14;
        const buttonHeight = buttonWidth;
        this.playButton.setDisplaySize(buttonWidth, buttonHeight);
        this.playButton.setPosition(screenWidth / 2, screenHeight / 2);

        const leaderboardBoxHeight = screenHeight * 0.7;
        const leaderboardBoxWidth = leaderboardBoxHeight / 1.4;
        this.leaderboardBox.setDisplaySize(leaderboardBoxWidth, leaderboardBoxHeight);
        this.leaderboardBox.setPosition(screenWidth - leaderboardBoxWidth, this.cameras.main.centerY * 1.2);

        const userBoxHeight = screenHeight * 0.5;
        const userBoxWidth = userBoxHeight;
        this.userBox.setDisplaySize(userBoxWidth, userBoxHeight);

        const userBoxCenterX = this.userBox.displayWidth * 0.5;
        const userBoxTopTextY = this.userBox.y - this.userBox.displayHeight * 0.25;

        this.usernameText.setPosition(userBoxCenterX, userBoxTopTextY);

        this.distanceRecordText.setPosition(userBoxCenterX, userBoxTopTextY + this.userBox.displayHeight * 0.2);

        this.moneyText.setPosition(userBoxCenterX, userBoxTopTextY + this.userBox.displayHeight * 0.4);

        const leaderboardBoxCenterX = screenWidth - this.leaderboardBox.displayWidth * 0.55;
        const leaderboardBoxTopY = this.leaderboardBox.y - this.leaderboardBox.displayHeight * 0.56;

        this.leaderboardTitle.setPosition(leaderboardBoxCenterX, leaderboardBoxTopY);

        const scrollPosX = screenWidth - this.leaderboardBox.displayWidth * 0.875;
        const scrollPosY = this.leaderboardBox.y - this.leaderboardBox.displayHeight * 0.419;
        const scrollWidth = this.leaderboardBox.displayWidth * 0.64;
        const scrollHeight = this.leaderboardBox.displayHeight * 0.805;

        this.scrollContainer.setPosition(scrollPosX, scrollPosY);
        this.scrollContainer.setScrollFactor(0);

        this.scrollMask.clear();
        this.scrollMask.fillRect(scrollPosX, scrollPosY, scrollWidth, scrollHeight);
        this.scrollContainer.setMask(this.scrollMask.createGeometryMask());

        const leadersCount = 15;
        const itemHeight = scrollHeight / leadersCount;
        for (let i = 0; i < leadersCount; i++) {
            this.leadersList[i].setPosition(0, i * itemHeight);
        }

        if (this.loginForm) {
            this.loginForm.setPosition(screenWidth * 0.5 - this.loginForm.displayWidth * 0.5, screenHeight * 0.5 - this.loginForm.displayHeight * 0.5);
        }
    }

    updateDisplayedValues(): void {
        this.usernameText.setText(`${this.username}`);
        this.distanceRecordText.setText(`${this.distanceRecord}m`)
        this.moneyText.setText(`${this.money}g`);
    }

    updateData(): void {
        this.updateUserData();
        this.updateLeaderboard();
    }

    updateUserData(): void {
        const token = sessionStorage.getItem('token');

        // send request for data to server
        // requested data:
        //      username
        //      money
        //      distanceRecord
    }

    updateLeaderboard(): void {
        // const client = createClient();

        // const formData = {

        // };

        // client.post('/api/v1/token/login/', formData)
        //     .then(response => {
                
        //     })

        if (this.username) {
            let found = false;

            for (let i = 0; i < exampleData.length; i++) {
                if (exampleData[i][0] === this.username) {
                    exampleData[i][1] = this.money;
                    exampleData[i][2] = this.distanceRecord;
                    found = true;
                    break;
                }
            }

            if (!found) {
                exampleData.push([this.username, this.money, this.distanceRecord]);
            }

            exampleData.sort((a, b) => b[1] - a[1]);
        }
    
        this.setLeaderboardData(exampleData);
    }

    setLeaderboardData(data: (string | number)[][]): void {
        const maxCount = this.leadersList.length;

        for (let i = 0; i < maxCount; i++) {
            if (i < data.length) {
                this.leadersList[i].setText(`${i + 1}) ${data[i][0]} - ${data[i][1]}`);
                this.leadersList[i].setVisible(true);
            } else {
                this.leadersList[i].setVisible(false);
            }
        }
    }

    openLoginForm() {
        this.loginFormOpened = true;
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        if (!this.loginForm) {
            this.loginForm = this.add.dom(screenWidth * 0.5, screenHeight * 0.5).createFromCache("form");
            this.loginForm.setPosition(screenWidth * 0.5 - this.loginForm.displayWidth * 0.5, screenHeight * 0.5 - this.loginForm.displayHeight * 0.5);

            const submitButton = this.loginForm.node.querySelector('[name="submit"]');
            if (submitButton) {
                submitButton.addEventListener('pointerdown', this.handleFormSubmit.bind(this));

            }
        } else {
            this.loginForm.setVisible(true);
        }
        this.playButton.disableInteractive();

    }

    closeLoginForm() {
        this.loginFormOpened = false;
        this.loginForm.setVisible(false);
        this.playButton.setInteractive({ useHandCursor: true });
    }

    async handleFormSubmit() {
        const input = this.loginForm.node.querySelectorAll('input');
        const loginValue = input[1].value;
        const passwordValue = input[2].value;
        const isLogin = input[0].checked;

        if (loginValue != "" && passwordValue != "") {
            this.username = loginValue;
            this.authorized = true;
            this.closeLoginForm();
            this.openFormBtn.setVisible(false);
            this.openFormBtn.disableInteractive();
            this.usernameText.setVisible(true);
            
            for (let i = 0; i < exampleData.length; i++) {
                if (this.username === exampleData[i][0]) {
                    this.money = exampleData[i][1];
                    this.distanceRecord = exampleData[i][2];
                }
            }

            this.updateDisplayedValues();
        }

        // const client = createClient();

        // const formData = {
        //     username: loginValue,
        //     password: passwordValue,
        // };

        // if (isLogin) {
        //     const response = await client.post('/api/v1/token/login/', formData)
        //     .then(response => {
        //         const token = response.data.token;
        //         sessionStorage.setItem('token', token);
                
        //         console.log(`current user token: ${token}`);
        //         this.authorized = true;
        //         this.openFormBtn.setVisible(false);
        //         this.openFormBtn.disableInteractive();
        //     })
        // } else {
        //     const response = await client.post('/api/v1/users/', formData)
        //     .then(response => {
        //         const token = response.data.token;
        //         sessionStorage.setItem('token', token);
                
        //         console.log(`current user token: ${token}`);
        //     })
        // }
    }
}

