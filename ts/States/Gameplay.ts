import 'phaser-ce';

import Images from '../Data/Images';

import GameField from '../Objects/GameObjects/GameField';

import PauseMenu from '../UI/PauseMenu';
import GameOverScreen from '../UI/GameOverScreen';
import Timer from '../BackEnd/Timer';

import Atlases from '../Data/Atlases';
import ImageButton from '../UI/ImageButton';
import Character from '../Objects/Character';
import Constants from '../Data/Constants';

import StateTransition from '../Effects/StateTransition';
import SoundManager from '../BackEnd/SoundManager';
import Sounds from '../Data/Sounds';

export default class Gameplay extends Phaser.State
{
    public static Name: string = 'gameplay';

    public name: string = Gameplay.Name;

    private _transitionBackdrop: Phaser.Sprite;

    private _timerClass: Timer;

    private _gameField: GameField;

    private pauseMenuButton: ImageButton;
    private socialMenuButton: ImageButton;

    private _pauseMenu: PauseMenu;

    private _highscoreBackdropSprite: Phaser.Sprite;
    private _backgroundSprite: Phaser.Sprite;

    public currentScore: number = 0;

    private _scoreText: Phaser.BitmapText;
    private _highScoreText: Phaser.BitmapText;

    private _character: Character;

    private _gameOverScreen: GameOverScreen;
    //emitters
    private _leafEmitter: Phaser.Particles.Arcade.Emitter;

    constructor()
    {
        super();
    }

    public pause(paused: boolean): void
    {
        this.game.paused = paused;
        this._timerClass.pause(paused);
        this._character.pause(paused);
    }

    public init(worldSnapshot: Phaser.RenderTexture): void
    {
        if (!worldSnapshot) { return; }
        this._transitionBackdrop = this.game.add.sprite(this.game.width / 2, 0, worldSnapshot);
        this._transitionBackdrop.anchor.set(.5, 1);

        window.addEventListener('blur', () => {
            this.pause(true);
        });
        window.addEventListener('focus', () => {
            this.pause(false);
        });

    }

    public create(): void
    {
        super.create(this.game);

        this._backgroundSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'background');
        this.game.add.existing(this._backgroundSprite);

        this._character = new Character(this.game, this.game.width / 2, this.game.height * .4);
        this._leafEmitter = this.createLeafEmitter();

        this._gameField = new GameField(this.game);
        this.game.add.existing(this._gameField);

        this._highscoreBackdropSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_ingame_highscore_backdrop');
        this._highscoreBackdropSprite.anchor.set(0.5, 0);
        this.game.add.existing(this._highscoreBackdropSprite);

        this._timerClass = new Timer(this._gameField.timeBar);
        this._gameField.timer = this._timerClass;

        this._pauseMenu = new PauseMenu(this.game, 0.6, 120, 125, Images.PopUpMenuBackground);

        this._pauseMenu.onContinue.add(this.disableMenu.bind(this), this);
        this.pauseMenuButton = new ImageButton(this.game, 0, 0, 'ui_ingame_button_pause', this.activateMenu.bind(this), this );
        this.game.add.existing(this.pauseMenuButton);

        this.socialMenuButton = new ImageButton(this.game, 0, 0, 'ui_ingame_button_share', this.activateSocial.bind(this), this );
        this.game.add.existing(this.socialMenuButton);

        this._gameOverScreen = new GameOverScreen(this.game, 0.6, 120, 125, Images.PopUpMenuBackground);

        this._scoreText = this.game.add.bitmapText(0, 0, 'myfont', 'Score: 0');
        this._scoreText.fontSize = 40;
        this._scoreText.anchor.set(0.5, 0);

        this._highScoreText = this.game.add.bitmapText(0, 0, 'myfont', 'Highscore: ' + Constants.HighScore);
        this._highScoreText.fontSize = 15;
        this._highScoreText.anchor.set(0.5, 0);

        this._timerClass.onTimeEnd.add(this.gameOverScreen, this);
        this._gameField.updateScore.add(this.updateScoreText.bind(this));
        this.currentScore = 0;

        this._pauseMenu = new PauseMenu(this.game, 0.6, 120, 125, Images.PopUpMenuBackground);
        this._pauseMenu.onContinue.add(this.disableMenu, this);

        this.resize();

        if (!this._transitionBackdrop) { return; }
        StateTransition.InFromBottom(this.game, () => {
            this._transitionBackdrop.destroy(true);
            this._transitionBackdrop = null;
        });

    }

    private updateScoreText(scoreIncrease: number): void
    {
        this.currentScore += scoreIncrease;
        this._scoreText.text = 'Score: ' + this.currentScore.toString();
        this._character.combo();
    }

    private activateMenu(): void
    {
        //pause the game
        //stop the timer from moving et cetera
        this.pause(true);
        this._pauseMenu.visible = true;
        this._pauseMenu._scoreText.text = 'Score: ' + this.currentScore;
        this.pauseMenuButton.inputEnabled = false;

    }
    private gameOverScreen(): void
    {
        this._character.lose();

        this._gameOverScreen._scoreText.text = 'Score: ' + this.currentScore;
        if (this.currentScore > Constants.HighScore)
        {
            Constants.HighScore = this.currentScore;
            SoundManager.getInstance().play(Sounds.NewRecord);
            this._gameOverScreen.updateText(true);
        }
        else
        {
            SoundManager.getInstance().play(Sounds.Lose);
            this._gameOverScreen.updateText(false);
        }
        //this.pause(true);
        this._gameOverScreen.visible = true;
    }
    private activateSocial(): void
    {
        window.open(
            'https://twitter.com/share?text=Checkout%20this%20awesome%20game!%0A%23demo%20%23indiedev%0A',
            '',
            'menubar=no, toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600'
        );
    }

    private disableMenu(): void
    {
        this.pause(false);
        this.pauseMenuButton.inputEnabled = true;
    }

    public resize(): void
    {

        let vmin: number = Math.min(this.game.width, this.game.height);

        this._highscoreBackdropSprite.scale.set(this.game.width / GAME_WIDTH);
        this._highscoreBackdropSprite.x = this.game.width / 2;

        this._backgroundSprite.width = this.game.width;
        this._backgroundSprite.height = this.game.height;

        this.pauseMenuButton.resize();
        this.pauseMenuButton.position.set(this.pauseMenuButton.width / 2, this.pauseMenuButton.height / 2);

        this.socialMenuButton.resize();
        this.socialMenuButton.position.set(this.game.width - this.pauseMenuButton.width / 2, this.pauseMenuButton.height / 2);

        this._leafEmitter.x = this.game.width / 2;
        this._leafEmitter.width = this.game.width;

        this._gameField.resize();

        /* How much the space the grid can use on the screen in pixels */
        let gridHeightSpace: number =
            Math.min(

                this.game.height
                - this._backgroundSprite.height / 2
                - this._highscoreBackdropSprite.height
                + this.game.height * .14 // Offset form the background

                , vmin
            );

        this._gameField.width = this._gameField.height = gridHeightSpace;

        this._gameField.position.set(
            this.game.width / 2 - this._gameField.width / 2,
            this.game.height - this._gameField.height * .92
        );

        this._gameOverScreen.x = this.game.width / 2;
        this._gameOverScreen.y  = this.game.height / 2;
        this._gameOverScreen.scale.set(vmin / GAME_WIDTH);
        this._gameOverScreen.resize();

        this._pauseMenu.x = this.game.width / 2;
        this._pauseMenu.y = this.game.height / 2;
        this._pauseMenu.scale.set(vmin / GAME_WIDTH);
        this._pauseMenu.resize();

        vmin = Math.min(this.game.width, this.game.height / (GAME_HEIGHT / GAME_WIDTH));

        this._character.scale.set((vmin / GAME_WIDTH) * .3);
        this._character.position.set(this.game.width / 2, this.game.height * .4);

        this._scoreText.x = this.game.width / 2;
        this._scoreText.y = this.game.width * 0.02;
        this._scoreText.scale.set(this.game.width / GAME_WIDTH, this.game.width / GAME_WIDTH);
        this._highScoreText.x = this.game.width / 2;
        this._highScoreText.y = this.game.width * 0.08;
        this._highScoreText.scale.set(this.game.width / GAME_WIDTH, this.game.width / GAME_WIDTH);

    }

    public shutdown(): void
    {
        super.shutdown(this.game);

        if (this._transitionBackdrop) { this._transitionBackdrop.destroy(true); }
        this._transitionBackdrop = null;

        if (this._timerClass) { this._timerClass.destroy(); }
        this._timerClass = null;

        if (this._leafEmitter) { this._leafEmitter.destroy(true); }
        this._leafEmitter = null;

        if (this._gameField) { this._gameField.destroy(); }
        this._gameField = null;

        if (this.pauseMenuButton) { this.pauseMenuButton.destroy(); }
        this.pauseMenuButton = null;

        if (this.socialMenuButton) { this.socialMenuButton.destroy(); }
        this.socialMenuButton = null;

        if (this._pauseMenu) { this._pauseMenu.destroy(); }
        this._pauseMenu = null;

        if (this._gameOverScreen) { this._gameOverScreen.destroy(); }
        this._gameOverScreen = null;

        if (this._highscoreBackdropSprite) { this._highscoreBackdropSprite.destroy(true); }
        this._highscoreBackdropSprite =  null;

        if (this._backgroundSprite) { this._backgroundSprite.destroy(true); }
        this._backgroundSprite = null;

        if (this._scoreText) { this._scoreText.destroy(true); }
        this._scoreText = null;

        if (this._character) { this._character.destroy(); }
        this._character = null;

        window.addEventListener('blur', null);
        window.addEventListener('focus', null);
    }

    public createLeafEmitter(): Phaser.Particles.Arcade.Emitter
    {
        let emitter: Phaser.Particles.Arcade.Emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, 50);
        emitter.makeParticles(Atlases.Interface, ['particle_leaf_test2', 'particle_leaf_test1']);
        emitter.setXSpeed(-100, 100);
        emitter.setYSpeed(-1, -10);
        emitter.setRotation(0, 80);
        emitter.setAlpha(1, 2, 2000);
        emitter.setScale(-1, 1, 1, 1, 3000, Phaser.Easing.Sinusoidal.InOut, true);
        emitter.width = 600;
        emitter.start(false, 3500, 400);
        return emitter;
    }
}
