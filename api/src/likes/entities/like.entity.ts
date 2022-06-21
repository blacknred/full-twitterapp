import { Entity, Index, ManyToOne } from '@mikro-orm/core';
import { Tweet } from 'src/tweets/entities/tweet.entity';
import { User } from 'src/users/entities/user.entity';
import { BaseEntity } from 'src/__shared__/entities/base.entity';

@Entity()
@Index({ properties: ['user', 'tweet'] })
export class Like extends BaseEntity {
  static isSearchable(column: string) {
    return ['createdAt', 'userId', 'tweetId'].includes(column);
  }

  @ManyToOne()
  @Index()
  user: User;

  @ManyToOne()
  @Index()
  tweet: Tweet;
}
