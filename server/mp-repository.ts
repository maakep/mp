import { isAdministrator } from './admin';
import { MongoClient, WithId } from 'mongodb';
import * as database from './db/db';
import { DbObject } from './db/db';
import { isAccomplished } from './loot-box';

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

  async addPoints(user: DbObject, points: number): Promise<boolean> {
    const success = await this.update(user, points);
    return success;
  }

  async removePoints(user: DbObject, points: number): Promise<boolean> {
    const userPoints = await this.getMemberPoints(user.email);
    const newPoints =  userPoints - points;
    
    if (newPoints < 0) {
      return false;
    }

    const success = await this.update(user, -points);
    return success;
  }

  async update(user: DbObject, pointsDiff: number): Promise<boolean> {
    const success = await database.updatePoints(user.email, pointsDiff);

    if (success) {
      user.points += pointsDiff;
    }

    return success;
  }

  async getMemberPoints(email: string): Promise<number> {
    if (this.cache.length == 0) return 0;

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
    fromAccount: string,
    toAccount: string,
    pointsString: string,
    dontRemove: boolean = false
  ): Promise<boolean> {

    const fromUser = this.cache.find(x => x.email == fromAccount);

    const toUser = toAccount.includes('@')
      ? this.cache.find(x => x.email == toAccount)
      : this.cache.find(x => x.username?.toLowerCase() == toAccount);

    if (toUser == null) {
      return false;
    }

    const isAdmin = isAdministrator(fromUser.email);
    const points = parseFloat(pointsString);
    if (isNaN(points) || (points < 0 && !isAdmin)) return false;

    const dontRemovePoints = isAdmin && dontRemove;
    let removeSuccess = true;
    let addSuccess = true;

    if (!dontRemovePoints || isAccomplished()) {
      removeSuccess = await this.removePoints(fromUser, points);
    }

    if (removeSuccess) {
      addSuccess = await this.addPoints(toUser, points);
    }

    if (removeSuccess && !addSuccess) {
      // If this fails, your money is lost. Contact customer support LUL
      await this.addPoints(fromUser, points);
    }

    return removeSuccess && addSuccess;
  }

  async updateUsername(email: string, username: string) {
    const isUnique = this.cache.find(x => x.username?.toLowerCase() == username.toLowerCase()) == undefined;
    const isValid = username.match(/^[0-9a-zA-ZåäöÅÄÖ_]{3,17}$/);
    let success = false;

    if (isUnique && isValid) {
      success = await database.updateUsername(email, username);
      if (success) {
        this.cache.find(x => x.email).username = username;
      }
    }

    return {success: success, message: success 
      ? "Username updated" 
      : "Failed to update username, make sure it is unique, doesn't have abnormal characters and is between 3-17 characters" };
  }
}
