import { IUser } from '../../users/interfaces/user.interface';

export interface ISubscription {
  id: number;
  userId: number;
  subUserId?: number;
  createdAt: string;
  //
  user: IUser;
  subUser?: IUser;
}
