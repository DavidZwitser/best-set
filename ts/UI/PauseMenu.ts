import 'phaser-ce';
import TextButton from './TextButton';

import Constants from '../Data/Constants';

import BasePopUp from '../UI/BasePopUp';
import ImageButton from './ImageButton';

export default class PauseMenu extends BasePopUp
{

    private _continueGameButton: TextButton;
    private _sfxButton: ImageButton;
    private _musicButton: ImageButton;

    public onContinue: Phaser.Signal;

    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game, scale, buttonOffset, spaceBetweenButtons, backgroundImage);

        this._continueGameButton = new TextButton(game, 200,  buttonOffset - spaceBetweenButtons * 2, 'exitbutton', '', this.continue, this);
        this._continueGameButton.anchor.set(0.5);
        this.addChild(this._continueGameButton);

        this._sfxButton = new ImageButton(game, - spaceBetweenButtons, 80, 'ui_icon_sfx_on', this.sfxToggle, this);
        this._sfxButton.anchor.set(0.5);
        this.addChild(this._sfxButton);

        this._musicButton = new ImageButton(game, spaceBetweenButtons, 80, 'ui_icon_music_on', this.musicToggle, this);
        this._musicButton.anchor.set(0.5);
        this.addChild(this._musicButton);

        this.onContinue = new Phaser.Signal();

    }

    private continue(): void
    {
        this.visible = false;
        this.onContinue.dispatch();
    }

    private musicToggle(): void
    {
        Constants.PlayMusic = ! Constants.PlayMusic;
    }

    private sfxToggle(): void
    {
        Constants.PlaySoundEffects = ! Constants.PlaySoundEffects;
    }

    public destroy(): void
    {
        super.destroy();

        if (this._continueGameButton) { this._continueGameButton.destroy(); }
        this._continueGameButton = null;

        if (this._sfxButton) { this._sfxButton.destroy(); }
        this._sfxButton = null;

        if (this._musicButton) { this._musicButton.destroy(); }
        this._musicButton = null;

        if (this.onContinue) { this.onContinue.removeAll(); }
        this.onContinue = null;
    }
}
