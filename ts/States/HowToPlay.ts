import 'phaser-ce';

import TextButton from '../UI/TextButton';
import PageButton from '../UI/PageButton';
import Gameplay from './Gameplay';
import Menu from './Menu';
import Atlases from '../Data/Atlases';
import HowToPlayText from '../UI/HowToPlayText';

export default class HowToPlay extends Phaser.State
{
    public static Name: string = 'HowToPlay';

    public name: string = HowToPlay.Name;
    private _htpText: HowToPlayText;

    private backgroundSprite: Phaser.Sprite;
    private _howToPlaySpriteText: Phaser.Sprite;
    private title: Phaser.Sprite;
    private buttonContainers: Phaser.Group;
    private smallButtonContainer: Phaser.Group;

    private _prevButton: PageButton;
    private _nextButton: PageButton;
    private _menuButton: PageButton;

    private _howToPlayText: Phaser.BitmapText;

    private _currentSlide: number;

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

        this._currentSlide = 0;

        this.backgroundSprite = this.game.add.sprite(0, 0, Atlases.Interface, 'ui_menu_background');
        this.backgroundSprite.anchor.set(.5, .4415);

        this.buttonContainers = this.createButtonContainers();
        this.add.existing(this.buttonContainers);

        this.smallButtonContainer = this.createSmallButtonContainers();
        this.add.existing(this.smallButtonContainer);

        /*
        this._htpText = new HowToPlayText();
        this.PlayText(this._htpText.GetHtpText_One);
        */

        this._howToPlaySpriteText = this.game.add.sprite(this.game.width / 2, this.game.width / 1, Atlases.Interface, 'pagina_1');
        this._howToPlaySpriteText.anchor.set(.5);

        this.title = this.game.add.sprite(this.game.width / 2, this.game.height / 3, Atlases.Interface, 'logo_how_to_play');
        this.title.anchor.set(.5, -2.75);

        this.resize();
    }

    private createButtonContainers(): Phaser.Group {
        let group: Phaser.Group = new Phaser.Group(this.game);

        let background: Phaser.Sprite = new Phaser.Sprite(this.game, 0, 0, Atlases.Interface, 'ui_howto_opmaak');
        background.anchor.set(.5);
        group.add(background);
        return group;
    }

    private createSmallButtonContainers(): Phaser.Group {
        let group: Phaser.Group = new Phaser.Group(this.game);

        this._prevButton = new PageButton(this.game, -200, -225, 'ui_howto_previouspage', () => {
         this._currentSlide--;
         this.ChangeText();
        }, this);
        group.add(this._prevButton);

        this._prevButton.visible = false;

        this._nextButton = new PageButton(this.game, 200, -225, 'ui_howto_nextpage', () => {
            this._currentSlide++;
            this.ChangeText();
        }, this);
        group.add(this._nextButton);

        this._menuButton = new PageButton(this.game, -250, -800, 'ui_howto_exit', () => {
            this.state.start(Menu.Name);
        }, this);
        group.add(this._menuButton);

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

    private ChangeText(): void
    {
       switch (this._currentSlide)
       {
        default:
        //
        break;

           case 0:
           //this.AdjustText(this._htpText.GetHtpText_One);
           this._howToPlaySpriteText.loadTexture(Atlases.Interface, 'pagina_1');
           this._prevButton.visible = false;
           this._nextButton.visible = true;
           break;
           case 1:
           //this.AdjustText(this._htpText.GetHtpText_Two);
           this._howToPlaySpriteText.loadTexture(Atlases.Interface, 'pagina_2');
           this._prevButton.visible = true;
           this._nextButton.visible = true;
           break;
           case 2:
        //this.AdjustText(this._htpText.GetHtpText_Three);
           this._prevButton.visible = true;
           this._nextButton.visible = false;
           this._howToPlaySpriteText.loadTexture(Atlases.Interface, 'pagina_3');
        }
    }

    private PlayText(replaceText: string): void
    {
        this._howToPlayText = this.game.add.bitmapText(this.game.width / 2, this.game.height / 2.5, 'myfont', replaceText);
        this._howToPlayText.fontSize = 50;
        this._howToPlayText.anchor.set(0.5, 0);
    }

    private AddText(): void
    {
        //
    }

    private AdjustText(replaceText: string): void
    {
        this._howToPlayText.text = replaceText;
    }

    public shutdown(): void
    {
        super.shutdown(this.game);
    }

}
