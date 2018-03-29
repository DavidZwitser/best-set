import 'phaser-ce';
import Atlases from '../Data/Atlases';
import SoundManager from '../BackEnd/SoundManager';
import Sounds from '../Data/Sounds';

/** A button with an image on it */
export default class ImageButton extends Phaser.Button
{
    /** The image on the button */
    private _image: Phaser.Sprite;
    /** The factor the button get's scaled with (changes when clicking) */
    private _scaleFactor: number = 1;

    /* Creating all the elements on the image button */
    constructor(
        game: Phaser.Game, x: number, y: number, key: string, callback: Function, callbackContext: any)
        {
        super(game, x, y, Atlases.Interface, () => {
            SoundManager.getInstance(this.game).play(Sounds.ButtonPress);
            callback();
        }, callbackContext, 'ui_ingame_button', 'ui_ingame_button', 'ui_ingame_button');

        this.anchor.set(.5);

        this._image = new Phaser.Sprite(game, 0, 0, Atlases.Interface, key);
        this._image.anchor.set(.5);

        this.addChild(this._image);

        this.onInputDown.add(() => {
            this._scaleFactor = 0.9;
            this.resize();

        });
        this.onInputOut.add(() => {
            this._scaleFactor = 1;
            this.resize();
        });
        this.onInputUp.add(() => {
            this._scaleFactor = 1;
            this.resize();
        });
    }

    public resize(): void
    {
        let vmin: number = Math.min(this.game.width, this.game.height / 2);
        this.scale.set((vmin / GAME_WIDTH) *  this._scaleFactor);
    }

    public destroy(): void
    {
        super.destroy(true);

        if (this._image) { this._image.destroy(true); }
        this._image = null;
    }
}
