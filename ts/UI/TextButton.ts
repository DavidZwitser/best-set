import 'phaser-ce';
import Atlases from '../Data/Atlases';
import SoundManager from '../BackEnd/SoundManager';
import Sounds from '../Data/Sounds';

export default class TextButton extends Phaser.Button
{
    private _label: Phaser.BitmapText;

    constructor(game: Phaser.Game, x: number, y: number, text: string, callback: Function, callbackContext: any)
    {
        super(game, x, y, Atlases.Interface, () => {
            SoundManager.getInstance(this.game).play(Sounds.ButtonPress);
            callback();
        }, callbackContext, 'ui_menu_button', 'ui_menu_button', 'ui_menu_button');

        this.anchor.set(.5);

        this._label = new Phaser.BitmapText(game, 0, 0, 'myfont', text, 50);
        this._label.anchor.set(.5);

        this.addChild(this._label);

        this.game.add.existing(this);
    }
}
