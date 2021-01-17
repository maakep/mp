import { ObjectToFile } from './object-to-file';

class MpRepository {
  otf: ObjectToFile;

  constructor() {
    this.otf = new ObjectToFile('members');
  }

  addPoints(userEmail: string, points: number) {
    const newPoints = this.getMemberPoints(userEmail) + points;
    this.otf.update(userEmail, newPoints);
  }

  getMembers() {
    return this.otf.read();
  }

  getMemberPoints(email: string) {
    return this.otf.read()[email];
  }
}
