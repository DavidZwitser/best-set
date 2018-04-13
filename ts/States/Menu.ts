import 'phaser-ce';

// import Test from './Test';
import TextButton from '../UI/TextButton';
import ImageButton from '../UI/ImageButton';
import Gameplay from './Gameplay';
import HowToPlay from './HowToPlay';
import Atlases from '../Data/Atlases';
import HowToPlayMenu from '../UI/HowToPlayMenu';

import StateTransition from '../Effects/StateTransition';
import SoundManager from '../BackEnd/SoundManager';
import Sounds from '../Data/Sounds';

export default class Menu extends Phaser.State
{
    public static Name: string = 'menu';

    public name: string = Menu.Name;

    /** The sprite that saves the image of the last state, to make the transition happen */
    private _transitionBackdrop: Phaser.Sprite;

    /** The background for the menu */
    private _backgroundSprite: Phaser.Sprite;
    /** The sprite that contains the game title */
    private _title: Phaser.Sprite;
    /** The container that contains the button */
    private _buttonContainers: Phaser.Group;
    /** The container that has all the small buttons */
    private _smallButtonContainer: Phaser.Group;
    /** The how to play popup that can be started */
    private _howToPlayMenu: HowToPlayMenu;

    constructor()
    {
        super();

    }

    public init(worldSnapshot: Phaser.RenderTexture): void
    {
        SoundManager.getInstance(this.game);

        /* Saving the image of the last state to make the transition happen */
        if (!worldSnapshot) { return; }
        this._transitionBackdrop = this.game.add.sprite(0, this.game.height, worldSnapshot);
    }

    public create(): void
    {
        super.create(this.game);
        SoundManager.getInstance(this.game).playMusic(Sounds.Ambience, 0.1);

        this._backgroundSprite = this.game.add.sprite(0, 0, Atlases.Interface, 'ui_menu_background');
        this._backgroundSprite.anchor.set(.5, 1);

        this._title = this.game.add.sprite(0, 0, Atlases.Interface, 'ui_menu_logo');
        this._title.anchor.set(.5);

        this._buttonContainers = this.createButtonContainers();
        this.add.existing(this._buttonContainers);

        this._smallButtonContainer = this.createSmallButtonContainers();
        this.add.existing(this._smallButtonContainer);

        this._howToPlayMenu = new HowToPlayMenu(this.game);
        this.add.existing(this._howToPlayMenu);

        /** Go to gameplay by default */
        //this.state.start(Gameplay.Name);

        this.resize();

        /* Starting the transition */
        if (!this._transitionBackdrop) { return; }
        StateTransition.InFromTop(this.game, () => {
            this._transitionBackdrop.destroy(true);
            this._transitionBackdrop = null;
        });
    }

    /** Create the container that contains the buttons and those buttons */
    private createButtonContainers(): Phaser.Group
    {
        let group: Phaser.Group = new Phaser.Group(this.game);

        let playButton: TextButton = new TextButton(this.game, 0, -200, 'MainMenu_PlayButton', '', () => {
            this.state.start(Gameplay.Name, true, false, this.game.world.generateTexture());
        }, this);
        group.add(playButton);

        let howToPlayButton: TextButton = new TextButton(this.game, 0, 0, 'MainMenu_HowToPlayButton', '', () => {
            this.state.start(HowToPlay.Name);
        }, this);
        group.add(howToPlayButton);
        return group;
    }

    /** Create the container that holds all the small buttons and creating those buttons */
    private createSmallButtonContainers(): Phaser.Group
    {
        let group: Phaser.Group = new Phaser.Group(this.game);

        let shareButton: ImageButton = new ImageButton(this.game, 0, - 300, 'ui_ingame_button_share', () => {
            //
        }, this);
        group.add(shareButton);

        return group;
    }

    /* Place all the elements in the menu in their correct position */
    public resize(): void
    {
        let vmax: number = Math.max(this.game.width, this.game.height);
        let vmin: number = Math.min(this.game.width, this.game.height / 2);

        this._backgroundSprite.x = this.game.width / 2;
        this._backgroundSprite.y = this.game.height;
        this._backgroundSprite.scale.set(vmax / GAME_WIDTH);

        this._title.scale.set(vmin / GAME_WIDTH);
        this._title.position.set(this.game.width / 2, this.game.height * .15);

        this._buttonContainers.scale.set(vmin / GAME_WIDTH);
        this._buttonContainers.position.set(this.game.width / 2, this.game.height * .55);

        this._smallButtonContainer.scale.set(vmin / GAME_WIDTH);
        this._smallButtonContainer.position.set(this.game.width / 2, this.game.height * .9);

        this._howToPlayMenu.scale.set(vmin / GAME_WIDTH);
        this._howToPlayMenu.position.set(this.game.width / 2, this.game.height / 2);
    }

    public shutdown(): void
    {
        super.shutdown(this.game);

        if (this._transitionBackdrop) { this._transitionBackdrop.destroy(true); }
        this._transitionBackdrop = null;

        if (this._backgroundSprite) { this._backgroundSprite.destroy(true); }
        this._backgroundSprite = null;

        if (this._title) { this._title.destroy(true); }
        this._title = null;

        if (this._buttonContainers) { this._buttonContainers.destroy(true); }
        this._buttonContainers = null;

        if (this._smallButtonContainer) { this._smallButtonContainer.destroy(true); }
        this._smallButtonContainer = null;

        if (this._howToPlayMenu) { this._howToPlayMenu.destroy(); }
        this._howToPlayMenu = null;
    }

}
