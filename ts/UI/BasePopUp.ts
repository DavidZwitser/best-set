import 'phaser-ce';
import TextButton from './TextButton';
import Menu from '../States/Menu';
import Gameplay from '../States/Gameplay';
import Images from '../Data/Images';

/** The based class for any popup in the game */
export default class BasePopUp extends Phaser.Group
{
    private _backToMenuButton: TextButton;
    private _resetButton: TextButton;

    protected _titleText: Phaser.BitmapText;
    public _scoreText: Phaser.BitmapText;

    private _menuBackground: Phaser.Image;
    private _blackPixel: Phaser.Sprite;

    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game);

        // So there won't be a tslint errors
        spaceBetweenButtons = spaceBetweenButtons;
        buttonOffset = buttonOffset;

        this._blackPixel = new Phaser.Sprite(this.game, 0, 0, Images.BlackPixel);
        this._blackPixel.width = game.width;
        this._blackPixel.height = game.height;
        this.addChild(this._blackPixel);
        this._blackPixel.anchor.setTo(0.5);
        this._blackPixel.alpha = 0.7;

        this._resetButton = new TextButton(game, 120, 200, 'popup_button', 'Replay', this.restartScene.bind(this), this);
        this._resetButton.anchor.set(0.5);
        this._resetButton._label.tint = 0xDFC48E;
        this._resetButton._label.y = 15;
        this._resetButton._label.fontSize = 35;
        this.addChild(this._resetButton);

        this._backToMenuButton = new TextButton(game, -120, 200, 'popup_button', 'Quit', this.backToMenu.bind(this), this);
        this._backToMenuButton.anchor.set(0.5);
        this._backToMenuButton._label.tint = 0xDFC48E;
        this._backToMenuButton._label.y = 15;
        this._backToMenuButton._label.fontSize = 40;
        this.addChild(this._backToMenuButton);

        this._menuBackground = new Phaser.Image(game, 0, 0, backgroundImage);
        this._menuBackground.anchor.set(0.5);
        this.addChild(this._menuBackground);

        this._titleText = new Phaser.BitmapText(game, 0, -80, 'myfont', 'Pause', 100);
        this._titleText.tint = 0x181137;
        this._titleText.anchor.set(0.5);
        this._titleText.scale.set(scale, scale);
        this.addChild(this._titleText);

        this._scoreText = new Phaser.BitmapText(game, -150, 0, 'myfont', 'Score:', 70);
        this._scoreText.tint = 0x181137;
        this._scoreText.anchor.set(0, 0.5);
        this._scoreText.scale.set(scale, scale);
        this.addChild(this._scoreText);

        this.visible = false;

    }

    /** When back to menu is clicked */
    private backToMenu(): void
    {
        this.game.paused = false;
        this.game.state.start(Menu.Name, true, false, this.game.world.generateTexture());
    }

    /** When the restart game button is clicked */
    private restartScene(): void
    {
        this.game.paused = false;
        this.game.state.start(Gameplay.Name, true, false);
    }

    /* Resize all the elements on the base popup */
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

        if (this._scoreText) { this._scoreText.destroy(true); }
        this._scoreText = null;

        if (this._menuBackground) { this._menuBackground.destroy(true); }
        this._menuBackground = null;

        if (this._blackPixel) { this._blackPixel.destroy(true); }
        this._blackPixel = null;
    }
}
