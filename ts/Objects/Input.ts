import GameTile from './GridObjects/GameTile';

/**
 * Fires a input snap signal when dragging over a new tile
 */
export default class Input
{
    public  game: Phaser.Game;

    public onDragSnap: Phaser.Signal;
    public onInputUp: Phaser.Signal;

    private _hitAreaMultiplier: number;

    private _currentSnap: GameTile;

    constructor(game: Phaser.Game, hitAreaMultiplier: number = .8)
    {
        this.game = game;

        this.onDragSnap = new Phaser.Signal();
        this.onInputUp = new Phaser.Signal();

        this._hitAreaMultiplier = hitAreaMultiplier;

        this.game.input.onUp.add(() => this.inputUp());
    }

    /** For when the input is up */
    private inputUp(): void
    {
        this._currentSnap = null;
        this.onInputUp.dispatch();
    }

    /** Call this in the update so that the class will fire it's 'onDragSnap' signal when a new tile is snapped */
    public checkInputOnTiles(checkTiles: GameTile[]): void
    {
        if (this.game.input.activePointer.isDown === false) { return; }

        for (let i: number = checkTiles.length; i--; )
        {
            let currentTile: GameTile = checkTiles[i];
            let currentBounds: PIXI.Rectangle = currentTile.getBounds();

            /** Multiplieng the hit area of a tile so it can be easier to drag to side ways tiles */
            currentBounds.width *= this._hitAreaMultiplier;
            currentBounds.height *= this._hitAreaMultiplier;

            /** Checking if the mouse is in the tile */
            if (currentBounds.contains(this.game.input.x, this.game.input.y) === false) { continue; }

            if (this._currentSnap === currentTile) { return; }

            this._currentSnap = currentTile;
            this.onDragSnap.dispatch(currentTile);
        }

    }

    /** Removing all the elements from Input */
    public destroy(): void
    {
        this.onDragSnap.removeAll();
        this.onDragSnap = null;

        this.onInputUp.removeAll();
        this.onInputUp = null;

        this._currentSnap = null;
    }
}
