import GridElement, {gridElementTypes} from './GridObjects/GridObject';

export default class Grid extends Phaser.Group
{

    /** Contains all the elements */
    private _elements: GridElement[];

    private _gridBlockSize: number;
    private _gridElementSizeMultiplier: number;
    private _blocksOnX: number;
    private _blocksOnY: number;

    constructor(game: Phaser.Game, blocksOnX: number, blocksOnY: number, gridBlockSize: number, gridElementSizeMultiplier: number)
    {
        super(game);

        this._elements = [];

        this.blocksOnX = blocksOnX;
        this.blocksOnY = blocksOnY;

        this.gridBlockSize = gridBlockSize;
        this.gridElementSizeMultiplier = gridElementSizeMultiplier;

        this.inputEnableChildren = true;

        this.resize();
    }

    /** The size of the grid blocks in pixels */
    public get gridBlockSize(): number
    {
        return this._gridBlockSize;
    }
    public set gridBlockSize(value: number)
    {
        this._gridBlockSize = value;
        this.resize();
    }

    /** For scaling the grid elements seperetly from the grid block sizes */
    public get gridElementSizeMultiplier(): number
    {
        return this._gridElementSizeMultiplier;
    }
    public set gridElementSizeMultiplier(value: number)
    {
        this._gridElementSizeMultiplier = value;
        this.resize();
    }

    /** How many blocks there are on the X axis */
    public get blocksOnX(): number
    {
        return this._blocksOnX;
    }
    public set blocksOnX(value: number)
    {
        this._blocksOnX = value;
        this.resize();
    }

    /** How many blocks there are on the Y axis */
    public get blocksOnY(): number
    {
        return this._blocksOnY;
    }
    public set blocksOnY(value: number)
    {
        this._blocksOnY = value;
        this.resize();
    }

    public get elements(): GridElement[]
    {
        return this._elements;
    }

    /** Get one or multiple elements with the given properties */
    public get(element: GridElement = null, gridX: number = null, gridY: number = null, type: gridElementTypes = null, args: {property: string, value: any}[] = null): GridElement[] | GridElement
    {

        let foundItems: GridElement[] = [];

        this.forEach((currentElement: GridElement) => {

            /** Checking if it has one or multiple of the given property values */
            if (element !== null && element !== currentElement) { return false; }
            if (gridX !== null && currentElement.gridPos.x !== gridX) { return false; }
            if (gridY !== null && currentElement.gridPos.y !== gridY) { return false; }
            if (type !== null && currentElement.gridElementType !== type) { return false; }
            if (args !== null)
            {
                for (let i: number = args.length; i--; )
                {
                    if (args[i] && (<any>currentElement)[args[i].property] && (<any>currentElement)[args[i].property] !== args[i].value) { return false; }
                }
            }

            foundItems.push(currentElement);
        });

        if (foundItems.length > 1)
        {
            return foundItems;
        }
        else if (foundItems.length === 1)
        {
            return foundItems[0];
        }

        return null;
    }

    /** Add an element to the array */
    public add(element: GridElement, forceOverwite: boolean = true): boolean
    {
        if (element.gridPos.x > this.blocksOnX || element.gridPos.y > this.blocksOnY) { return false; }

        if (forceOverwite === true && this.get(null, element.gridPos.x, element.gridPos.y) !== null)
        {
            this.destroyElement(element);
        }

        this._elements.push(element);
        this.addChild(element);

        this.resizeElement(element);

        return true;
    }

    /** Returning false in the callback will destroy the element */
    public forEach(callback: (element: GridElement, gridX?: number, gridY?: number, index?: number) => boolean): void
    {

        for (let i: number = this._elements.length; i--; )
        {
            let element: GridElement = this._elements[i];

            if (!element) { continue; }

            let shouldDestroy: boolean = callback(element, element.gridPos.x, element.gridPos.y, i);
            if (shouldDestroy === true) {
                this.destroyElement(element);
            }

        }

    }

    /** Give a position on the grid, and get back the position in the game */
    public gridPositionToWorldPosition(element: GridElement, gridX: number, gridY: number): {x: number, y: number}
    {
        return {
            x: gridX * this.gridBlockSize + element.width * element.anchor.x,
            y: gridY * this.gridBlockSize + element.height * element.anchor.y
        };
    }

    /** Resize the whole grid and all it's elements */
    public resize(): void
    {
        this.forEach((element: GridElement) => {

            this.resizeElement(element);

            return false;
        });
    }

    /** Resize a single element in the grid */
    public resizeElement(element: GridElement): void
    {
        element.scale.setTo(1);
        element.scale.setTo(this.gridBlockSize * this.gridElementSizeMultiplier / element.height);

        element.x = element.gridPos.x * this.gridBlockSize + element.width * element.anchor.x;
        element.y = element.gridPos.y * this.gridBlockSize + element.height * element.anchor.y;

        element.resize();
    }

    /** Find and destroy an element */
    public destroyElement(element: GridElement): void
    {
        this.forEach( (currentElement: GridElement, x: number, y: number, index: number) => {

            /** So tslint won't give any errors */
            x = y;
            y = x;

            if (element === currentElement)
            {
                this.removeChild(this._elements[index]);
                this._elements[index].destroy(true);
                this._elements[index] = null;

                this._elements.splice(index, 1);
            }

            return false;
        });

    }

    /** Destroy the grid and all it's elements */
    public destroy(): void
    {
        super.destroy(true);

        if (!this._elements) { return; }

        for (let i: number = this._elements.length; i--; )
        {
            if (!this._elements[i]) { continue; }

            this.removeChild(this._elements[i]);
            this._elements[i].destroy(true);
            this._elements[i] = null;
        }

        this._elements = null;

    }

}
