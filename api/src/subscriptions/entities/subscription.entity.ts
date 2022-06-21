import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/__shared__/entities/base.entity';

@Entity()
export class Subscription extends BaseEntity {
  static isSearchable(column: string) {
    return ['createdAt', 'userId', 'subUserId'].includes(column);
  }

  @ManyToOne()
  @Index()
  user: User;

  @ManyToOne()
  @Index()
  subUser: User;
}
