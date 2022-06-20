import { Index, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { Expose } from 'class-transformer';

export abstract class BaseEntity {
  @Expose()
  @SerializedPrimaryKey()
  id!: number;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(partial?: unknown) {
    Object.assign(this, partial);
  }
}
