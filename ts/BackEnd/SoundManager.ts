import SaveGame from './SaveData';

import 'phaser-ce';

/** Handles the playing of sounds */
export default class SoundManager
{
    /** The instance of the sound manager used to handle the sounds */
    private static instance: SoundManager = null;

    /** The manager that handles the sfx's */
    private _sound: Phaser.SoundManager;

    /** The manager that handles the music */
    public music: Phaser.Sound = null;

    /** All the instances of audio clips */
    private audioInstances: {
        [name: string]: Phaser.Sound
    } = {};

    private constructor(game: Phaser.Game)
    {
        this._sound = game.sound;
    }

    /** Get an instance of the game to handle sounds with */
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

    /** Play a sfx */
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

    /** Stop a sfx */
    public stop(key: string): void
    {
        if (this.audioInstances.hasOwnProperty(key))
        {
            this.audioInstances[key].stop();
        }
    }

    /** Start playing a background tune */
    public playMusic(key: string, volume: number = 1): void
    {
        if (SaveGame.MusicMuted)
        {
            //Even though the music is currently turned off, keep track of the last music we wanted to play.
            //This way, when we turn the music on again, we already know which song to play.
            this.music = this._sound.play(key, volume, true);

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

    /* Fade music folume to a spesific new volume */
    public fadeMusicVolume(duration: number, volume: number): void
    {
        if (this.music)
        {
            this.music.fadeTo(duration, volume);
        }
    }

    /** Stop the music */
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

    /** Toggle the sfx mute switch */
    public toggleSfx(): void
    {
        SaveGame.SFXMuted = !SaveGame.SFXMuted;
    }

    /** Toggle the music mute switch */
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
