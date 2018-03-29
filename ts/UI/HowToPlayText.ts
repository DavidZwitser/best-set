import 'phaser-ce';

export default class HowToPlayText
{
    public _htpText_1: string = 'How to play the game?\nLike this:\nAnd this:\nHowToPlay\n';
    public _htpText_2: string = 'HowToPlay\nText\nTwo';
    public _htpText_3: string = 'HowToPlay\nText\nThree';

    get GetHtpText_One(): string
    {
        return this._htpText_1;
    }

    get GetHtpText_Two(): string
    {
        return this._htpText_2;
    }

    get GetHtpText_Three(): string
    {
        return this._htpText_3;
    }



}
