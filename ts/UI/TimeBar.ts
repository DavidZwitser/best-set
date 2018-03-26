import 'phaser-ce';

import Images from '../Data/Images';
import Timer from '../BackEnd/Timer';

export default class TimeBar extends Phaser.Group
{

    private _timeBar: Phaser.Sprite;

    private _timeMask: Phaser.Graphics;
    private _maskWidth: number;
    private _animationEndOfBar: Phaser.Sprite;

    get GetMaskWidth(): number
    {
        return this._maskWidth;
    }

    set SetMaskWidth(newMaskWidth: number)
    {
        this._maskWidth = newMaskWidth;
    }

    private _timerClass: Timer;

    public mask: any;

    constructor(game: Phaser.Game)
    {
        super(game);

        this.game.add.existing(this);

        this.addSprite();
        this.addMask();
        this.scaleSprite();

        this._animationEndOfBar = new Phaser.Sprite(this.game, this.game.width / 15, this.game.height / 2.275, 'spritesheetuiteindetimebar');
        this._animationEndOfBar.anchor.set(0, .5);
        this._animationEndOfBar.animations.add('running');
        this._animationEndOfBar.animations.play('running', 24, true);
        this.game.add.existing(this._animationEndOfBar);
        this._timerClass = new Timer();
        console.log(this._timerClass);
    }

    public addSprite(): void
    {
        this._timeBar = this.game.add.sprite(this.game.width / 15, this.game.height / 2.275, Images.PlaceholderBar);
    }

    public addMask(): void
    {
        this._timeMask = this.game.add.graphics(180, this._timeBar.y / 2.32);
        this._timeMask.beginFill(0x00000f);
    }

    /*
    * This function will get called with every interval
    * Might need a cleaner solution
    */

    public drawMask(adjustedWidth: number): void
    {
        // Needs a cleaner solution due to constant drawing
        this._timeMask.drawRect(500, 320, this._timeBar.width * adjustedWidth, this._timeBar.height);
        this._animationEndOfBar.x = 500 + this._timeMask.x + this._timeBar.width * adjustedWidth;
    }

    public scaleSprite(): void
    {
        this._timeBar.scale.setTo(2, 1);
    }

    public shutdown(): void
    {
        this._timeBar.destroy(true);
        this._timeBar = null;

        this._timeMask.destroy(true);
        this._timeMask = null;
    }

}
