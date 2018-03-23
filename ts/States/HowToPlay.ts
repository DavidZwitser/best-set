import 'phaser-ce';

import Test from './Test';
import TextButton from '../UI/TextButton';
import ImageButton from '../UI/ImageButton';
import Gameplay from './Gameplay';
import Menu from './Menu';
import Atlases from '../Data/Atlases';
export default class HowToPlay extends Phaser.State
{
    public static Name: string = 'HowToPlay';

    public name: string = HowToPlay.Name;

    private backgroundSprite: Phaser.Sprite;
    private title: Phaser.Sprite;
    private buttonContainers: Phaser.Group;
    private smallButtonContainer: Phaser.Group;

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
        this.backgroundSprite.anchor.set(.5, 0);

        this.title = this.game.add.sprite(0, 0, Atlases.Interface, 'ui_menu_ondergrond_logo');
        this.title.anchor.set(.5);
       

        this.buttonContainers = this.createButtonContainers();
        this.add.existing(this.buttonContainers);

        this.smallButtonContainer = this.createSmallButtonContainers();
        this.add.existing(this.smallButtonContainer);

        /* Go to gameplay by default */
        //this.state.start(Gameplay.Name);

        this.resize();
    }

    private createButtonContainers(): Phaser.Group {
        let group: Phaser.Group = new Phaser.Group(this.game);

        let background: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_menu_ondergrond');
        background.anchor.set(.5);
        group.add(background);

        let menuButton: TextButton = new TextButton(this.game, 0, -400, 'Back', {font: '50px',
        fill: '#fff',
        align: 'center' }, () => {
            this.state.start(Menu.Name);
        }, this);
        group.add(menuButton);


        return group;
    }

    private createSmallButtonContainers(): Phaser.Group {
        let group: Phaser.Group = new Phaser.Group(this.game);



        let testButton: TextButton = new TextButton(this.game, 100, 20, 'Next', {font: '50px',
        fill: '#fff',
        align: 'center' }, () => {
          //  this.state.start(Test.Name);
        }, this);
        group.add(testButton);

/*
        let settingButton: ImageButton = new ImageButton(this.game, 100, 0, 'ui_icon_settings', () => {
            //
        }, this);
        group.add(settingButton);

        let shareButton: ImageButton = new ImageButton(this.game, -100, 0, 'popupmenu_icon_twitter', () => {
            //
        }, this);
        group.add(shareButton);
*/
        return group;
    }

    public resize(): void
    {
        let vmax: number = Math.max(this.game.width, this.game.height);
        let vmin: number = Math.min(this.game.width, this.game.height);

        this.backgroundSprite.x = this.game.width / 2;
        this.backgroundSprite.scale.set(vmax / GAME_WIDTH);

        this.title.scale.set(vmin / GAME_WIDTH);
        this.title.position.set(this.game.width / 2, this.game.height * .15);

        this.buttonContainers.scale.set(vmin / GAME_WIDTH);
        this.buttonContainers.position.set(this.game.width / 2, this.game.height * .55);

        this.smallButtonContainer.scale.set(vmin / GAME_WIDTH);
        this.smallButtonContainer.position.set(this.game.width / 2, this.game.height * .9);
    }

    public shutdown(): void
    {
        super.shutdown(this.game);
    }

}
