import { isAdministrator } from './admin';
import { MongoClient, WithId } from 'mongodb';
import * as database from './db/db';
import { DbObject } from './db/db';

export class MpRepository {
  client: MongoClient;
  cache: DbObject[] = [];

  constructor() {
    const hour = 60*60*1000;
    this.refreshCache();
    setInterval(() => this.refreshCache(), 0.5*hour);
  }

  async refreshCache() {
    const res = await this.getAllMembersAndPoints();
    this.cache = res;
  }

  async getAllMembersAndPoints(): Promise<DbObject[]> {
    const res = await database.getAllMembersAndPoints();
    return res;
  }

  async addPoints(userEmail: string, points: number): Promise<boolean> {
    const success = await this.update(userEmail, points);
    return success;
  }

  async removePoints(userEmail: string, points: number): Promise<boolean> {
    const userPoints = await this.getMemberPoints(userEmail);
    const newPoints =  userPoints - points;
    
    if (newPoints < 0) {
      return false;
    }

    const success = await this.update(userEmail, points);
    return success;
  }

  async update(email: string, pointsDiff: number): Promise<boolean> {
    const success = await database.updatePoints(email, pointsDiff);

    if (success) {
      this.cache.find(x => x.email == email).points += pointsDiff;
    }

    return success;
  }

  async getMemberPoints(email: string): Promise<number> {
    const res = this.cache.find(x => x.email == email);
    
    if (res != null) {
      return res.points;
    } 

    const {success, id, ...newUser} = await database.insertNewUser(email);

    if (!success) {
      this.refreshCache();
    } else {
      this.cache.push({...newUser, _id: id});
    }
    return newUser.points;
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
