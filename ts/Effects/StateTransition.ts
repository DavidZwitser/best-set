import 'phaser-ce';

export default class StateTransitioner
{

    private static animateIn(game: Phaser.Game, ySide: number, callback?: Function): void
    {
        game.world.setBounds(
            0,
            ySide <= -1 ? -game.height : 0,
            game.width,
            game.height * 2
        );

        game.world.cacheAsBitmap = true;

        game.add.tween(game.camera)
            .from({y: game.height * ySide}, 600, Phaser.Easing.Cubic.InOut, true)
            .onComplete.addOnce( () => {
                if (callback) { callback(); }

                game.world.cacheAsBitmap = false;

                game.world.setBounds(0, 0, game.width, game.height);
            });

    }

    public static InFromBottom(game: Phaser.Game, callback?: Function): void
    {
        this.animateIn(game, -1, callback);
    }

    public static InFromTop(game: Phaser.Game, callback?: Function): void
    {
        this.animateIn(game, 1, callback);
    }
}
