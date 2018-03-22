import 'phaser-ce';

import GridObject from './GridObject';
import {gridElementTypes} from './GridObject';
import Atlases from '../../Data/Atlases';
import FrameNames from '../../Data/FrameNames';

export enum TileIcons
{
    helmet = 'helmet',
    magic = 'magic',
    shield = 'shield'
}

export enum TileShapes
{
    blue = 'blue',
    red = 'red',
    yellow = 'yellow'
}

export default class GameTile extends GridObject
{
    private _shape: TileShapes;
    private _icon: TileIcons;

    private _iconSprite: Phaser.Sprite;
    private _glowSprite: Phaser.Sprite;

    private _tween: Phaser.Tween;

    constructor(game: Phaser.Game, gridX: number, gridY: number, shape: TileShapes, icon?: TileIcons)
    {
        super(game, gridX, gridY, FrameNames.InGameIconBackdrop, gridElementTypes.tile);

        this._iconSprite = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._iconSprite.anchor.set(.5);
        this._iconSprite.visible = false;

        this._glowSprite = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._glowSprite.anchor.set(.5);

        if (shape) { this.shape = shape; }
        if (icon) { this.icon = icon; }

        this.addChild(this._iconSprite);
        this.addChild(this._glowSprite);

        this.resize();
    }

    /* Set the shape of a tile */
    set shape(value: TileShapes)
    {
        this.frameName = FrameNames.InGameIcon + value;
        this._glowSprite.frameName = FrameNames.InGameIconGlow + value;
        this._shape = value;
    }
    get shape(): TileShapes
    {
        return this._shape;
    }

    /* Set the icon of a tile */
    set icon(value: TileIcons)
    {
        this._iconSprite.frameName = FrameNames.InGameIcon + value;
        this._icon = value;
        this._iconSprite.visible = true;
    }
    get icon(): TileIcons
    {
        return this._icon;
    }

    /* Hide the tile with an animation */
    public animateOut(): Phaser.Signal {

        this.clearTween();

        this._tween = this.game.add.tween(this.scale)
            .to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.InOut)
            .start();

        return this._tween.onComplete;
    }

    /* Make the tile fall down in a animated fashion */
    public animateDown(newYPos: number, speed: number = 750): Phaser.Signal
    {
        this.clearTween();

        this._tween = this.game.add.tween(this)
            .to({y: newYPos}, speed, Phaser.Easing.Bounce.Out)
            .start();

        return this._tween.onComplete;
    }

    /* Clear the tween so it can be overwritten */
    private clearTween(): void
    {
        if (this._tween)
        {
            this._tween.stop(false);
            this._tween = null;
        }
    }

    public resize(): void
    {
        this.clearTween();
    }

    public destroy(): void {
        super.destroy(true);

        this._iconSprite.destroy(true);
        this._iconSprite = null;
    }

}
