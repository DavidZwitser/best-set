interface ISaveData
{
    sm: boolean;
    mm: boolean;
    hs: number;
}

export default class SaveData
{
    private static _StorageKey: string = 'bs-saveData';

    public static Init(): void
    {
        if (this.data !== null) { return; }

        this.data = {
            'sm': false,
            'mm': false,
            'hs': 0
        };

    }

    /** Set if the sfx are muted in cache */
    public static set SFXMuted(value: boolean)
    {
        let newData: ISaveData = this.data;
        newData.sm = value;

        this.data = newData;
    }
    public static get SFXMuted(): boolean
    {
        return this.data.sm;
    }

    /** Save if the sound is muted in cache */
    public static set MusicMuted(value: boolean)
    {
        let newData: ISaveData = this.data;
        newData.mm = value;

        this.data = newData;
    }
    public static get MusicMuted(): boolean
    {
        return this.data.mm;
    }

    /** Set highscore in cache */
    public static set Highscore(value: number)
    {
        let newData: ISaveData = this.data;
        newData.hs = value;

        this.data = newData;
    }
    public static get Highscore(): number
    {
        return this.data.hs;
    }

    /** Set or get the cached data */
    private static set data(data: ISaveData)
    {
        localStorage.setItem(SaveData._StorageKey, JSON.stringify(data));
    }
    private static get data(): ISaveData
    {
        return JSON.parse(localStorage.getItem(SaveData._StorageKey));
    }

}
