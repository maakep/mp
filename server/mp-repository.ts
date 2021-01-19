import { ObjectToFile, RepositoryObject } from './object-to-file';

export class MpRepository {
  otf: ObjectToFile;

  constructor() {
    this.otf = new ObjectToFile('members');
  }

  addPoints(userEmail: string, points: number): void {
    const newPoints = this.getMemberPoints(userEmail) + points;
    this.otf.update(userEmail, newPoints);
  }

  removePoints(userEmail: string, points: number): boolean {
    const newPoints = this.getMemberPoints(userEmail) - points;

    if (!isNaN(newPoints) && newPoints < 0) {
      return false;
    }

    this.otf.update(userEmail, newPoints);
    return true;
  }

  getMembers(): RepositoryObject {
    return this.otf.read();
  }

  getMemberPoints(email: string): number {
    let points = this.otf.read()[email];
    if (points == null) points = 0;
    return points;
  }

  sendMemberPoints(
    fromEmail: string,
    toEmail: string,
    points: number
  ): boolean {
    const success = this.removePoints(fromEmail, points);
    if (success) {
      this.addPoints(toEmail, points);
    }
    return success;
  }
}
