import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { Exclude, Expose } from 'class-transformer';
import { ObjectId } from 'mongodb';

export abstract class BaseEntity {
  @Exclude()
  @PrimaryKey()
  _id: ObjectId;

  @Expose()
  @SerializedPrimaryKey()
  id!: string;

  @Property({ length: 500 })
  name!: string;

  @Property()
  createdAt = new Date();

  constructor(partial?: unknown) {
    Object.assign(this, partial);
  }
}
