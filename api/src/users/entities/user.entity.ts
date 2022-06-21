import { BeforeCreate, Entity, Index, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../__shared__/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ length: 50, unique: true })
  username!: string;

  @Property({ length: 100 })
  name!: string;

  @Property({ unique: true })
  email: string;

  @Property({ nullable: true })
  bio?: string;

  @Property({ nullable: true })
  img?: string;

  @Exclude()
  @Property({ hidden: true })
  password: string;

  @Exclude()
  @Index()
  @Property({ nullable: true, hidden: true })
  rating: number;

  @Exclude()
  @Index()
  @Property({ nullable: true, hidden: true, type: 'timestamptz' })
  deletedAt?: Date;

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  static isSearchable(column: string) {
    return ['createdAt'].includes(column);
  }
}
