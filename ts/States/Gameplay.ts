import 'phaser-ce';
 
import Images from '../Data/Images';
 
import GameField from '../Objects/GameObjects/GameField';
import GameTile from '../Objects/GridObjects/GameTile';
 
import PauseMenu from '../UI/PauseMenu';

import Timer from '../BackEnd/Timer';
import TimeBar from '../UI/TimeBar';
import TimeBarScaler from '../BackEnd/TimeBarScaler';

import Atlases from '../Data/Atlases';
import ImageButton from '../UI/ImageButton';
import Character from '../Objects/Character';
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

    private _highscoreBackdropSprite: Phaser.Sprite;
    private _backgroundSprite: Phaser.Sprite;

    private _character: Character;

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

        this._character = new Character(this.game, 0, 0);

        this._gameField = new GameField(this.game);
        this.game.add.existing(this._gameField);

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
        this.resize();
    }

    public newPathCreated(path: GameTile[]): void
    {
        console.log('new path!: ', path);
    }

    private activateMenu(): void
    {
        //pause the game
        //stop the timer from moving et cetera
        this.pause(true);
        this._pauseMenu.visible = true;
        this.pauseMenuButton.visible = false;
 
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
        this._backgroundSprite.y = this._highscoreBackdropSprite.height;
 
        this.pauseMenuButton.resize();
        this.pauseMenuButton.position.set(this.pauseMenuButton.width / 2, this.pauseMenuButton.height / 2);
 
        this.socialMenuButton.resize();
        this.socialMenuButton.position.set(this.game.width - this.pauseMenuButton.width / 2, this.pauseMenuButton.height / 2);
 
        this._gameField.resize();
 
        /* How much the space the grid can use on the screen in pixels */
        let gridHeightSpace: number =
            Math.min(
 
                this.game.height
                - this._backgroundSprite.height
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
 
        this._gameField.destroy();
        this._gameField = null;
 
    }
 
}