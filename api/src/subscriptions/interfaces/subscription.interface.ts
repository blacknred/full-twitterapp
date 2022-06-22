import { IUser } from '../../users/interfaces/user.interface';

export interface ISubscription {
  id: number;
  createdAt: string;
  user: IUser;
  subUser?: IUser;
}
