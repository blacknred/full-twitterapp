import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  email!: string;

  @Property({ length: 500, nullable: true })
  bio?: string;

  // class-transformer @Exclude wont work with mikroorm, use hidden:true instead
  @Property({ hidden: true })
  password: string;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
  }
}
