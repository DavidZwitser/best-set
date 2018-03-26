import 'phaser-ce';

export default class StateTransitioner
{
    public static inFromBottom(game: Phaser.Game, callback?: Function): void
    {
        game.world.setBounds(0, -game.height, game.width, game.height * 2);

        game.world.cacheAsBitmap = true;

        game.add.tween(game.camera)
            .from({y: -game.height}, 600, Phaser.Easing.Cubic.InOut, true)
            .onComplete.addOnce( () => {
                if (callback) { callback(); }

                game.world.cacheAsBitmap = false;

                game.world.setBounds(0, 0, game.width, game.height);
            });
    }
}
