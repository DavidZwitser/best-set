export default class SpriteSheets
{

    public static BarEnd: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheetuiteindetimebar', frameWidth: 100, frameHeight: 100, amountOfFrames: 5};

    public static TileDestroy: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheettiledestroysprite', frameWidth: 203, frameHeight: 175, amountOfFrames: 11};

    public static TileShine: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheetshine', frameWidth: 165, frameHeight: 165, amountOfFrames: 6};

    public static Swipe: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheet_swipe', frameWidth: 77, frameHeight: 30, amountOfFrames: 16};

    public static List: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number}[] = [
        SpriteSheets.BarEnd,
        SpriteSheets.TileDestroy,
        SpriteSheets.TileShine,
        SpriteSheets.Swipe
    ];

}
