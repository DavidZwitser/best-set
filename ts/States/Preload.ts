import 'phaser-ce';

import IGame from '../PluginManagers/IGame';

import Images from '../Data/Images';
import Sounds from '../Data/Sounds';
import Menu from './Menu';
import Atlases from '../Data/Atlases';
import Spines from '../Data/Spines';
import SpriteSheets from '../Data/SpriteSheets';
import SoundManager from '../BackEnd/SoundManager';

export default class Preload extends Phaser.State
{
    public static Name: string = 'preload';

    public name: string = Preload.Name;
    public game: IGame;

    constructor(game: IGame)
    {
        super();
        this.game = game;
    }

    public preload(): void
    {
        super.preload(this.game);
        this.game.add.sprite(0, 0, 'ui_splashscreen');

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

        Sounds.list.forEach((assetName: string) => {
            this.game.load.audio(assetName, 'assets/sounds/sfx/' + assetName + '.wav');
        });

        Spines.list.forEach((assetName: string) => {
            this.game.load.spine(assetName, 'assets/spine/' + assetName + '.json');
        });
    }

    public create(): void
    {
        super.create(this.game);
        let text: Phaser.BitmapText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2, 'myfont', 'click to start', 50);
        text.anchor.set(.5);
        this.game.input.onDown.addOnce(() => {

            this.goToMenu();
        });
    }

    private goToMenu(): void {
        this.state.start(Menu.Name);
    }
    public shutdown(): void
    {
        //
    }

}
