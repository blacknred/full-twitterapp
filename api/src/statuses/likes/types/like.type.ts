import type { Status } from '../../statuses/types/status.type';
import type { User } from '../../../users/users/types/user.type';

export type Like = {
  user?: User;
  status?: Status;
};
