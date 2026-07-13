import bcrypt from 'bcrypt';

export async function hashWord(word: string): Promise<string> {
    return await bcrypt.hash(word, 8);
}

export async function compareWords(plainWord: string, hashedWord: string): Promise<boolean> {
    return await bcrypt.compare(plainWord, hashedWord);
}