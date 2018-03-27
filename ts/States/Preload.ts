import 'phaser-ce';

import IGame from '../PluginManagers/IGame';

import Images from '../Data/Images';
import Menu from './Menu';
import Atlases from '../Data/Atlases';
import Spines from '../Data/Spines';
import SpriteSheets from '../Data/SpriteSheets';

export default class Preload extends Phaser.State
{
    public static Name: string = 'preload';

    public name: string = Preload.Name;
    public game: IGame;

    private _preloadImage: Phaser.Sprite;
    private _preloadText: Phaser.Sprite;

    constructor(game: IGame)
    {
        super();
        this.game = game;
    }

    public preload(): void
    {
        super.preload(this.game);

        this._preloadImage = this.game.add.sprite(0, 0, 'ui_splashscreen');

        let vmax: number = Math.min(this.game.width, this.game.height);
        this._preloadImage.scale.set(vmax / GAME_WIDTH);

        this._preloadText = new Phaser.Sprite(this.game, this._preloadImage.width / 2, this._preloadImage.height * .4, 'ui_splashscreen_textloading');
        this._preloadText.anchor.set(.5);
        this._preloadImage.addChild(this._preloadText);

        this.game.load.bitmapFont('myfont', 'assets/fonts/font.png', 'assets/fonts/font.xml');

        SpriteSheets.list.forEach((sheet: {name: string, frameWidth: number, frameHeight: number, amountOfFrames: number}) => {
            this.game.load.spritesheet(sheet.name, 'assets/spritesheets/' + sheet.name + '.png', sheet.frameWidth, sheet.frameHeight, sheet.amountOfFrames);
        });

        Atlases.list.forEach((assetName: string) => {
            this.game.load.atlas(assetName, 'assets/atlases/' + assetName + '.png', 'assets/atlases/' + assetName + '.json');
        });

        Images.list.forEach((assetName: string) => {
            this.game.load.image(assetName, 'assets/sprites/' + assetName + '.png');
        });

        Spines.list.forEach((assetName: string) => {
            this.game.load.spine(assetName, 'assets/spine/' + assetName + '.json');
        });
    }

    public create(): void
    {
        super.create(this.game);
        this._preloadText.loadTexture(this.game.device.desktop ? 'ui_splashscreen_texclick' : 'ui_splashscreen_textap');
        this.game.input.onDown.addOnce(() => {
            this.goToMenu();
        });
    }

    private goToMenu(): void {
        this.state.start(Menu.Name);
    }

    public resize(): void {
        console.log('resize');
        let vmax: number = Math.min(this.game.width, this.game.height);

        this._preloadImage.scale.set(vmax / GAME_WIDTH);
        this._preloadImage.y = 0 + (this.game.height - this._preloadImage.height);

    }
    public shutdown(): void
    {
        super.shutdown(this.game);

        this._preloadText.destroy(true);
        this._preloadText = null;

        this._preloadImage.destroy(true);
        this._preloadImage = null;
    }

}
