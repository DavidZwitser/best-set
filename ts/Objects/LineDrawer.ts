import 'phaser-ce';

import GameTile from './GridObjects/GameTile';
import SpriteSheets from '../Data/SpriteSheets';

export default class LineDrawer
{

    public game: Phaser.Game;

    private _drawGraphics: Phaser.Graphics;
    private _drawSpriteSheets: Array<Phaser.Sprite>;

    constructor(game: Phaser.Game)
    {
        this.game = game;

        this._drawGraphics = new Phaser.Graphics(game);
        this.game.add.existing(this._drawGraphics);

        this._drawSpriteSheets = [];
        for (let i: number = 0; i < 3; i++) {
            this.addSpriteToLine();
        }
    }

    /* Draw a path */
    public drawPath(tiles: GameTile[], lineWidth: number, color: number): void
    {
        this.clearPath();

        if (tiles.length <= 1) { return; }

        // this._drawGraphics.beginFill();
        // this._drawGraphics.lineStyle(lineWidth, color);

        // this._drawGraphics.moveTo(tiles[0].worldPosition.x, tiles[0].worldPosition.y);

        for (let i: number = 1; i < tiles.length; i++)
        {
            let currentTile: GameTile = tiles[i];
            let previousTile: GameTile = tiles[i - 1];
            let dx: number = currentTile.worldPosition.x - previousTile.worldPosition.x;
            let dy: number = currentTile.worldPosition.y - previousTile.worldPosition.y;
            let length: number = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            let angle: number = Math.atan(dx / dy);
            console.log(dx, dy, angle);

            let line: Phaser.Sprite = this._drawSpriteSheets[i - 1];
            line.position.set(previousTile.worldPosition.x, previousTile.worldPosition.y);
            line.width = length;
            line.height = length / 2.5;

            //this._drawGraphics.lineTo(currentTile.worldPosition.x, currentTile.worldPosition.y);
            //this._drawGraphics.moveTo(currentTile.worldPosition.x, currentTile.worldPosition.y);

        }

        //this._drawGraphics.endFill();
    }
    public addSpriteToLine(): void {
        let sprite: Phaser.Sprite = this.game.add.sprite(0, 0, SpriteSheets.Swipe.name);
        sprite.animations.add('shine');
        sprite.animations.play('shine', 24, true);
        this._drawSpriteSheets.push(sprite);
    }

    /* Clear the path */
    public clearPath(): void
    {
        this._drawGraphics.clear();
    }

    public destroy(): void
    {
        for (let i: number = this._drawSpriteSheets.length; i--;) {
            this._drawSpriteSheets[i].destroy(true);
            this._drawSpriteSheets = null;
        }
        this._drawSpriteSheets.length = 0;

        this._drawGraphics.destroy(true);
        this._drawGraphics = null;
    }
}
