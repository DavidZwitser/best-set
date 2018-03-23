interface ISaveData
{
    sm: boolean;
    mm: boolean;
    hs: number;
}

export default class SaveData
{
    private static StorageKey: string = 'bs-saveData';

    /* Set if the sfx are muted in cache */
    set SFXMuted(value: boolean)
    {
        let newData: ISaveData = this.data;
        newData.sm = value;

        this.data = newData;
    }
    get SFXMuted(): boolean
    {
        return this.data.sm;
    }

    /* Save if the sound is muted in cache */
    set musicMuted(value: boolean)
    {
        let newData: ISaveData = this.data;
        newData.mm = value;

        this.data = newData;
    }
    get musicMuted(): boolean
    {
        return this.data.mm;
    }

    /* Set highscore in cache */
    set highscore(value: number)
    {
        let newData: ISaveData = this.data;
        newData.hs = value;

        this.data = newData;
    }
    get highscore(): number
    {
        return this.data.hs;
    }

    /* Set or get the cached data */
    set data(data: ISaveData)
    {
        localStorage.setItem(SaveData.StorageKey, JSON.stringify(data));
    }
    get data(): ISaveData
    {
        return JSON.parse(localStorage.getItem(SaveData.StorageKey));
    }

}
