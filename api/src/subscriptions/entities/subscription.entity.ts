import { Entity, ManyToOne, Property, Index } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/__shared__/entities/base.entity';

@Entity()
export class Subscription extends BaseEntity {
  @Property()
  userId: number;

  @Property()
  subUserId: number;

  static isSearchable(column: string) {
    return ['createdAt', 'userId', 'subUserId'].includes(column);
  }

  @ManyToOne(() => User, 'id')
  @Index()
  user: User;

  @ManyToOne(() => User, 'id')
  @Index()
  subUser: User;
}
