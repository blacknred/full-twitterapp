import { Index, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity<T = unknown> {
  @SerializedPrimaryKey()
  id!: number;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Exclude()
  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  constructor(partial?: T) {
    Object.assign(this, partial);
  }
}
