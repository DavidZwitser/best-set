import 'phaser-ce';

import IGame from '../PluginManagers/IGame';
import EditorEmitter from '../Editor/emitter';

/**
 * The particle editor state, where phaser particles can more easilly be made by artists
 */
export default class Test extends Phaser.State
{
    public static Name: string = 'test';

    public name: string = Test.Name;
    public game: IGame;

    public emitter: EditorEmitter;
    public testButton: any;
    private _followMouse: boolean = false;

    constructor()
    {
        super();
    }

    public init(): void
    {
        document.getElementById('editor').style.display = 'block';
    }

    public create(): void
    {
        super.create(this.game);

        this.emitter = new EditorEmitter(this.game, this.game.width / 2, this.game.height / 2);

        this.testButton = document.getElementById('test');
        document.addEventListener('keydown', () => {
            requestAnimationFrame(() => {
                this.testParticle(false);
            });
        });
        this.testButton.addEventListener('click', () => {
            this.testParticle(true);
        });

        this.testParticle(false);
    }

    /** Regenerate the particle emitter, so the changed value can be tested */
    public testParticle(generateCode: boolean): void
    {
        this.emitter.destroy(true);
        this.emitter = null;
        this.emitter = new EditorEmitter(this.game, this.game.width / 2, this.game.height / 2);
        this._followMouse = (<any>document.getElementById('mouse')).checked;

        this.emitter.editorValues = {
            gravity: Math.round((<any>document.getElementById('gravity')).value),
            alphamin: Math.round((<any>document.getElementById('alphamin')).value),
            alphamax: Math.round((<any>document.getElementById('alphamax')).value),
            alpharate: (<any>document.getElementById('alpharate')).value,
            scalemin: Math.round((<any>document.getElementById('scalemin')).value),
            scaleMax: Math.round((<any>document.getElementById('scalemax')).value),
            scaleRate: (<any>document.getElementById('scaleRate')).value,
            minrotation: (<any>document.getElementById('minrotation')).value,
            maxrotation: (<any>document.getElementById('maxrotation')).value,
            minXSpeed: Math.round((<any>document.getElementById('xMinSpeed')).value),
            minYSpeed: Math.round((<any>document.getElementById('yMinSpeed')).value),
            maxXSpeed: Math.round((<any>document.getElementById('xMaxSpeed')).value),
            maxYSpeed: Math.round((<any>document.getElementById('yMaxSpeed')).value),
            explode: (<any>document.getElementById('explode')).checked,
            lifespan: (<any>document.getElementById('lifespan')).value,
            freq: Math.round((<any>document.getElementById('freq')).value),
            width: Math.round((<any>document.getElementById('width')).value),
            height: Math.round((<any>document.getElementById('height')).value),
            spriteName: (<any>document.getElementById('name')).value,
            maxParticles: (<any>document.getElementById('maxparticles')).value,
            spriteSheet: (<any>document.getElementById('spritesheet')).checked,
            spriteSheetFPS: Math.round((<any>document.getElementById('fps')).value),
            spriteSheetLoop: (<any>document.getElementById('loop')).checked
        };

        this.emitter.setUpEmitter();
        if (generateCode) {
            window.prompt('SEND TO DEV, ARTIEST! ;)', this.emitter.code);
        }

    }

    public update(): void
    {
        /** Makes the emitter follow the mouse when that options has been enabled */
        if (this._followMouse) {
            this.emitter.emitX = this.game.input.activePointer.x;
            this.emitter.emitY = this.game.input.activePointer.y;
        }
    }

    public shutdown(): void
    {
        super.shutdown(this.game);

        //this._testSprite.destroy(true);
        //this._testSprite = null;

        if (this.emitter) { this.emitter.destroy(true); }
        this.emitter = null;

    }
}
