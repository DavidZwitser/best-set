import 'phaser-ce';

import Atlases from '../../Data/Atlases';

export enum gridElementTypes {
    generic = 'generic',
    tile = 'tile'
}

/** The base class for an ellement that lives in the greid */
export default class GridObject extends Phaser.Sprite
{
    public gridPos: {x: number, y: number};
    public readonly gridElementType: gridElementTypes;

    constructor(game: Phaser.Game, gridX: number, gridY: number, frameName: string, type: gridElementTypes = gridElementTypes.generic)
    {
        super(game, 0, 0, Atlases.Interface, frameName);
        this.anchor.set(.5);

        this.gridElementType = type;

        this.gridPos = {x: gridX, y: gridY};
    }

    public resize(): void
    {
        //
    }

}
