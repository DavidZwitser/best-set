import Grid from '../Grid';

import LevelGenerator from '../LevelGenerator';
import PathChecker from '../../BackEnd/PathChecker';
import LineDrawer from '../LineDrawer';
import Input from '../Input';

import GridRegenerator from '../GridRegenerator';

import GameTile, {TileShapes, TileIcons} from '../GridObjects/GameTile';
import Atlases from '../../Data/Atlases';
import GridObject, { gridElementTypes } from '../GridObjects/GridObject';
import TimeBar from '../../UI/TimeBar';
import Timer from '../../BackEnd/Timer';
import SpriteSheets from '../../Data/SpriteSheets';

import Sounds from '../../Data/Sounds';
import SoundManager from '../../BackEnd/SoundManager';

/** The group that contains all the elements which are in the game field */
export default class GameField extends Phaser.Group
{
    public grid: Grid;

    private _gridSpawner: LevelGenerator;
    private _pathChecker: PathChecker;
    private _gridInput: Input;
    private _lineDrawer: LineDrawer;
    private _gridRegenerator: GridRegenerator;

    /** The path that is being drawn */
    private _currentPath: GameTile[];

    /** The grid that makes the tiles not fall out of the screen */
    private _gridMask: Phaser.Graphics;

    private _backdropSprite: Phaser.Sprite;
    private _timerBbackdropSprite: Phaser.Sprite;

    public timeBar: TimeBar;
    public updateScore: Phaser.Signal;
    public timer: Timer;

    /** The shiny animations */
    private _shineSprites: Array<Phaser.Sprite>;
    private _shineIndex: number = 0;

    /** Creating and adding all the alements for the game field */
    constructor(game: Phaser.Game)
    {
        super(game);

        this._backdropSprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_ingame_playfield_backdrop');
        this.addChild(this._backdropSprite);
        this._backdropSprite.anchor.set(.5);

        this._timerBbackdropSprite = new Phaser.Sprite(this.game, 0, -this._backdropSprite.height / 2, Atlases.Interface, 'ui_ingame_timer_backdrop');
        this._timerBbackdropSprite.anchor.set(.5, 0);

        this._backdropSprite.addChild(this._timerBbackdropSprite);

        this._gridMask = new Phaser.Graphics(this.game, 0, 0);

        this.grid = new Grid(this.game, 6, 6, 90, .9);
        this.addChild(this.grid);

        this.timeBar = new TimeBar(this.game);
        this.timeBar.position.set(-this._backdropSprite.width / 2 + 20, -this._backdropSprite.width / 2);
        this._backdropSprite.addChild(this.timeBar);

        this._gridSpawner = new LevelGenerator();
        this._pathChecker = new PathChecker();
        this._lineDrawer = new LineDrawer(game);

        this._gridRegenerator = new GridRegenerator();

        this._gridInput = new Input(this.game);

        this._currentPath = [];

        this.setupShines();

        this.setupGrid();

        this.updateScore = new Phaser.Signal();

        window.requestAnimationFrame( () => {
            this.addChild(this._gridMask);
            this.grid.mask = this._gridMask;
        });
        if (1 < 0) {
            this.clearIconFromTile(TileShapes.blue);
            this.destroyBombTiles(0, 0, true);
        }

    }

    /** The initial setup for the grid */
    private setupGrid(): void
    {
        /** Generating the grid */
        let generatedLevel: GameTile[] = this.generateNewGrid();

        /** Adding the generated grid to the actual grid */
        generatedLevel.forEach((tile: GameTile) => {
            this.grid.add(tile);
        });

        /** Asigning the input signals */
        this._gridInput.onDragSnap.add(this.addNewTileToPath, this);
        this._gridInput.onInputUp.add(this.inputRelease, this);

        this.resize();
    }

    /** Creating the shines, to place over the tiles when they need to shine! */
    private setupShines(): void {

        this._shineIndex = 0;
        this._shineSprites = [];

        for (let i: number = 0; i < 3; i++) {
            let shine: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, SpriteSheets.TileShine.name);
            shine.anchor.set(.5);
            shine.animations.add('shine');

            this.game.add.existing(shine);
            this._shineSprites.push(shine);
        }

    }

    /** Parsing the logic for creating a new tile to the grid generator and returning the generated grid */
    private generateNewGrid(): GameTile[]
    {
        return this._gridSpawner.generateGrid(this.grid, (gridX: number, gridY: number, shape: TileShapes, icon: TileIcons) => {

            return new GameTile(this.game, gridX, gridY, shape, icon);

        });
    }

    /** What happens if the input finds, the mouse is draggig over a new tile */
    private addNewTileToPath(tile: GameTile): void
    {
        /** Checking if the tile is already in the path */
        for (let i: number = this._currentPath.length; i--; )
        {
            if (tile === this._currentPath[i])
            {

                /** Removing all the tiles after the current */
                this._currentPath.splice( i + 1, this._currentPath.length - i);

                this.newPathCreated(this._currentPath);
                return;
            }
        }

        this._currentPath.push(tile);

        /** Checking if the patern is possible */
        if (
            this._currentPath.length > 1 &&
            (this._pathChecker.isPatternPossible(this._currentPath) === false ||
            this._pathChecker.isNeighbour(this._currentPath[this._currentPath.length - 2], tile) === false)
        ) {
            SoundManager.getInstance().play(Sounds.Incorrect);
            this._currentPath.pop();
            return;
        }

        /** tile will shine since it can be connected */
        this.shineOnTile(tile);

        /** A new path is created */
        this.newPathCreated(this._currentPath);
    }

    /** Place the shine on a tile */
    private shineOnTile(tile: GameTile): void {

        this._shineIndex = (this._shineIndex + 1 ) % this._shineSprites.length;
        let shine: Phaser.Sprite = this._shineSprites[this._shineIndex];

        shine.scale.set(tile.scale.x * .55);
        shine.position.set(tile.worldPosition.x, tile.worldPosition.y);
        shine.animations.play('shine', 24, false);

    }

    /** What happens when the path input is released */
    private inputRelease(): void
    {

        this._lineDrawer.clearPath();

        if (this._currentPath.length < 3)
        {
            this.cancelPath();
            return;
        }

        /** So the user can not exploid the delay between destroying and regenerating */
        if (this._currentPath[0].isBeingDestroyed === true) { return; }

        /** Animating out the tiles in the grid */
        this._currentPath[0].animateOut().addOnce(this.regenerateGrid, this);

        for (let i: number = this._currentPath.length - 1; i > 0; i-- )
        {
            this._currentPath[i].animateOut();
        }
        this.updateScore.dispatch(this._currentPath.length);
        this.timer.addSeconds(this._currentPath.length);
        SoundManager.getInstance(this.game).play(Sounds.TilesBreak);
    }

    /** Replanish the grid with new tiles */
    private regenerateGrid(): void
    {
        /** Destroy the ellements selected in the path */
        for (let i: number = this._currentPath.length; i--; )
        {
            this.grid.destroyElement(this._currentPath[i]);
        }

        /** Move the blocks that can be moved down, down */
        this._gridRegenerator.moveNeededBlocksDown(this.grid);

        /** Moving in the new elements after a delay */
        setTimeout( () => {
            this._gridRegenerator.moveInNewElements(this.grid, this.generateNewGrid());
        }, 650);

        this.cancelPath();
    }

    /** What happens when the path path get's canceled */
    private cancelPath(): void
    {
        this._currentPath.length = 0;
        this._lineDrawer.clearPath();
    }

    /** What happends when a new path is created */
    private newPathCreated(path: GameTile[]): void
    {
        this._lineDrawer.drawPath(path);
    }

    /** Remove all the icons from the tiles */
    private clearIconFromTile(color: TileShapes): void
    {
        this.grid.forEach((elem: GridObject) => {
            if (elem.gridElementType === gridElementTypes.tile) {
                if ((<GameTile>elem).shape === color) {
                    (<GameTile>elem).icon = null;
                }
            }
            return false;
        });
    }

    /** Destroy all a row or cross of tiles */
    private destroyBombTiles(xPos: number, yPos: number, cross: boolean = false): void
    {
        this._currentPath.length = 0;

        this.grid.forEach((elem: GridObject) => {
            if (elem.gridElementType === gridElementTypes.tile) {
                if (cross) {
                    if ((<GameTile>elem).gridPos.x === xPos || (<GameTile>elem).gridPos.y === yPos) {
                        this._currentPath.push((<GameTile>elem));
                    }
                } else {
                    if (Math.abs((<GameTile>elem).gridPos.x - xPos) <= 1 && Math.abs((<GameTile>elem).gridPos.y - yPos) <= 1) {
                        this._currentPath.push((<GameTile>elem));
                    }
                }
            }
            return false;
        });

        this.inputRelease();
    }

    public update(): void
    {
        /** Updating input class */
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
        super.destroy(true);

        for (let i: number = this._shineSprites.length; i--;) {
            this._shineSprites[i].destroy(true);
            this._shineSprites[i] = null;
        }
        this._shineSprites = null;

        if (this.grid) { this.grid.destroy(); }
        this.grid = null;

        this._gridSpawner = null;

        this._pathChecker = null;

        if (this._gridInput) { this._gridInput.destroy(); }
        this._gridInput = null;

        if (this._lineDrawer) { this._lineDrawer.destroy(); }
        this._lineDrawer = null;

        this._gridRegenerator = null;

        /** Visualising grid stuff */
        if (this._gridMask) { this._gridMask.destroy(true); }
        this._gridMask = null;

        if (this._backdropSprite) { this._backdropSprite.destroy(true); }
        this._backdropSprite = null;

        /** Timer stuff */
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
