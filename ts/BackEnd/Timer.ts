import 'phaser-ce';

export default class Timer
{

   private _setTimer: any;

   private _countNumber: number = 60;
   private _maxSeconds: number = 60;

   private _isPaused: boolean;
   private _hasEnded: boolean;

   public onSecond: Phaser.Signal;
   public onTimeEnd: Phaser.Signal;

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

    constructor()
    {
        this.startTimer();
        this.onTimeEnd = new Phaser.Signal();
    }

    public startTimer(): void
    {
        this.onSecond = new Phaser.Signal();

        this._setTimer = setInterval(() =>
        {

            if (this._countNumber < 1)
             {
                 this._hasEnded = true;
                 this.stopTimer();
                // this.onSecond.dispose();
             }

            if (!this._isPaused && !this._hasEnded)
            {
                this._countNumber--;
                this.onSecond.dispatch();
             }
        }, 1000);
    }

    public resetTimer (resetSecond: number): void
    {
        this._countNumber = resetSecond;
    }

    public pauseTimer(): void
    {
        clearInterval(this._setTimer);
    }

    public stopTimer(): void
    {
        clearInterval(this._setTimer);

        this.onTimeEnd.dispatch();
    }

    public addSeconds(amountAdded: number): void
    {
        this._countNumber += amountAdded;
    }

    public shutdown(): void
    {
        //
    }
}
