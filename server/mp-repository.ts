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

  getMemberAndPoints(): RepositoryObject {
    return this.otf.read();
  }

  getMemberPoints(email: string): number {
    let points = this.otf.read()[email];
    if (points == null) {
      points = 10;
      this.otf.update(email, points);
    }
    return points;
  }

  trySendMemberPoints(
    fromEmail: string,
    toEmail: string,
    points: number
  ): boolean {
    if (points < 0) return false;

    const success = this.removePoints(fromEmail, points);
    if (success) {
      this.addPoints(toEmail, points);
    }
    return success;
  }
}
