import 'phaser-ce';
export default class Constants
{
    public static PlayMusic: boolean;
    public static PlaySoundEffects: boolean;
    public static buttonTextStyle: Phaser.PhaserTextStyle = {font: '50px',
    fill: '#fff',
    align: 'center' };

    public static HighScore: number = 20;
    public static CurrentScore: number;
}
