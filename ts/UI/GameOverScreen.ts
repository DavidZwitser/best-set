import 'phaser-ce';
import TextButton from './TextButton';
import Constants from '../Data/Constants';
import Menu from '../States/Menu';
import Gameplay from '../States/Gameplay';

export default class GameOverScreen extends Phaser.Group
{
    private _retryButton: TextButton;
    private _menuButton: TextButton;

    private _screenBackground: Phaser.Image;
    private _gameOverText: Phaser.Text;

    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game);
        this._screenBackground = new Phaser.Image(game, 0, 0, backgroundImage);
        this._screenBackground.anchor.set(0.5);
        this.addChild(this._screenBackground);

        this._retryButton = new TextButton(game, 0, buttonOffset, 'Retry', Constants.buttonTextStyle, this.restartScene, this);
        this.addChild(this._retryButton);

        this._menuButton = new TextButton(game, 0, buttonOffset - spaceBetweenButtons, 'Main Menu', Constants.buttonTextStyle, this.backToMenu, this);
        this.addChild(this._menuButton);

        this._gameOverText = new Phaser.Text(game, 0, buttonOffset - spaceBetweenButtons * 2, 'GAME OVER');
        this.addChild(this._gameOverText);

        this.visible = false;
    }

    public resize(): void
    {
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
    }

    private backToMenu(): void
    {
        this.game.paused = false;
        this.game.state.start(Menu.Name);
    }

    private restartScene(): void
    {
        this.game.paused = false;
        this.game.state.start(Gameplay.Name);
    }
}
