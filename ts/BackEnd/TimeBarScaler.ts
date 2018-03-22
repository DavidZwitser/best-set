import 'phaser-ce';

import TimeBar from '../UI/TimeBar';
import Timer from '../BackEnd/Timer';

export default class TimeBarScaler
{
    private _timerScript: Timer;
    private _timeBarScript: TimeBar;

    private _timeBarTotalSeconds: number;
    private _timeBarSecond: number;

    private _scalePercentage: number;

    constructor(game: Phaser.Game)
    {
        this._timerScript = new Timer();
        this._timeBarScript = new TimeBar(game);
        this._timerScript.onSecond.add(this.adjustScale, this);
    }

    public adjustScale(): void
    {
        // receive Timer.ts signal
        // adjust TimeBar.ts _maskWidth with get set
        // by signal (send parameter?)

        this._timeBarTotalSeconds = this._timerScript.MaxSeconds;
        this._timeBarSecond = this._timerScript.CountNumber;

        this._scalePercentage = (this._timeBarSecond - this._timeBarTotalSeconds) / this._timeBarTotalSeconds;

        this._timeBarScript.drawMask(this._scalePercentage);
    }

}
