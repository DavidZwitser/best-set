import 'phaser-ce';

import SaveData from '../BackEnd/SaveData';

export default class Constants
{
    public static PlayMusic: boolean;
    public static PlaySoundEffects: boolean;
    public static buttonTextStyle: Phaser.PhaserTextStyle = {font: '50px',
    fill: '#fff',
    align: 'center' };

    public static get HighScore(): number
    {
        return SaveData.highscore;
    }
    public static set HighScore(value: number)
    {
        if (value < SaveData.highscore) { return; }
        SaveData.highscore = value;
    }

    public static CurrentScore: number;
}
