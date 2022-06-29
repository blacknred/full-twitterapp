import { Entity, Index, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Report {
  @PrimaryKey()
  id: number;

  @Property()
  uid!: number;

  @Property({ nullable: true })
  sid?: number;

  @Property({ length: 500 })
  reason!: string;

  @Index()
  @Property()
  createdAt: Date = new Date();

  constructor(report?: Partial<Report>) {
    Object.assign(this, report);
  }
}
