import 'phaser-ce';
import TextButton from './TextButton';
import Menu from '../States/Menu';
import Gameplay from '../States/Gameplay';
import Images from '../Data/Images';

export default class BasePopUp extends Phaser.Group
{
    private _backToMenuButton: TextButton;
    private _resetButton: TextButton;

    protected _titleText: Phaser.BitmapText;

    private _menuBackground: Phaser.Image;
    private _blackPixel: Phaser.Sprite;

    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game);

        this._blackPixel = new Phaser.Sprite(this.game, 0, 0, Images.BlackPixel);
        this._blackPixel.width = game.width;
        this._blackPixel.height = game.height;
        this.addChild(this._blackPixel);
        this._blackPixel.anchor.setTo(0.5);
        this._blackPixel.alpha = 0.5;

        this._menuBackground = new Phaser.Image(game, 0, 0, backgroundImage);
        this._menuBackground.anchor.set(0.5);
        this.addChild(this._menuBackground);

        this._titleText = new Phaser.BitmapText(game, 0, buttonOffset - spaceBetweenButtons * 3, 'myfont', 'Pause', 80);
        this._titleText.anchor.set(0.5);
        this._titleText.scale.set(scale, scale);
        this.addChild(this._titleText);

        this._backToMenuButton = new TextButton(game, 0, buttonOffset - spaceBetweenButtons, 'ui_ingame_highscore_backdrop', 'Back To Menu', this.backToMenu.bind(this), this);
        this._backToMenuButton.anchor.set(0.5);
        this.addChild(this._backToMenuButton);
        this._backToMenuButton.scale.set(scale);
        this.visible = false;

        this._resetButton = new TextButton(game, 0, buttonOffset, 'ui_ingame_highscore_backdrop', 'Reset Game', this.restartScene.bind(this), this);
        this._resetButton.anchor.set(0.5);
        this.addChild(this._resetButton);
        this._resetButton.scale.set(scale);
    }

    private backToMenu(): void
    {
        this.game.paused = false;
        this.game.state.start(Menu.Name, true, false, this.game.world.generateTexture());
    }

    private restartScene(): void
    {
        this.game.paused = false;
        this.game.state.start(Gameplay.Name, true, false);
    }
    public resize(): void {
        this._blackPixel.width = this.game.width;
        this._blackPixel.height = this.game.height;
        this._blackPixel.scale.set(this.scale.x * 10000);
    }

    public destroy(): void
    {
        super.destroy(true);

        if (this._backToMenuButton) { this._backToMenuButton.destroy(); }
        this._backToMenuButton = null;

        if (this._resetButton) { this._resetButton.destroy(); }
        this._resetButton = null;

        if (this._titleText) { this._titleText.destroy(true); }
        this._titleText = null;

        if (this._menuBackground) { this._menuBackground.destroy(true); }
        this._menuBackground = null;

        if (this._blackPixel) { this._blackPixel.destroy(true); }
        this._blackPixel = null;
    }
}
