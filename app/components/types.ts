export interface Word {
    word: string;
    definition:string;
    imgurl:string;
}

export interface Char {
    char: string
    inputChar: string
    index: number
    state: number // 0 white 1 right  2 wrong
}


export interface FuncKey {
    char: string
    key: string
}