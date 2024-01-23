import * as Phaser from "phaser";
import { PreloadScene } from "../../client/src/scenes/PreloadScene";
import { Game } from "../../client/src/scenes/Game"
import MainMenuScene from "../../client/src/scenes/Main-menu";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1024,
  height: 720,
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
  scene: [PreloadScene, Game, MainMenuScene]
}

new Phaser.Game(config)