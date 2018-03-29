import 'phaser-ce';
import Atlases from '../Data/Atlases';

export default class TextButton extends Phaser.Button
{
    public _label: Phaser.BitmapText;

    constructor(game: Phaser.Game, x: number, y: number, key: string, text: string, callback: Function, callbackContext: any)
    {
        super(game, x, y, Atlases.Interface, callback, callbackContext, key, key, key);

        this.anchor.set(.5);

        this._label = new Phaser.BitmapText(game, 0, 0, 'myfont', text, 50);
        this._label.anchor.set(.5);

        this.addChild(this._label);

        this.game.add.existing(this);
    }

    public destroy(): void
    {
        if (this._label) { this._label.destroy(true); }
        this._label = null;
    }
}
