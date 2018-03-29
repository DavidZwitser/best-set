import GameTile, {TileShapes, TileIcons} from './GridObjects/GameTile';
import Grid from './Grid';

/** Generates a random array of tiles */
export default class LevelGenerator
{
    /** Returns a tile array with nice generated values */
    public generateGrid(grid: Grid, createTile: (gridX: number, gridY: number, shape?: TileShapes, icon?: TileIcons) => GameTile): GameTile[]
    {
        let resultArray: GameTile[] = [];

        /** Looping trough all the grid blocks */
        for (let x: number = grid.blocksOnX; x--; )
        {
            for (let y: number = grid.blocksOnY; y--; )
            {

                /** Adding the new tiles */
                resultArray.push( createTile(
                    x,
                    y,
                    this.getRandomShape(),
                    this.getRandomIcon()
                ));

            }
        }

        return resultArray;
    }

    /** Generate a random shape from the TileShapes enum */
    private getRandomShape(): TileShapes
    {
        let enumLength: number = Object.keys(TileShapes).length;
        let randomValue: number = Math.random();

        let index: number = Math.floor(randomValue * enumLength);
        return <TileShapes>Object.keys(TileShapes)[index];
    }

    /** Generate a random icon from the TileIcons enum */
    private getRandomIcon(): TileIcons
    {
        let enumLength: number = Object.keys(TileIcons).length;
        let randomValue: number = Math.random();

        let index: number = Math.floor(randomValue * enumLength);
        return <TileIcons>Object.keys(TileIcons)[index];
    }

}
