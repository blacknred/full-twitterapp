import { BeforeCreate, Entity, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/__shared__/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Property({ length: 50, unique: true })
  username!: string;

  @Property({ length: 100 })
  name!: string;

  @Property({ nullable: true })
  bio?: string;

  @Property({ unique: true })
  email: string;

  @Exclude()
  @Property()
  password: string;

  @Property({ nullable: true })
  img?: string;

  @Property({ nullable: true })
  rating: number;

  @Exclude()
  @Property({ nullable: true })
  deletedAt?: string;

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  static isSearchable(column: string) {
    return ['name', 'creatorId', 'createdAt'].includes(column);
  }

  static isNotSecured(column: string) {
    return ['id', 'name', 'image'].includes(column);
  }
}
