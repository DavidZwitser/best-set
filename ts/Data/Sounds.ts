export default class Sounds
{
    public static ButtonPress: string = 'ui_buttonpress_soundfx';
    public static Incorrect: string = 'ui_soundfx_combination_incorrect';
    public static TilesBreak: string = 'ui_soundfx_tiles_break';
    public static TileSelect1: string = 'ui_soundfx_tileselect_1';
    public static TileSelect2: string = 'ui_soundfx_tileselect_2';
    public static TileSelect3: string = 'ui_soundfx_tileselect_3';
    public static Lose: string = 'ui_soundfx_lose';
    public static NewRecord: string = 'ui_soundfx_newrecord';
    public static TileDrop: string = 'ui_soundfx_tiledrop';
    public static Ambience: string = 'bgm_ambience';

    public static list: string[] = [
        Sounds.ButtonPress,
        Sounds.Incorrect,
        Sounds.TilesBreak,
        Sounds.TileSelect1,
        Sounds.TileSelect2,
        Sounds.TileSelect3,
        Sounds.Lose,
        Sounds.NewRecord,
        Sounds.TileDrop,
        Sounds.Ambience
    ];
}
