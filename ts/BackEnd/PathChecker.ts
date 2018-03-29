import 'phaser-ce';
import GameTile, { TileIcons, TileShapes } from '../Objects/GridObjects/GameTile';

export default class PathChecker
{

    /* Returns if a tile is a neighbour of the current tile */
    public isNeighbour(currentTile: GameTile, possibleTile: GameTile, neighbourRange: number = 1): boolean
    {
        let minX: number = currentTile.gridPos.x - neighbourRange;
        let minY: number = currentTile.gridPos.y - neighbourRange;
        let maxX: number = currentTile.gridPos.x + neighbourRange;
        let maxY: number = currentTile.gridPos.y + neighbourRange;

        if  (
            (possibleTile.gridPos.x >= minX && possibleTile.gridPos.x <= maxX) &&
            (possibleTile.gridPos.y >= minY && possibleTile.gridPos.y <= maxY)
        ) {
            return true;
        }

        return false;
    }

    /* Returns true if a patern is possible */
    public isPatternPossible(tiles: GameTile[]): boolean
    {
        let icons: TileIcons[] = [];
        let shapes: TileShapes[] = [];

        for (let i: number = tiles.length; i--; )
        {
            if (tiles[i].icon) { icons.push(tiles[i].icon); }
            if (tiles[i].shape) { shapes.push(tiles[i].shape); }
        }

        /* If a path is all opposite or all the same, return true */
        let isCorrect: boolean =
                !((!this.everyValueIsTheSame(icons) && !this.everyValueIsDifferent(icons)) ||
                (!this.everyValueIsTheSame(shapes) && !this.everyValueIsDifferent(shapes)));

        return isCorrect;
    }

    /* Returns true if every value is the same */
    private everyValueIsTheSame(arr: any): boolean
    {
        let _value: any = arr[0];

        for (let i: number = 0; i < arr.length; i++)
        {
            if (_value !== arr[i])
            {
                return false;
            }
        }

        return true;
    }

    /* Returns true if every value is different */
    private everyValueIsDifferent(arr: any): boolean
    {
        let _counts: any = [];

        for (let i: number = arr.length; i--; )
        {
            if (_counts[arr[i]] === undefined)
            {
                _counts[arr[i]] = 1;
            }
            else
            {
                return false;
            }
        }

        return true;
    }
}
