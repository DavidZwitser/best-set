import 'phaser-ce';

export default class HowToPlayMenu extends Phaser.Group
{

    private _menuBackground: Phaser.Sprite;

    constructor(game: Phaser.Game)
    {
        super(game);

        this._menuBackground = new Phaser.Sprite(game, 0, 0, '');
        this._menuBackground.anchor.set(0.5);
        this.addChild(this._menuBackground);

    }

    public resize(): void
    {
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
    }

    public destroy(): void
    {
        super.destroy(true);

        if (this._menuBackground) { this._menuBackground.destroy(true); }
        this._menuBackground = null;
    }
}
