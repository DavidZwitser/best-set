import 'phaser-ce';
import IGame from '../PluginManagers/IGame';
import PowerOrb from './PowerOrb';
export default class Character extends Phaser.Group
{
    public spine: any;
    public shadowSpine: any;
    public game: IGame;

    private _powerOrb: PowerOrb;

    public static ANIMARTION_IDLE: string = 'idle';
    public static ANIMARTION_ATTACK: string = 'combo';
    public static ANIMARTION_LOSE: string = 'defeat';

    constructor(game: Phaser.Game, x: number, y: number)
    {
        super(game);

        this.position.set(x, y);
        this.scale.set(.2);

        this.shadowSpine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'shadow');

        this.addChild(this.shadowSpine);

        this.spine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'Character');
        this.addChild(this.spine);

        this._powerOrb = new PowerOrb(this.game, -250, -800);
        this.addChild(this._powerOrb);

        this.setAnimation(Character.ANIMARTION_IDLE, true);
    }

    private setAnimation(animation: string, loop: boolean = false): void
    {
        this.shadowSpine.setAnimationByName(0, animation, loop);
        this.spine.setAnimationByName(0, animation, loop);

        this.spine.onComplete.addOnce( () => { if (!loop) {
            this.setAnimation(Character.ANIMARTION_IDLE, true);
        }});
    }

    public combo(): void
    {
        this.setAnimation(Character.ANIMARTION_ATTACK, false);
    }

    public lose(): void
    {
        this.setAnimation(Character.ANIMARTION_LOSE, false);
    }

    public pause( pause: boolean): void
    {
        this.spine.autoUpdate = !pause;
        this.shadowSpine.autoUpdate = !pause;
    }

    public destroy(): void
    {
        super.destroy(true);

        if (this.spine) { this.spine.destroy(true); }
        this.spine = null;

        if (this.shadowSpine) { this.shadowSpine.destroy(true); }
        this.shadowSpine = null;

    }
}
