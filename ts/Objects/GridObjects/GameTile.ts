import 'phaser-ce';

import GridObject from './GridObject';
import {gridElementTypes} from './GridObject';
import Atlases from '../../Data/Atlases';
import FrameNames from '../../Data/FrameNames';
import SpriteSheets from '../../Data/SpriteSheets';

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

    private _tween: Phaser.Tween;

    private _iconSprite: Phaser.Sprite;
    private _glowSprite: Phaser.Sprite;

    private _shineSprite: Phaser.Sprite;
    private _explosionSprite: Phaser.Sprite;

    public isBeingDestroyed: boolean;

    constructor(game: Phaser.Game, gridX: number, gridY: number, shape: TileShapes, icon?: TileIcons)
    {
        super(game, gridX, gridY, '', gridElementTypes.tile);

        this.isBeingDestroyed = false;

        this._iconSprite = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._iconSprite.anchor.set(.5);
        this._iconSprite.visible = false;

        this._shineSprite = new Phaser.Sprite(game, 0, 0, SpriteSheets.TileShine.name);
        this._shineSprite.anchor.set(.5);
        this._shineSprite.scale.set(.55);
        this._shineSprite.animations.add('shine');
        this.shine();

        this._glowSprite = new Phaser.Sprite(game, 0, 0, Atlases.Interface, '');
        this._glowSprite.anchor.set(.5);

        if (shape) { this.shape = shape; }
        if (icon) { this.icon = icon; }

        this.addChild(this._shineSprite);
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
        if (value !== null) {
            this._iconSprite.frameName = FrameNames.InGameIcon + value;
        }
        this._icon = value;
        this._iconSprite.visible = value !== null;
    }
    get icon(): TileIcons
    {
        return this._icon;
    }

    public shine(): void
    {
        this._shineSprite.animations.play('shine', 24, false);
    }

    /* Hide the tile with an animation */
    public animateOut(): Phaser.Signal
    {
        this.isBeingDestroyed = true;

        this.explosion();
        this.clearTween();

        this._tween = this.game.add.tween(this.scale)
            .to({x: 0, y: 0}, 300, Phaser.Easing.Cubic.InOut)
            .start();

        return this._tween.onComplete;
    }

    public explosion(): void
    {
        this._explosionSprite = new Phaser.Sprite(this.game, this.world.x, this.world.y, SpriteSheets.TileDestroy.name);
        this._explosionSprite.anchor.set(.5);
        this._explosionSprite.scale.set(.65);
        this._explosionSprite.animations.add('explode');
        this.game.add.existing(this._explosionSprite);
        this._explosionSprite.animations.play('explode', 24, false, true);
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

    public destroy(): void
    {
        super.destroy(true);

        this.clearTween();

        if (this._iconSprite) { this._iconSprite.destroy(true); }
        this._iconSprite = null;

        if (this._glowSprite) { this._glowSprite.destroy(true); }
        this._glowSprite = null;

        if (this._shineSprite) { this._shineSprite.destroy(true); }
        this._shineSprite = null;

        if (this._explosionSprite) { this._explosionSprite.destroy(true); }
        this._explosionSprite = null;
    }

}
