import { BeforeCreate, Entity, Property } from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User {
  // bd part

  @Property({ unique: true })
  id: number;

  @Property({ unique: true, length: 50 })
  username!: string;

  @Property({ unique: true })
  email!: string;

  @Property({ length: 500, nullable: true })
  bio?: string;

  @Property({ hidden: true })
  password: string;

  @BeforeCreate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  // cache part

  un: string;
  fn: string;
  img?: string;
  ts = Date.now();
  tss = 0;
  tfr = 0;
  tfg = 0;

  constructor(user?: Partial<User>) {
    Object.assign(this, user);
    this.un = this.un ?? user.username;
  }

  // utils

  *next() {
    const names = ['id', 'un', 'fm', 'img', 'ts', 'tss', 'tfr', 'tfg'];
    yield* names.reduce((all, n) => all.concat(n, this[n]), []);
  }

  [Symbol.iterator]() {
    return this.next();
  }

  static toObject(user: User) {
    return {
      id: user.id,
      username: user.un,
      name: user.fn,
      img: user.img,
      createdAt: user.ts,

      bio: user.bio,
      email: user.email,

      totalFollowers: user.tfr,
      totalFollowing: user.tfg,
      totalStatuses: user.tss,

      //   relation?: {
      //     blockned: boolean;
      //     followed: boolean;
      //     totalInterFollowing: number;
      //   };
    };
  }

  toObject() {
    User.toObject(this);
  }
}
