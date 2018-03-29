import 'PhaserSpine';

/* For getting around phaser not recognising plugin definitions */
export default interface IGame extends Phaser.Game {
    add: PhaserSpine.SpineObjectFactory;
    load: PhaserSpine.SpineLoader;
}
