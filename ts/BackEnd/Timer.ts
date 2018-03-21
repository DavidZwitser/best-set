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

   set SetPaused(isPaused: boolean)
   {
       isPaused = this._isPaused;
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
            if (this._countNumber <= 0)
            {
                this._hasEnded = true;
                this.stopTimer(false);
             // this.onSecond.dispose();
            }
            if (!this._isPaused || !this._hasEnded)
            {
                this._countNumber--;
                this.onSecond.dispatch();
            }
        }, 1000);
        }

    public resetTimer(resetSecond: number): void
    {
        this._countNumber = resetSecond;
    }

    // Resets the timer to the needed count (1 to 60).

    public pauseTimer(): void
    {
        clearInterval(this._setTimer);
    }
    // Pauses the timer.
    public stopTimer(pauseMenu: boolean): void
    {
        clearInterval(this._setTimer);
        this.onTimeEnd.dispatch();
    }

    // Function is called when the game ends.
    // Signal is to let other scripts know that the timer has ended.

    public addSeconds(amountAdded: number): void
    {
        this._countNumber += amountAdded;
    }

    // Function that will get used to add seconds.
    // This should be called with every succesful combination.
    // Amount depends on the score.

    public shutdown(): void
    {
        //
    }
}