import Grid from '../Grid';

import LevelGenerator from '../LevelGenerator';
import PathChecker from '../../BackEnd/PathChecker';
import LineDrawer from '../LineDrawer';
import Input from '../Input';

import GridRegenerator from '../GridRegenerator';

import GameTile, {TileShapes, TileIcons} from '../GridObjects/GameTile';
import Atlases from '../../Data/Atlases';
import { gridElementTypes } from '../GridObjects/GridObject';
import TimeBar from '../../UI/TimeBar';
import Timer from '../../BackEnd/Timer';

export default class GameField extends Phaser.Group
{
    public grid: Grid;

    private _gridSpawner: LevelGenerator;
    private _pathChecker: PathChecker;
    private _gridInput: Input;
    private _lineDrawer: LineDrawer;
    private _gridRegenerator: GridRegenerator;

    /* The path that is being drawn */
    private _currentPath: GameTile[];

    private _gridMask: Phaser.Graphics;

    private _backdropSprite: Phaser.Sprite;
    private _timerBbackdropSprite: Phaser.Sprite;

    public timeBar: TimeBar;
    public updateScore: Phaser.Signal;
    public timer: Timer;

    constructor(game: Phaser.Game)
    {
        super(game);

        this._backdropSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_ingame_playfield_backdrop');
        this.addChild(this._backdropSprite);
        this._backdropSprite.anchor.set(.5);

        this._timerBbackdropSprite = new Phaser.Sprite(this.game, 0, -this._backdropSprite.height / 2, Atlases.Interface, 'ui_ingame_timer_backdrop');
        this._timerBbackdropSprite.anchor.set(.5, 0);

        this._backdropSprite.addChild(this._timerBbackdropSprite);

        this._gridMask = this.game.add.graphics();

        this.grid = new Grid(this.game, 6, 6, 90, .9);
        this.addChild(this.grid);
        this.grid.mask = this._gridMask;

        this.timeBar = new TimeBar(this.game);
        this.timeBar.position.set(-this._backdropSprite.width / 2 + 20, -this._backdropSprite.width / 2);
        this._backdropSprite.addChild(this.timeBar);

        this._gridSpawner = new LevelGenerator();
        this._pathChecker = new PathChecker();
        this._lineDrawer = new LineDrawer(game);

        this._gridRegenerator = new GridRegenerator();

        this._gridInput = new Input(this.game);

        this._currentPath = [];

        this.setupGrid();

        this.updateScore = new Phaser.Signal();

        window.requestAnimationFrame( () => this.addChild(this._gridMask));

    }

    /* The initial setup for the grid */
    private setupGrid(): void
    {
        /* Generating the grid */
        let generatedLevel: GameTile[] = this.generateNewGrid();

        /* Adding the generated grid to the actual grid */
        generatedLevel.forEach((tile: GameTile) => {
            this.grid.add(tile);
        });

        /* Asigning the input signals */
        this._gridInput.onDragSnap.add(this.addNewTileToPath, this);
        this._gridInput.onInputUp.add(this.inputRelease, this);

        this.resize();
    }

    private generateNewGrid(): GameTile[]
    {
        return this._gridSpawner.generateGrid(this.grid, (gridX: number, gridY: number, shape: TileShapes, icon: TileIcons) => {

            return new GameTile(this.game, gridX, gridY, shape, icon);

        });
    }

    /* What happens if the input finds, the mouse is draggig over a new tile */
    private addNewTileToPath(tile: GameTile): void
    {
        /* Checking if the tile is already in the path */
        for (let i: number = this._currentPath.length; i--; )
        {
            if (tile === this._currentPath[i])
            {

                /* Removing all the tiles after the current */
                this._currentPath.splice( i + 1, this._currentPath.length - i);

                this.newPathCreated(this._currentPath);
                return;
            }
        }

        this._currentPath.push(tile);

        /* Checking if the patern is possible */
        if (
            this._currentPath.length > 1 &&
            (this._pathChecker.isPatternPossible(this._currentPath) === false ||
            this._pathChecker.isNeighbour(this._currentPath[this._currentPath.length - 2], tile) === false)
        ) {
            this._currentPath.pop();
            return;
        }

        /* tile will shine since it can be connected */
        tile.shine();

        /* A new path is created */
        this.newPathCreated(this._currentPath);
    }

    /* What happens when the path input is released */
    private inputRelease(): void
    {

        this._lineDrawer.clearPath();

        if (this._currentPath.length < 3)
        {
            this.cancelPath();
            return;
        }

        /* So the user can not exploid the delay between destroying and regenerating */
        if (this._currentPath[0].isBeingDestroyed === true) { return; }

        /* Animating out the tiles in the grid */
        this._currentPath[0].animateOut().addOnce(this.regenerateGrid, this);

        for (let i: number = this._currentPath.length - 1; i > 0; i-- )
        {
            this._currentPath[i].animateOut();
        }
        this.updateScore.dispatch(this._currentPath.length);
        this.timer.addSeconds(this._currentPath.length);
    }

    /* Replanish the grid with new tiles */
    private regenerateGrid(): void
    {
        for (let i: number = this._currentPath.length; i--; )
        {
            this.grid.destroyElement(this._currentPath[i]);
        }

        this._gridRegenerator.moveNeededBlocksDown(this.grid);

        setTimeout( () => {
            this._gridRegenerator.moveInNewElements(this.grid, this.generateNewGrid());
        }, 650);

        this.cancelPath();
    }

    /* What happens when the path creaton get's canceled */
    private cancelPath(): void
    {
        this._currentPath.length = 0;
        this._lineDrawer.clearPath();
    }

    /* What happends when a new path is created */
    private newPathCreated(path: GameTile[]): void
    {
        this._lineDrawer.drawPath(path, 15, 0x00ff00);
    }

    public update(): void
    {
        this._gridInput.checkInputOnTiles(<GameTile[]>this.grid.get(null, null, null, gridElementTypes.tile));
    }

    public resize(): void
    {
        let vmin: number = Math.min(this.game.width, this.game.height);

        let gridSizeMultiplier: number = vmin * 0.88;
        this.grid.gridBlockSize = gridSizeMultiplier / this.grid.blocksOnX;

        this.grid.position.set(
            this.game.width / 2 - this.grid.width / 2,
            0
        );

        this._backdropSprite.position.set(
            this.grid.x + this.grid.width / 2,
            this.grid.y + this.grid.height / 2 - 10
        );
        this._backdropSprite.scale.set(vmin / 720);

        this._gridMask.clear();
        this._gridMask.beginFill(0xff0ff0);
        this._gridMask.drawRect(this.grid.x, this.grid.y, this.grid.width, this.grid.height);
        this._gridMask.endFill();

    }

    public destroy(): void
    {
        if (this.grid) { this.grid.destroy(); }
        this.grid = null;

        this._gridSpawner = null;

        this._pathChecker = null;

        if (this._gridInput) { this._gridInput.destroy(); }
        this._gridInput = null;

        if (this._lineDrawer) { this._lineDrawer.destroy(); }
        this._lineDrawer = null;

        this._gridRegenerator = null;

        /* Visualising grid stuff */
        if (this._gridMask) { this._gridMask.destroy(true); }
        this._gridMask = null;

        if (this._backdropSprite) { this._backdropSprite.destroy(true); }
        this._backdropSprite = null;

        /* Timer stuff */
        if (this._timerBbackdropSprite) { this._timerBbackdropSprite.destroy(true); }
        this._timerBbackdropSprite = null;

        if (this.timeBar) { this.timeBar.destroy(); }
        this.timeBar = null;

        if (this.updateScore) { this.updateScore.removeAll(); }
        this.updateScore = null;

        if (this.timer) { this.timer.destroy(); }
        this.timer = null;

    }

}
