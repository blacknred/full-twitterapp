import { ArrayType, Entity, Index, ManyToOne, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';
import { User } from '../../users/entities/user.entity';
import { BaseEntity } from '../../__shared__/entities/base.entity';

@Entity()
export class Tweet extends BaseEntity {
  @Property({ length: 140, nullable: true })
  text?: string;

  @Property({ type: ArrayType, default: [] })
  media: string[] = [];

  @Property({ type: ArrayType, default: [] })
  hashes: string[] = [];

  @Exclude()
  @Index()
  @Property({ nullable: true, hidden: true, type: 'timestamptz' })
  deletedAt?: Date;

  static isSearchable(column: string) {
    return ['createdAt', 'hashes', 'authorId', 'originId'].includes(column);
  }

  @ManyToOne()
  @Index()
  author: User;

  @ManyToOne({ nullable: true })
  @Index()
  origin?: Tweet;
}
