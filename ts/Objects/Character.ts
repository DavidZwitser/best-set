import 'phaser-ce';
import IGame from '../PluginManagers/IGame';

export default class Character extends Phaser.Group
{
    /** The character as a spine object */
    public spine: PhaserSpine.Spine;
    /** The character's shadow as a spine object */
    public shadowSpine: PhaserSpine.Spine;

    /** A reference to the game */
    public game: IGame;

    /** The animations in the character */
    public static ANIMARTION_IDLE: string = 'idle';
    public static ANIMARTION_ATTACK: string = 'combo';
    public static ANIMARTION_LOSE: string = 'defeat';

    constructor(game: Phaser.Game, x: number, y: number)
    {
        super(game);

        this.position.set(x, y);
        this.scale.set(.2);

        this.shadowSpine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'shadow');
        this.spine = new PhaserSpine.Spine(<PhaserSpine.SpineGame>(this.game), 'Character');

        this.addChild(this.shadowSpine);
        this.addChild(this.spine);

        this.setAnimation(Character.ANIMARTION_IDLE, true);
    }

    /** Animation is set for the character spine */
    private setAnimation(animation: string, loop: boolean = false): void
    {
        this.shadowSpine.setAnimationByName(0, animation, loop);
        this.spine.setAnimationByName(0, animation, loop);

        //if the animation doesn't loop, it reverts into its idle animation
        this.spine.onComplete.addOnce( () => { if (!loop) {
            this.setAnimation(Character.ANIMARTION_IDLE, true);
        }});
    }

    /** Combo animation is called without looping */
    public combo(): void
    {
        this.setAnimation(Character.ANIMARTION_ATTACK, false);
    }

    /** Lose animation is called without looping */
    public lose(): void
    {
        this.setAnimation(Character.ANIMARTION_LOSE, false);
    }

    /** spine animation is paused */
    public pause( pause: boolean): void
    {
        this.spine.autoUpdate = !pause;
        this.shadowSpine.autoUpdate = !pause;
    }

    /** destroys the character spine and shadow spine */
    public destroy(): void
    {
        super.destroy(true);

        if (this.spine) { this.spine.destroy(true); }
        this.spine = null;

        if (this.shadowSpine) { this.shadowSpine.destroy(true); }
        this.shadowSpine = null;

    }
}
