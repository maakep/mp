import * as fs from 'fs';
import * as path from 'path';

export type RepositoryObject = {
  [email: string]: number;
};

export class ObjectToFile {
  fileName: string;
  data: RepositoryObject;

  public constructor(fileName: string) {
    this.fileName = path.resolve(fileName + '.json');
    this.data = {};

    if (!fs.existsSync(this.fileName)) {
      fs.writeFileSync(this.fileName, '{}');
    } else {
      const file = fs.readFileSync(this.fileName, 'utf8');
      this.data = JSON.parse(file);
    }
  }

  read(): any {
    return this.data;
  }

  update(key: string, value: number): void {
    if (value == null) value = 0;

    this.data[key] = value;
    this.sync();
  }

  async sync(): Promise<void> {
    fs.writeFileSync(this.fileName, JSON.stringify(this.data), 'utf8');
  }
}
