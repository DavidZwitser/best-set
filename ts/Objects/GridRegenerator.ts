import GameTile from './GridObjects/GameTile';
import Grid from './Grid';
import GridObject from './GridObjects/GridObject';
import Sounds from '../Data/Sounds';
import SoundManager from '../BackEnd/SoundManager';

/**
 * This handles creating and updating the tiles
 */
export default class GridRegenerator
{

    /** Gives all the tiles which have a space beneath them */
    private getFloatingTiles(grid: Grid): GridObject[]
    {
        let elementsWithSpaceUnderneath: GridObject[] = [];

        /** Looping through the grid elements */
        grid.forEach((element: GridObject, gridX: number, gridY: number) => {

            if (
                grid.get(null, gridX, gridY + 1) === null &&
                gridY !== grid.blocksOnY - 1
            ) {
                elementsWithSpaceUnderneath.push(element);
            }

            return false;
        });

        return elementsWithSpaceUnderneath;
    }

    /** Animates down the tiles that have no block beneath them. Returns if any new tiles are moved down */
    public moveNeededBlocksDown(grid: Grid, ranCicles: number = 0): void
    {

        let floatingTiles: GridObject[] = this.getFloatingTiles(grid);

        for (let i: number = floatingTiles.length; i--; )
        {
            let currentTile: GridObject = floatingTiles[i];
            (<GameTile>currentTile).animateDown(
                grid.gridPositionToWorldPosition(
                    currentTile,
                    currentTile.gridPos.x,
                    currentTile.gridPos.y + 1
                ).y
            );
            (<GameTile>currentTile).gridPos.y = currentTile.gridPos.y + 1;

        }

        ranCicles += 1;

        if (ranCicles > grid.blocksOnY) { console.error('Grid blocks moving down buffer overflow: ', ranCicles); return; }

        if (floatingTiles.length > 0) { this.moveNeededBlocksDown(grid, ranCicles); }

    }

    /** Find out which grid spaces are empty */
    private findNewTiles(grid: Grid, newGrid: GameTile[]): GameTile[]
    {
        let newTiles: GameTile[] = [];

        /** Finding the new tiles */
        for (let i: number = newGrid.length; i--; )
        {
            let currentNewTile: GameTile = newGrid[i];
            let alreadyExists: boolean = false;

            grid.forEach((element: GridObject) => {

                if (
                    element.gridPos.x === currentNewTile.gridPos.x &&
                    element.gridPos.y === currentNewTile.gridPos.y
                ) {
                    alreadyExists = true;
                }

                return false;
            });

            if (alreadyExists === false) { newTiles.push(currentNewTile); }
        }

        return newTiles;

    }

    /** Animate the new tiles falling down */
    private animateInNewTiles(grid: Grid, newTiles: GameTile[]): void
    {
        /** Animating in the new tiles */
        for (let i: number = newTiles.length; i--; )
        {
            let currentNewTile: GameTile = newTiles[i];

            grid.add(currentNewTile);

            /** Making the animate bounce in from the top */
            currentNewTile.position.y = -currentNewTile.height * 1.2;

            currentNewTile.animateDown(

                grid.gridPositionToWorldPosition(
                    currentNewTile,
                    currentNewTile.gridPos.x,
                    currentNewTile.gridPos.y
                ).y,

                800
            );
        }

    }

    /** Move in the new elements */
    public moveInNewElements(grid: Grid, newGrid: GameTile[]): void
    {
        SoundManager.getInstance().play(Sounds.TileDrop);
        this.animateInNewTiles(grid, this.findNewTiles(grid, newGrid));

    }

}
