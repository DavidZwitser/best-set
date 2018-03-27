export default class SpriteSheets
{

    public static BarEnd: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheetuiteindetimebar', frameWidth: 100, frameHeight: 100, amountOfFrames: 5};

    public static TileDestroy: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheettiledestroysprite', frameWidth: 203, frameHeight: 175, amountOfFrames: 11};

    public static TileShine: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'spritesheetshine', frameWidth: 165, frameHeight: 165, amountOfFrames: 6};

    public static Orb: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number} =
    { name: 'orb', frameWidth: 150, frameHeight: 150, amountOfFrames: 10};

    public static list: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number}[] = [
        SpriteSheets.BarEnd,
        SpriteSheets.TileDestroy,
        SpriteSheets.TileShine,
        SpriteSheets.Orb
    ];

}
