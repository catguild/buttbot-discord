import db from '../db';

class Stats {
  private db = db.servers;

  public trackviletaintification = (): void => {
    this.db.update({ _id: 1 }, { $inc: { viletaintifyCount: 1 } }, { upsert: true });
  };

  public getviletaintifyCount = (): Promise<number> =>
    new Promise((resolve): void => {
      this.db.findOne({ _id: 1 }, (err, stats: { viletaintifyCount: number }) => {
        if (!stats) {
          return resolve(0);
        }

        return resolve(stats.viletaintifyCount || 0);
      });
    });
}

const stats = new Stats();

export default stats;
