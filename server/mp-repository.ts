import { isAdministrator } from './admin';
import { MongoClient, WithId } from 'mongodb';

export type DbObject = WithId<DbObjectInsert>

type DbObjectInsert = {
  email: string;
  points: number;
}

const startingPoints = 10;


export class MpRepository {
  client: MongoClient;
  cache: DbObject[] = [];

  constructor() {
    const key = process.env.mongokey || require("../api-keys-etc/secret").mongokey;
    this.client = new MongoClient(key);
    this.refreshCache();
  }

  getCollection() {
    const db = this.client.db('mp');
    const collection = db.collection('points');
    return collection;
  }

  async refreshCache() {
    const res = await this.getAllMembersAndPoints();
    this.cache = res;
    console.log(this.cache);
  }

  async getAllMembersAndPoints(): Promise<DbObject[]> {
    await this.client.connect();
    const db = this.client.db('mp');
    const res = await db.collection('points').find({}).toArray();
    await this.client.close();
    return res as DbObject[];
  }

  async addPoints(userEmail: string, points: number): Promise<boolean> {
    const userPoints = await this.getMemberPoints(userEmail);
    const newPoints = userPoints + points;
    const success = await this.update(userEmail, newPoints);
    return success;
  }

  async removePoints(userEmail: string, points: number): Promise<boolean> {
    const userPoints = await this.getMemberPoints(userEmail);
    const newPoints =  userPoints - points;
    
    if (newPoints < 0) {
      return false;
    }

    const success = await this.update(userEmail, newPoints);
    return success;
  }

  async update(email: string, newPoints: number): Promise<boolean> {
    await this.client.connect();
    var col = this.getCollection();
    const res = await col.findOneAndUpdate({email: email}, { $set: {points: newPoints}});
    await this.client.close();

    const success = res.ok == 1;
    if (success) {
      this.cache.find(x => x.email == email).points = newPoints;
    }
    return success;
  }

  

  

  async getMemberPoints(email: string): Promise<number> {
    const res = this.cache.find(x => x.email == email);
    
    if (res != null) {
      return res.points;
    } 

    const user = await this.insertNewUser(email);
    return user.points;
  }

  async insertNewUser(email: string): Promise<DbObjectInsert> {
    const newUser: DbObjectInsert = {email: email, points: startingPoints};
    await this.client.connect();
    const col = this.getCollection();
    const r = await col.insertOne(newUser)

    if (!r.acknowledged) {
      this.refreshCache();
    } else {
      this.cache.push({...newUser, _id: r.insertedId});
    }
    this.client.close();

    return newUser;
  }

  async trySendMemberPoints(
    fromEmail: string,
    toEmail: string,
    pointsString: string,
    dontRemove: boolean = false
  ): Promise<boolean> {
    const isAdmin = isAdministrator(fromEmail);
    const points = parseFloat(pointsString);
    if (isNaN(points) || (points < 0 && !isAdmin)) return false;

    const dontRemovePoints = isAdmin && dontRemove;
    let removeSuccess = true;
    let addSuccess = true;

    if (!dontRemovePoints) {
      removeSuccess = await this.removePoints(fromEmail, points);
    }

    if (removeSuccess) {
      addSuccess = await this.addPoints(toEmail, points);
    }

    if (removeSuccess && !addSuccess) {
      // If this fails, your money is lost. Contact customer support LUL
      await this.addPoints(fromEmail, points);
    }

    return removeSuccess && addSuccess;
  }
}
