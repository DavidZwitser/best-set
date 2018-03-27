import 'phaser-ce';
import IGame from '../PluginManagers/IGame';
import PowerOrb from './PowerOrb';
export default class Character extends Phaser.Group
{
    public _spine: any;
    public _shadowSpine: any;
    public game: IGame;

    private _powerOrb: PowerOrb;

    public static ANIMARTION_IDLE: string = 'idle';
    public static ANIMARTION_ATTACK: string = 'combo';
    public static ANIMARTION_LOSE: string = 'defeat';
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game);

        this.position.set(x, y);
        this.scale.set(.2);

        this._shadowSpine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'shadow');

        this.addChild(this._shadowSpine);

        this._spine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'Character');
        this.addChild(this._spine);

        this._powerOrb = new PowerOrb(this.game, -250, -800);
        this.addChild(this._powerOrb);

        this.setAnimation(Character.ANIMARTION_IDLE, true);
    }
    private setAnimation(animation: string, loop: boolean = false): void {
        this._shadowSpine.setAnimationByName(0, animation, loop);
        this._spine.setAnimationByName(0, animation, loop);

        this._spine.onComplete.addOnce( () => { if (!loop) {
            this.setAnimation(Character.ANIMARTION_IDLE, true);
        }});
    }
    public Combo(): void {
        this.setAnimation(Character.ANIMARTION_ATTACK, false);
    }

    public Lose(): void {
        this.setAnimation(Character.ANIMARTION_LOSE, false);
    }

    public pause( pause: boolean): void {
        this._spine.autoUpdate = !pause;
        this._shadowSpine.autoUpdate = !pause;
    }
}
