import db from '../db';

export interface WordType {
  _id: string;
  original: string;
  viletaintified: string;
  score: number;
}

class Words {
  private db = db.words;

  public createWord = (word: string, viletaintified: string): Promise<WordType> =>
    new Promise((resolve, reject): void => {
      this.db.insert(
        {
          _id: word,
          original: word,
          viletaintified,
          score: 0,
        },
        (err, newWord: WordType): void => {
          if (newWord) {
            return resolve(newWord);
          }

          return reject(err);
        }
      );
    });

  public getWord = ({ word, viletaintified }): Promise<WordType> =>
    new Promise((resolve): void => {
      this.db.findOne({ _id: word }, async (err, fetchedWord: WordType) => {
        if (!fetchedWord) {
          const newWord = await this.createWord(word, viletaintified);
          resolve(newWord);
        }

        return resolve(fetchedWord);
      });
    });

  public getWords = (words: string[]): Promise<WordType[]> =>
    new Promise((resolve, reject): void => {
      this.db.find(
        { original: { $in: words } },
        (err, fetchedWords: WordType[]) => {
          if (err) {
            reject(err);
          }

          return resolve(fetchedWords.sort((a, b) => b.score - a.score));
        }
      );
    });

  public updateScore = async (
    word: { word: string; viletaintified: string },
    score: number
  ): Promise<void> => {
    const fetchedWord = await this.getWord(word);

    this.db.update({ original: fetchedWord.original }, { $inc: { score } });
  };
}

const words = new Words();

export default words;
