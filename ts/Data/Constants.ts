import 'phaser-ce';

import SaveData from '../BackEnd/SaveData';

/**
 * All the information that should be accassible from anywhere
 */
export default class Constants
{
    public static PlayMusic: boolean;
    public static PlaySoundEffects: boolean;
    public static buttonTextStyle: Phaser.PhaserTextStyle = {
        font: '50px',
        fill: '#fff',
        align: 'center'
    };

    public static get HighScore(): number
    {
        return SaveData.Highscore;
    }
    public static set HighScore(value: number)
    {
        if (value < SaveData.Highscore) { return; }
        SaveData.Highscore = value;
    }

    public static CurrentScore: number;
}
