import 'phaser-ce';
import Atlases from '../Data/Atlases';

export default class EditorEmitter extends Phaser.Particles.Arcade.Emitter
{

    public code: string;
    public editorValues: {
        gravity: number,
        alphamin: number,
        alphamax: number,
        alpharate: number,
        scalemin: number,
        scaleMax: number,
        scaleRate: number,
        minrotation: number,
        maxrotation: number,
        minXSpeed: number,
        minYSpeed: number,
        maxXSpeed: number,
        maxYSpeed: number,
        explode: boolean,
        lifespan: number,
        freq: number,
        width: number,
        height: number,
        spriteName: string,
        maxParticles: number,
        spriteSheet: boolean,
        spriteSheetFPS: number,
        spriteSheetLoop: boolean
    };

    constructor(game: Phaser.Game, x: number, y: number)
    {
        super(game, x, y);
        game.add.image(0, 0, '');

        this.editorValues;
    }

    public setUpEmitter(): void
    {
        console.log();
        this.code =
        'public createEmitter(): Phaser.Particles.Arcade.Emitter{' +
        'let emitter: Phaser.Particles.Arcade.Emitter = new Phaser.Particles.Arcade.Emitter(this.game, 0, 0, ' + this.editorValues.maxParticles + ');';
        this.maxParticles = this.editorValues.maxParticles;

        if (this.editorValues.spriteSheet) {
            this.code += 'emitter.makeParticles(Atlases.Lightning);';
            this.code += 'this.forEach( (singleParticle: Phaser.Sprite) => {singleParticle.animations.add(\'animationName\');singleParticle.animations.play(\'animationName\',' +
            this.editorValues.spriteSheetFPS + ', ' + this.editorValues.spriteSheetLoop + ');});';
            this.makeParticles(Atlases.Lightning);
            this.forEach( (singleParticle: Phaser.Sprite) => {
                singleParticle.animations.add('anim');
                singleParticle.animations.play('anim', this.editorValues.spriteSheetFPS, this.editorValues.spriteSheetLoop);
            });
        } else {
            this.code += 'emitter.makeParticles(Atlases.Interface, \'' + this.editorValues.spriteName.split(', ') + '\');';
            this.makeParticles(Atlases.Interface, this.editorValues.spriteName.split(', '));
        }

        this.code += 'emitter.setXSpeed(' + this.editorValues.minXSpeed + ', ' + this.editorValues.maxXSpeed + ');' +
        'emitter.setYSpeed(' + this.editorValues.minYSpeed + ', ' + this.editorValues.maxYSpeed + ');';

        this.setXSpeed(this.editorValues.minXSpeed, this.editorValues.maxXSpeed);
        this.setYSpeed(this.editorValues.minYSpeed, this.editorValues.maxYSpeed);

        if (this.editorValues.minrotation !== 0 || this.editorValues.maxrotation !== 0) {
            this.code += 'emitter.setRotation(' + this.editorValues.minrotation + ', ' + this.editorValues.maxrotation + ');';
            this.setRotation(this.editorValues.minrotation, this.editorValues.maxrotation);
        }

        if (this.editorValues.alphamin !== 0) {
            this.code += 'emitter.setAlpha(' + this.editorValues.alphamin + ', ' + this.editorValues.alphamax + ', ' + this.editorValues.alpharate + ');';
            this.setAlpha(this.editorValues.alphamin, this.editorValues.alphamax, this.editorValues.alpharate);
        }

        this.code += 'emitter.setScale(' + this.editorValues.scalemin + ', ' + this.editorValues.scaleMax + ', ' +
        this.editorValues.scalemin + ', ' + this.editorValues.scaleMax + ', ' + this.editorValues.scaleRate + ');';
        this.setScale(this.editorValues.scalemin, this.editorValues.scaleMax, this.editorValues.scalemin, this.editorValues.scaleMax, this.editorValues.scaleRate);

        if (this.editorValues.gravity !== 0) {
            this.code += 'emitter.gravity.y = ' + this.editorValues.gravity + ';';
            this.gravity.y = this.editorValues.gravity;
        }

        if (this.editorValues.width !== 0) {
            this.code += 'emitter.width = ' + this.editorValues.width + ';';
            this.width = this.editorValues.width;
        }

        if (this.editorValues.height !== 0) {
            this.code += 'emitter.height = ' + this.editorValues.height + ';';
            this.height = this.editorValues.height;
        }

        this.startEmitter();

        this.code += 'return emitter;}';
        //console.log(this.code);
    }
    public startEmitter(): void {
        if (this.editorValues.explode) {
            this.code += 'emitter.start(' + true + ', ' + this.editorValues.lifespan + ', ' + this.editorValues.freq + ', ' + this.editorValues.maxParticles + ');';
            super.start(true, this.editorValues.lifespan, this.editorValues.freq, this.editorValues.maxParticles);
        } else {
            this.code += 'emitter.start(' + false + ', ' + this.editorValues.lifespan + ', ' + this.editorValues.freq + ');';
            super.start(false, this.editorValues.lifespan, this.editorValues.freq);
        }
    }
}
