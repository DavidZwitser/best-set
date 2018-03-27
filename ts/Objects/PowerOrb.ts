import 'phaser-ce';
import SpriteSheets from '../Data/SpriteSheets';
export default class PowerOrb extends Phaser.Sprite
{

    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, x, y, SpriteSheets.Orb.name);
        this.anchor.set(.5);
        this.animations.add('shine');
        this.animations.play('shine', 24, true);
        this.visible = false;
        console.log('animating');
    }
}
