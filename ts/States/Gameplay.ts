import 'phaser-ce';

import Images from '../Data/Images';

import GameField from '../Objects/GameObjects/GameField';
import GameTile from '../Objects/GridObjects/GameTile';

import PauseMenu from '../UI/PauseMenu';
import GameOverScreen from '../UI/GameOverScreen';
import Timer from '../BackEnd/Timer';
import TimeBar from '../UI/TimeBar';
import TimeBarScaler from '../BackEnd/TimeBarScaler';

import Atlases from '../Data/Atlases';
import ImageButton from '../UI/ImageButton';
import Character from '../Objects/Character';
import Constants from '../Data/Constants';
export default class Gameplay extends Phaser.State
{
    public static Name: string = 'gameplay';

    public name: string = Gameplay.Name;

    private _timeBar: TimeBar;
    private _timerClass: Timer;
    private _timeScalerClass: TimeBarScaler;

    private _gameField: GameField;

    private pauseMenuButton: ImageButton;
    private socialMenuButton: ImageButton;

    private _pauseMenu: PauseMenu;
    private _gameOverScreen: GameOverScreen;

    private _highscoreBackdropSprite: Phaser.Sprite;
    private _backgroundSprite: Phaser.Sprite;

    public currentScore: number = 0;

    private _scoreText: Phaser.Text;

    private _character: Character;

    //emitters
    private _leafEmitter: Phaser.Particles.Arcade.Emitter;

    constructor()
    {
        super();
    }

    public pause(paused: boolean): void
    {
        this.game.paused = paused;
    }

    public create(): void
    {
        super.create(this.game);

        this._backgroundSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'background');
        this.game.add.existing(this._backgroundSprite);

        this._leafEmitter = this.createLeafEmitter();

        this._character = new Character(this.game, 0, 0);

        this._gameField = new GameField(this.game);
        this.game.add.existing(this._gameField);
        this._gameField.updateScore.add(this.updateScoreText, this);

        this._highscoreBackdropSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_ingame_highscore_backdrop');
        this._highscoreBackdropSprite.anchor.set(0.5, 0);
        this.game.add.existing(this._highscoreBackdropSprite);

        this._timerClass = new Timer();
        this._timeBar = new TimeBar(this.game);
        this._timeScalerClass = new TimeBarScaler(this.game);

        this._pauseMenu = new PauseMenu(this.game, 0.6, 120, 125, Images.PopUpMenuBackground);

        this._pauseMenu.onContinue.add(this.disableMenu, this);
        this.pauseMenuButton = new ImageButton(this.game, 0, 0, '', this.activateMenu, this );
        this.game.add.existing(this.pauseMenuButton);

        this.socialMenuButton = new ImageButton(this.game, 0, 0, 'popupmenu_icon_twitter', this.activateSocial, this );
        this.game.add.existing(this.socialMenuButton);

        this._gameOverScreen = new GameOverScreen(this.game, 0.6, 120, 150, Images.PopUpMenuBackground);

        this._scoreText = new Phaser.Text(this.game, this.game.width / 2, 0, 'Score: 0', Constants.buttonTextStyle);
        this._scoreText.anchor.set(0.5, 0);
        this.game.add.existing(this._scoreText);

        this._timerClass.onTimeEnd.add(this.gameOverScreen, this);
        this.currentScore = 0;
        this.resize();
    }

    public newPathCreated(path: GameTile[]): void
    {
        console.log('new path!: ', path);
    }

    private updateScoreText(scoreIncrease: number): void
    {
        this.currentScore +=  scoreIncrease;
        this._scoreText.text = 'Score: ' + this.currentScore.toString();
    }

    private activateMenu(): void
    {
        //pause the game
        //stop the timer from moving et cetera
        this.pause(true);
        this._pauseMenu.visible = true;
        this.pauseMenuButton.visible = false;

    }
    private gameOverScreen(): void
    {
        if (this.currentScore > Constants.HighScore)
        {
            Constants.HighScore = this.currentScore;
            this._gameOverScreen.updateText(true);
        }
        else
        {
            this._gameOverScreen.updateText(false);
        }
        this.pause(true);
        this._gameOverScreen.visible = true;
    }
    private activateSocial(): void
    {
        console.log('socialiceren? NANI!');
    }

    private disableMenu(): void
    {
        this.pause(false);
        this.pauseMenuButton.visible = true;
    }

    public resize(): void {

        let vmin: number = Math.min(this.game.width, this.game.height);

        this._pauseMenu.resize();

        this._highscoreBackdropSprite.scale.set(this.game.width / GAME_WIDTH);
        this._highscoreBackdropSprite.x = this.game.width / 2;

        this._backgroundSprite.scale.set(this.game.width / GAME_WIDTH);
        this._backgroundSprite.y = 0; //this._highscoreBackdropSprite.height;

        this.pauseMenuButton.resize();
        this.pauseMenuButton.position.set(this.pauseMenuButton.width / 2, this.pauseMenuButton.height / 2);

        this.socialMenuButton.resize();
        this.socialMenuButton.position.set(this.game.width - this.pauseMenuButton.width / 2, this.pauseMenuButton.height / 2);

        this._leafEmitter.x = this.game.width / 2;
        this._leafEmitter.width = this.game.width;

        this._gameOverScreen.x = this.game.width / 2;
        this._gameOverScreen.y  = this.game.height / 2;

        this._gameField.resize();

        /* How much the space the grid can use on the screen in pixels */
        let gridHeightSpace: number =
            Math.min(

                this.game.height
                - this._backgroundSprite.height / 2
                - this._highscoreBackdropSprite.height
                + this.game.height * .08 // Offset form the background

                , vmin
            );

        this._gameField.width = this._gameField.height = gridHeightSpace;

        this._gameField.position.set(
            this.game.width / 2 - this._gameField.width / 2,
            this.game.height - this._gameField.height * .92
        );

        this._character.position.set(this.game.width / 2, this.game.height * .3);
    }

    public shutdown(): void
    {
        super.shutdown(this.game);

        this._leafEmitter.destroy(true);
        this._leafEmitter = null;

        this._gameField.destroy();
        this._gameField = null;

    }

    public createLeafEmitter(): Phaser.Particles.Arcade.Emitter{
        let emitter: Phaser.Particles.Arcade.Emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, 50);
        emitter.makeParticles(Atlases.Interface, ['particle_leaf_test2', 'particle_leaf_test1']);
        emitter.setXSpeed(-100, 100);
        emitter.setYSpeed(-1, -10);
        emitter.setRotation(0, 80);
        emitter.setAlpha(1, 2, 2000);
        emitter.setScale(1, 1, 1, 1, 2000);
        emitter.width = 600;
        emitter.start(false, 3500, 400);
        return emitter;
    }
}
