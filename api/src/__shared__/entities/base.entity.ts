import { Index, Property, PrimaryKey } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

export abstract class BaseEntity<T = Record<string, unknown>> {
  @PrimaryKey()
  id: number;

  @Index()
  @Property({ onCreate: () => new Date() })
  createdAt = new Date();

  @Exclude()
  @Property({ onUpdate: () => new Date(), hidden: true })
  updatedAt = new Date();

  constructor(partial?: T) {
    Object.assign(this, partial);
  }
}
