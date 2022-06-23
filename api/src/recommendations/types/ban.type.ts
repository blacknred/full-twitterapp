import { User } from '../../users/types/user.type';

export type Ban = {
  user: User;
  createdAt: string;
};
