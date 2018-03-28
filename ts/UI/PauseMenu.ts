import 'phaser-ce';
import TextButton from './TextButton';

import Constants from '../Data/Constants';

import BasePopUp from '../UI/BasePopUp';

export default class PauseMenu extends BasePopUp
{

    private _continueGameButton: TextButton;
    private _sfxButton: TextButton;
    private _musicButton: TextButton;

    public onContinue: Phaser.Signal;

    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game, scale, buttonOffset, spaceBetweenButtons, backgroundImage);

        this._continueGameButton = new TextButton(game, 0,  buttonOffset - spaceBetweenButtons * 2, 'ui_ingame_highscore_backdrop', 'Continue', this.continue, this);
        this._continueGameButton.anchor.set(0.5);
        this._continueGameButton.scale.set(scale);
        this.addChild(this._continueGameButton);

        this._sfxButton = new TextButton(game, - spaceBetweenButtons, buttonOffset +  spaceBetweenButtons, 'ui_ingame_highscore_backdrop', 'SFX', this.sfxToggle, this);
        this._sfxButton.anchor.set(0.5);
        this.addChild(this._sfxButton);
        this._sfxButton.scale.set(scale);

        this._musicButton = new TextButton(game, spaceBetweenButtons, buttonOffset + spaceBetweenButtons, 'ui_ingame_highscore_backdrop', 'M', this.musicToggle, this);
        this._musicButton.anchor.set(0.5);
        this.addChild(this._musicButton);
        this._musicButton.scale.set(scale);

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
