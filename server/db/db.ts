import { MongoClient, ObjectId, WithId } from 'mongodb';

export type DbObject = WithId<DbObjectInsert>

export type DbObjectInsert = {
  email: string;
  points: number;
  username: string;
}

const key = process.env.mongokey;
const client = new MongoClient(key);

const STARTING_POINTS = 1;

export async function updatePoints(email: string, pointsDiff: number): Promise<boolean> {
  await client.connect();
  var col = pointsCollection();
  const res = await col.findOneAndUpdate({email: email}, { $inc: { points: pointsDiff }});
  await client.close();

  return res.ok == 1;
}

export async function updateUsername(email: string, username: string): Promise<boolean> {
  await client.connect();
  var col = pointsCollection();
  const res = await col.findOneAndUpdate({email: email}, { $set: { username: username }});
  await client.close();

  return res.ok == 1;
}

export async function getAllMembersAndPoints(): Promise<DbObject[]> {
  await client.connect();
  const col = pointsCollection();
  const res = await col.find({}).toArray();
  await client.close();
  return res as DbObject[];
}

function pointsCollection() {
  const db = client.db('mp');
  const collection = db.collection('points');
  return collection;
}

export async function insertNewUser(email: string): Promise<DbObjectInsert & {success: boolean, id: ObjectId}> {
  const newUser: DbObjectInsert = {email: email, username: email.replace("@gmail.com", ""), points: STARTING_POINTS};
  await client.connect();
  const col = pointsCollection();
  const r = await col.insertOne(newUser)
  await this.client.close();

  return {...newUser, success: r.acknowledged, id: r.insertedId};
}

