import 'phaser-ce';

/** For making a nice transition between the states */
export default class StateTransitioner
{

    /** Animate a state in from the top or the bottom */
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

    /** Animate the new state in from the bottom */
    public static InFromBottom(game: Phaser.Game, callback?: Function): void
    {
        this.animateIn(game, -1, callback);
    }

    /** Animate the next state in from the top */
    public static InFromTop(game: Phaser.Game, callback?: Function): void
    {
        this.animateIn(game, 1, callback);
    }
}
