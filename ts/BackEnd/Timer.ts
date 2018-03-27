import 'phaser-ce';
import _TimeBar from '../UI/TimeBar';

export default class Timer
{

   private _setTimer: any;

   private _countNumber: number = 30;
   private _maxSeconds: number = 30;
   private _startPeriod: number = 0;

   private _isPaused: boolean;

   public onSecond: Phaser.Signal;
   public onTimeEnd: Phaser.Signal;

   private _timeBar: _TimeBar;

   get CountNumber(): number
   {
       return this._countNumber;
   }

   get MaxSeconds(): number
   {
       return this._maxSeconds;
   }

   get GetPaused(): boolean
   {
       return this._isPaused;
   }

    constructor(_timebar: _TimeBar)
    {
        this.startTimer();
        this._timeBar = _timebar;
        this._timeBar.startRunning(this.MaxSeconds * 1000);
        this.onTimeEnd = new Phaser.Signal();
        this.onSecond = new Phaser.Signal();
    }

    public startTimer(): void
    {
        this._startPeriod = Date.now();

        this._setTimer = setTimeout( () => {
            this.stopTimer();
        }, this._countNumber * 1000);

    }

    public pause(pause: boolean): void
    {
        if (pause) {
            this._countNumber -= (Date.now() - this._startPeriod) / 1000;
            clearTimeout(this._setTimer);
        } else {
            this.startTimer();
        }
    }

    public resumeTimer(): void {
        this.startTimer();
    }

    public stopTimer(): void
    {
        this.onTimeEnd.dispatch();
    }

    public addSeconds(amountAddedInSeconds: number): void
    {
        this.pause(true);
        this._countNumber = Math.min(this._countNumber + amountAddedInSeconds, this._maxSeconds);

        this._timeBar.increaseBar(this._countNumber, this.MaxSeconds).addOnce(() => {
            this.pause(false);
        });
    }

    public destroy(): void
    {
        this.pause(true);
        this._setTimer = null;

        if (this.onSecond) { this.onSecond.removeAll(); }
        this.onSecond = null;

        if (this.onTimeEnd) { this.onTimeEnd.removeAll(); }
        this.onTimeEnd = null;

        if (this._timeBar) { this._timeBar.destroy(); }
        this._timeBar = null;
    }
}
