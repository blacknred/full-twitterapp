import { User } from '../../users/types/user.type';

export type Subscription = {
  user: User;
  createdAt: number;
};
