import { ArrayType, Entity, Property } from '@mikro-orm/core';

@Entity()
export class Status {
  @Property({ unique: true })
  id!: number;

  @Property({ length: 140, nullable: true })
  txt?: string;

  @Property({ type: ArrayType, default: [] })
  assets?: string[] = [];

  @Property()
  uid!: string;

  @Property()
  sid!: string;

  @Property()
  ts: Date = new Date();

  @Property()
  tlk!: number;

  @Property()
  trp!: number;

  @Property()
  trl!: number;

  constructor(status?: Partial<Status>) {
    Object.assign(this, status);
  }
}
