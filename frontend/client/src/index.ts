import * as Phaser from "phaser";
import { PreloadScene } from "../../client/src/scenes/PreloadScene";
import { GameScene } from "./scenes/GameScene";
import { MainMenuScene } from "./scenes/Main-menu-old";
import { MenuScene } from "./scenes/MenuScene";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: '100%',
    height: '100%',
    backgroundColor: "#555555",
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 3 },
            setBounds: {
                left: false,
                right: false,
                top: false,
                bottom: false
            }
        }
    },
    scene: [PreloadScene, MenuScene, GameScene]
}

new Phaser.Game(config)