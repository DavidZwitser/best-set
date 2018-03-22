import 'phaser-ce';
import IGame from '../PluginManagers/IGame';

export default class Character extends Phaser.Group
{
    public _spine: any;
    public _shadowSpine: any;
    public game: IGame;
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game);

        this.position.set(x, y);
        this.scale.set(.15);

        this._shadowSpine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'shadow');
        this._shadowSpine.setAnimationByName(
            0,          //Track index
            'idle',     //Animation's name
            true        //If the animation should loop or not
        );
        this.addChild(this._shadowSpine);

        this._spine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'Character');
        this._spine.setAnimationByName(
            0,          //Track index
            'idle',     //Animation's name
            true        //If the animation should loop or not
        );
        this.addChild(this._spine);
    }
}
