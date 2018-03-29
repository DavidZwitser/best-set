import 'phaser-ce';

import GameTile from './GridObjects/GameTile';
import Sounds from '../Data/Sounds';
import SoundManager from '../BackEnd/SoundManager';
import SpriteSheets from '../Data/SpriteSheets';

export default class LineDrawer
{
    public game: Phaser.Game;
    private _drawSpriteSheets: Array<Phaser.Sprite>;

    constructor(game: Phaser.Game)
    {
        this.game = game;
        this._drawSpriteSheets = [];
    }

    /* Draw a path */
    public drawPath(tiles: GameTile[]): void
    {
        this.clearPath();

        if (tiles.length <= 1) { return; }

        /* if there are more lines to be drawn than there are, then new ones are made and added to the list */
        while (tiles.length - 1 > this._drawSpriteSheets.length) {
            this.addSpriteToLine();
        }

        for (let i: number = 1; i < tiles.length; i++)
        {
            /* declaring all the values needed to draw the line */
            let currentTile: GameTile = tiles[i];

            let rndSoundKey: string = tiles.length <= 2 ? Sounds.TileSelect1 : tiles.length <= 3 ? Sounds.TileSelect2 : Sounds.TileSelect3;
            SoundManager.getInstance(this.game).play(rndSoundKey);

            let previousTile: GameTile = tiles[i - 1];
            let dx: number = currentTile.worldPosition.x - previousTile.worldPosition.x;
            let dy: number = currentTile.worldPosition.y - previousTile.worldPosition.y;
            let length: number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let angle: number = Math.atan2(dy, dx) * 180 / Math.PI;

            /* implementing those values */
            let line: Phaser.Sprite = this._drawSpriteSheets[i - 1];
            line.visible = true;
            line.position.set(previousTile.worldPosition.x, previousTile.worldPosition.y);
            line.width = length;
            line.height = length / 2.5;
            line.angle = angle;
            line.animations.play('shine', 24, true);
        }
    }

    /* adding a spritesheet line to the list */
    public addSpriteToLine(): void {
        let sprite: Phaser.Sprite = this.game.add.sprite(0, 0, SpriteSheets.Swipe.name);
        sprite.anchor.set(0, .5);
        sprite.animations.add('shine');
        this._drawSpriteSheets.push(sprite);
    }

    /* Clears the path */
    public clearPath(): void
    {
        for (let i: number = this._drawSpriteSheets.length; i--;)
        {
            this._drawSpriteSheets[i].animations.stop();
            this._drawSpriteSheets[i].visible = false;
        }
    }

    /* called when the class is destroyed */
    public destroy(): void
    {
        for (let i: number = this._drawSpriteSheets.length; i--;) {
            this._drawSpriteSheets[i].destroy(true);
            this._drawSpriteSheets[i] = null;
        }
        this._drawSpriteSheets = null;
    }
}
