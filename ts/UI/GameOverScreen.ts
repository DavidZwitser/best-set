import 'phaser-ce';

import Constants from '../Data/Constants';
import BasePopUp from './BasePopUp';

export default class GameOverScreen extends BasePopUp
{
    private _highScoreText: Phaser.BitmapText;
    constructor(game: Phaser.Game, scale: number, buttonOffset: number, spaceBetweenButtons: number, backgroundImage: string)
    {
        super(game, scale, buttonOffset, spaceBetweenButtons, backgroundImage);

        this._titleText.text = 'GAME OVER';

        this._highScoreText = new Phaser.BitmapText(game, 0 , buttonOffset * 2, 'myfont', 'highscore: ' + Constants.HighScore.toString());
        this.addChild(this._highScoreText);
        this._highScoreText.anchor.set(0.5);
    }

    public updateText(newHighScore: boolean): void
    {
        if (newHighScore)
        {
        this._highScoreText.text = 'New highscore! ' + Constants.HighScore.toString();
        }
        else
        {
        this._highScoreText.text = 'Try to beat the highscore ' + Constants.HighScore.toString();
        }
    }
}
