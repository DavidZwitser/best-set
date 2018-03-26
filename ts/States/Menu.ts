import 'phaser-ce';

import Test from './Test';
import TextButton from '../UI/TextButton';
import ImageButton from '../UI/ImageButton';
import Gameplay from './Gameplay';
import Atlases from '../Data/Atlases';
import HowToPlayMenu from '../UI/HowToPlayMenu';

export default class Menu extends Phaser.State
{
    public static Name: string = 'menu';

    public name: string = Menu.Name;

    private backgroundSprite: Phaser.Sprite;
    private title: Phaser.Sprite;
    private buttonContainers: Phaser.Group;
    private smallButtonContainer: Phaser.Group;
    private howToPlayMenu: HowToPlayMenu;

    constructor()
    {
        super();
    }

    public init(): void
    {
        //
    }

    public create(): void
    {
        super.create(this.game);

        this.backgroundSprite = this.game.add.sprite(0, 0, Atlases.Interface, 'ui_menu_background');
        this.backgroundSprite.anchor.set(.5, 1);

        this.title = this.game.add.sprite(0, 0, Atlases.Interface, 'ui_menu_ondergrond_logo');
        this.title.anchor.set(.5);
        let logo: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_menu_logo');
        logo.anchor.set(.5);
        this.title.addChild(logo);

        this.buttonContainers = this.createButtonContainers();
        this.add.existing(this.buttonContainers);

        this.smallButtonContainer = this.createSmallButtonContainers();
        this.add.existing(this.smallButtonContainer);

        this.howToPlayMenu = new HowToPlayMenu(this.game);
        this.add.existing(this.howToPlayMenu);

        /* Go to gameplay by default */
        //this.state.start(Gameplay.Name);

        this.resize();
    }

    private createButtonContainers(): Phaser.Group {
        let group: Phaser.Group = new Phaser.Group(this.game);

        let background: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_menu_ondergrond');
        background.anchor.set(.5);
        group.add(background);

        let playButton: TextButton = new TextButton(this.game, 0, -200, 'Play', () => {
            this.state.start(Gameplay.Name, true, false, this.game.world.generateTexture());
        }, this);
        group.add(playButton);

        let howToPlayButton: TextButton = new TextButton(this.game, 0, 0, 'How to play', () => {
            //
        }, this);
        group.add(howToPlayButton);

        let testButton: TextButton = new TextButton(this.game, 0, 200, 'Test', () => {
            this.state.start(Test.Name);
        }, this);
        group.add(testButton);

        return group;
    }

    private createSmallButtonContainers(): Phaser.Group {
        let group: Phaser.Group = new Phaser.Group(this.game);

        let settingButton: ImageButton = new ImageButton(this.game, 100, 0, 'ui_icon_settings', () => {
            //
        }, this);
        group.add(settingButton);

        let shareButton: ImageButton = new ImageButton(this.game, -100, 0, 'popupmenu_icon_twitter', () => {
            //
        }, this);
        group.add(shareButton);

        return group;
    }

    public resize(): void
    {
        let vmax: number = Math.max(this.game.width, this.game.height);
        let vmin: number = Math.min(this.game.width, this.game.height);

        this.backgroundSprite.x = this.game.width / 2;
        this.backgroundSprite.y = this.game.height;
        this.backgroundSprite.scale.set(vmax / GAME_WIDTH);

        this.title.scale.set(vmin / GAME_WIDTH);
        this.title.position.set(this.game.width / 2, this.game.height * .15);

        this.buttonContainers.scale.set(vmin / GAME_WIDTH);
        this.buttonContainers.position.set(this.game.width / 2, this.game.height * .55);

        this.smallButtonContainer.scale.set(vmin / GAME_WIDTH);
        this.smallButtonContainer.position.set(this.game.width / 2, this.game.height * .9);

        this.howToPlayMenu.scale.set(vmin / GAME_WIDTH);
        this.howToPlayMenu.position.set(this.game.width / 2, this.game.height / 2);
    }

    public shutdown(): void
    {
        super.shutdown(this.game);
    }

}
