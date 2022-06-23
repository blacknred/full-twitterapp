import { IUser, User } from '../../users/types/user.type';

export type Subscription = {
  id: number;
  createdAt: string;
  user: User;
  subUser?: User;
};
