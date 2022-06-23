import { Status } from '../../statusses/types/status.type';
import { User } from '../../users/types/user.type';

export type Like = {
  user: User;
  status: Status;
  //
  createdAt: string;
};
