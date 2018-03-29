import SaveGame from './SaveData';

import 'phaser-ce';

export default class SoundManager
{
    private static instance: SoundManager = null;

    private _sound: Phaser.SoundManager;

    public music: Phaser.Sound = null;

    private audioInstances: {
        [name: string]: Phaser.Sound
    } = {};

    private constructor(game: Phaser.Game)
    {
        this._sound = game.sound;
    }

    public static getInstance(game?: Phaser.Game): SoundManager
    {
        if (null === SoundManager.instance)
        {
            if (!game)
            {
                throw new Error('Cant create a new instance without a game');
            }

            SoundManager.instance = new SoundManager(game);
        }

        return SoundManager.instance;
    }

    public play(key: string, volume: number = 1, loop: boolean = false): Phaser.Sound
    {
        if (SaveGame.SFXMuted)
        {
            return null;
        }

        if (!this.audioInstances.hasOwnProperty(key))
        {
            this.audioInstances[key] = this._sound.add(key);
        }

        this.audioInstances[key].play(undefined, undefined, volume, loop, true);
        return this.audioInstances[key];
    }

    public stop(key: string): void
    {
        if (this.audioInstances.hasOwnProperty(key))
        {
            this.audioInstances[key].stop();
        }
    }

    public playMusic(key: string): void
    {
        if (SaveGame.MusicMuted)
        {
            //Even though the music is currently turned off, keep track of the last music we wanted to play.
            //This way, when we turn the music on again, we already know which song to play.
            this.music = this._sound.play(key, 1, true);

            //Stop the music right away. We just want to keep track of the song.
            this.music.stop();

            console.error('Music, playing! Though muted :(');
            return;
        }

        if (null === this.music || this.music.name !== key)
        {
            if (null !== this.music && this.music.name !== key)
            {
                this.music.stop();
                console.error('sound already there!, stopping and playing again');
            }

            this.music = this._sound.play(key, 1, true);

            console.error('playin ze muziek');

            return;
        }

        console.error('doing nothing' );
    }

    public fadeMusicVolume(duration: number, volume: number): void
    {
        if (this.music)
        {
            this.music.fadeTo(duration, volume);
        }
    }

    public stopMusic(): void
    {
        if (null === this.music)
        {
            return;
        }

        if (this.music.isPlaying)
        {
            this.music.stop();
        }
    }

    public toggleSfx(): void
    {
        SaveGame.SFXMuted = !SaveGame.SFXMuted;
    }

    public toggleMusic(): void
    {
        SaveGame.MusicMuted = !SaveGame.MusicMuted;

        if (!SaveGame.MusicMuted)
        {
            if (this.music && this.music.isPlaying)
            {
                this.stopMusic();
            }
        }
        else
        {
            if (this.music)
            {
                this.music.play(undefined, undefined, 1, true);
            }
        }
    }
}
