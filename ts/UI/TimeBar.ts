import 'phaser-ce';

import Atlases from '../Data/Atlases';

export default class TimeBar extends Phaser.Group
{

    private _timeBar: Phaser.Sprite;
    private _timeBackdrop: Phaser.Sprite;

    private _timeMask: Phaser.Graphics;
    private _maskWidth: number;
    private _animationEndOfBar: Phaser.Sprite;
    private _runningTween: Phaser.Tween;

    get GetMaskWidth(): number
    {
        return this._maskWidth;
    }

    set SetMaskWidth(newMaskWidth: number)
    {
        this._maskWidth = newMaskWidth;
    }

    constructor(game: Phaser.Game)
    {
        super(game);

        this.addSprite();
        this.addMask();

        this._animationEndOfBar = new Phaser.Sprite(this.game, 0, 10, 'spritesheetuiteindetimebar');
        this._animationEndOfBar.anchor.set(.25, .5);
        this._animationEndOfBar.animations.add('running');
        this._animationEndOfBar.animations.play('running', 24, true);
        this.addChild(this._animationEndOfBar);
    }

    public addSprite(): void
    {
        this._timeBackdrop = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ingame_empty_timebar');
        this.addChild(this._timeBackdrop);
        this._timeBar = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ingame_opvulling_timebar');
        this.addChild(this._timeBar);
    }

    public addMask(): void
    {
        this._timeMask = new Phaser.Graphics(this.game, 0, 0);
        this._timeMask.beginFill(0x000000);
        this._timeMask.drawRect(0, 0, this._timeBar.width, this._timeBar.height);
        requestAnimationFrame(() => {
            this._timeBar.mask = this._timeMask;
        });
        this.addChild(this._timeMask);
    }

    public startRunning(miliSeconds: number): void {
       this._runningTween = this.game.add.tween(this._timeMask).to({x: -this._timeBar.width}, miliSeconds, Phaser.Easing.Linear.None, true).
       onUpdateCallback(() => {
            this.updateColor();
       });
    }

    public increaseBar(newSeconds: number, totalseconds: number): Phaser.Signal {

        this._runningTween.pause();
        this._runningTween = null;
        this._animationEndOfBar.visible = false;
        let dx: number = -this._timeBar.width * (1 - (newSeconds / totalseconds));

        let tween: Phaser.Tween = this.game.add.tween(this._timeMask).to({x: dx}, 500, Phaser.Easing.Cubic.InOut, true);

        tween.onUpdateCallback(() => {
            this.updateColor();
        }).onComplete.addOnce(() => {
            this._animationEndOfBar.visible = true;
            this.startRunning(newSeconds * 1000);
        });
        return tween.onComplete;
    }
    private updateColor(): void {
        this._animationEndOfBar.x = this._timeMask.x + this._timeMask.width;
        let precentEmpty: number = this._timeMask.x / -this._timeBar.width;
        this._timeBar.tint = (this.rgbToHex(255 *  precentEmpty, 255 * (1 - precentEmpty), 0));
    }

    private componentToHex(c: number): string {
        let hex: string = c.toString(16);
        return hex.charAt(1) === '.' || hex.length === 1 ? '0' +  hex.substring(0, 1) : hex = hex.substring(0, 2);
    }

    private rgbToHex(r: number, g: number, b: number): any {
        return '0x' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
    }

    public destroy(): void
    {
        super.destroy(true);

        if (this._timeBar) { this._timeBar.destroy(true); }
        this._timeBar = null;

        if (this._timeBackdrop) { this._timeBackdrop.destroy(true); }
        this._timeBackdrop = null;

        if (this._timeMask) { this._timeMask.destroy(true); }
        this._timeMask = null;

        if (this._animationEndOfBar) { this._animationEndOfBar.destroy(true); }
        this._animationEndOfBar = null;

        if (this._runningTween) { this._runningTween.stop(false); }
        this._runningTween = null;

    }

}
