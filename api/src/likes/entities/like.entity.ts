import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/__shared__/entities/base.entity';

@Entity()
export class Like extends BaseEntity {
  @Property()
  userId: number;

  @Property()
  tweetId: number;

  static isSearchable(column: string) {
    return ['createdAt', 'userId', 'tweetId'].includes(column);
  }

  @OneToOne(() => User, 'id')
  user: User;

  @OneToOne(() => Tweet, 'id', { nullable: true })
  tweet?: Tweet;
}
