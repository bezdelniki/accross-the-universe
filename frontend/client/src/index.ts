import * as Phaser from "phaser";
import { PreloadScene } from "../../client/src/scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";
import { MainMenuScene } from "./scenes/Main-menu-old";
import { MenuScene } from "./scenes/MenuScene";
import { GameOverScene } from "./scenes/GameOverScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    backgroundColor: "#555555",
    parent: 'phaser-container',
    dom: {
        createContainer: true,
    },
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { y: 3 },
            setBounds: {
                left: false,
                right: false,
                top: false,
                bottom: false
            }
        }
    },
    scene: [PreloadScene, MenuScene, GameOverScene],
}

const game: Phaser.Game = new Phaser.Game(config)


function resizeGame(): void {
    var gameContainer = document.getElementById('game-container');
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var gameWidth, gameHeight;

    gameWidth = windowWidth;
    gameHeight = windowHeight;

    // Обновление размеров игрового окна
    game.scale.resize(gameWidth, gameHeight);

    if (game.scene.isActive('menu')) {
        const menuScene = game.scene.getScene('menu') as MenuScene;
        menuScene.updateSize(gameWidth, gameHeight);
    } else if (game.scene.isActive('game-over')) {
        const gameOverScene = game.scene.getScene('game-over') as GameOverScene;
        gameOverScene.updateSize(gameWidth, gameHeight);
    }
}

window.addEventListener('resize', resizeGame);