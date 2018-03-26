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
    private _highScoreText: Phaser.Text;

    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game);
        this.scale.set(scale);
        this._screenBackground = new Phaser.Image(game, 0, 0, backgroundImage);
        this._screenBackground.anchor.set(0.5);
        this.addChild(this._screenBackground);

        this._retryButton = new TextButton(game, 0, buttonOffset, 'Retry', this.restartScene, this);
        this.addChild(this._retryButton);

        this._menuButton = new TextButton(game, 0, buttonOffset - spaceBetweenButtons, 'Main Menu', this.backToMenu, this);
        this.addChild(this._menuButton);

        this._gameOverText = new Phaser.Text(game, 0, buttonOffset - spaceBetweenButtons * 2, 'GAME OVER', Constants.buttonTextStyle);
        this.addChild(this._gameOverText);
        this._gameOverText.anchor.set(0.5);

        this._highScoreText = new Phaser.Text(game, 0, buttonOffset * 2, 'highscore: ' + Constants.HighScore.toString(), Constants.buttonTextStyle);
        this.addChild(this._highScoreText);
        this._highScoreText.anchor.set(0.5);

        this.visible = false;
    }

    public updateText(newHighScore: boolean): void
    {
        if (newHighScore)
        {
        this._highScoreText.text = 'New highscore! ' + Constants.HighScore.toString();
        }
        else
        {
        this._highScoreText.text = 'Try to beat the highscore ' + Constants.HighScore.toString();
        }
    }

    private backToMenu(): void
    {
        this.game.paused = false;
        this.game.state.start(Menu.Name, true, false, this.game.world.generateTexture());
    }

    private restartScene(): void
    {
        this.game.paused = false;
        this.game.state.start(Gameplay.Name);
    }
}
