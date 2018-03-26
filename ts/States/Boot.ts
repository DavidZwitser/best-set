import 'phaser-ce';

import IGame from '../PluginManagers/IGame';

import Preload from './Preload';

export default class Boot extends Phaser.State
{
    public static Name: string = 'boot';

    public name: string = Boot.Name;
    public game: IGame;

    constructor(game: IGame)
    {
        super();
        this.game = game;
    }

    public init(): void
    {
        if (this.game.device.desktop) {

            this.scale.pageAlignHorizontally = true;
            this.scale.windowConstraints.bottom = 'visual';

            this.game.onBlur.add(() => {
                this.game.sound.mute = true;
            });
            this.game.onFocus.add(() => {
                this.game.sound.mute = false;
            });
            window.addEventListener('resize', () => {
                this.scaleCanvasContain();
            });
            this.scaleCanvasContain();
        } else {
            let rotateScreen: any = document.getElementById('rotateWarning');
            rotateScreen.classList.add('rotateWarning');
            this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            this.scale.fullScreenScaleMode = Phaser.ScaleManager.USER_SCALE;

            window.addEventListener('resize', () => {
                Boot.mobileResizeCallback(this.game.scale);
            });
            Boot.mobileResizeCallback(this.game.scale);
            this.game.scale.onSizeChange.add(
                () => {
                    // if (Constants.LANDSCAPE_LOCKED) {
                    //     if (this.game.width > this.game.height) {
                    //         this.handleCorrect();
                    //     } else {
                    //         this.handleIncorrect();
                    //     }
                    // } else if (Constants.PORTRAIT_LOCKED) {
                    //     if (this.game.width < this.game.height) {
                    //         this.handleCorrect();
                    //     } else {
                    //         this.handleIncorrect();
                    //     }
                    // }
                    this.game.state.getCurrentState().resize(window.innerWidth, window.innerHeight);
                },
                this
            );
        }
        //input pointers limited to 1
        this.game.input.maxPointers = 1;

        //Disable contextual menu
        this.game.canvas.oncontextmenu = function (e: Event): void {
            e.preventDefault();
        };
    }
    private scaleCanvasContain(): void {
        if (window.innerHeight / window.innerWidth > GAME_HEIGHT / GAME_WIDTH) {
            this.scale.maxHeight = window.innerWidth * (GAME_HEIGHT / GAME_WIDTH);
            this.scale.maxWidth = window.innerWidth;
        } else {
            this.scale.maxHeight = window.innerHeight;
            this.scale.maxWidth = window.innerHeight / (GAME_HEIGHT / GAME_WIDTH);
        }
    }

    public static mobileResizeCallback(manager: Phaser.ScaleManager): void {
        let width: number = window.innerWidth;
        let height: number = window.innerHeight;

        let usedWidth: number = GAME_WIDTH;
        let usedHeight: number = GAME_HEIGHT;

        let scaleFactor: number = 1;

        //So first we check if the game is beeing played in landscape
        if (width > height) {
            scaleFactor /= width / usedHeight;
        } else {
            scaleFactor /= height / usedWidth;
        }

        let CALCULATED_WIDTH: number = Math.ceil(width * scaleFactor);
        let CALCULATED_HEIGHT: number = Math.ceil(height * scaleFactor);

        manager.setGameSize(CALCULATED_WIDTH, CALCULATED_HEIGHT);
        manager.setUserScale(1 / scaleFactor, 1 / scaleFactor);
    }

    public preload(): void
    {
        super.preload(this.game);
        this.game.load.image('ui_splashscreen', 'assets/sprites/ui_splashscreen.png');
    }

    public resize(): void
    {
        //
    }

    public create(): void
    {
        super.create(this.game);
        this.state.start(Preload.Name);
    }

    public shutdown(): void
    {
        //
    }

}
