import 'phaser-ce';
import IGame from '../PluginManagers/IGame';
import Atlases from '../Data/Atlases';

export default class Character extends Phaser.Group
{
    public _spine: any;
    public game: IGame;
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game);

        this.position.set(x, y);
        this._spine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'chips');

        this._spine.setAnimationByName(
            0,          //Track index
            'idle',     //Animation's name
            true        //If the animation should loop or not
        );
        this.addChild(this._spine);

        this._spine.visible = false;
        let tempSprite: Phaser.Sprite = new Phaser.Sprite(game, 0, 0, Atlases.Interface, 'temp_char');
        tempSprite.anchor.set(.5);
        tempSprite.scale.set(0.2);
        this.addChild(tempSprite);

    }
}
