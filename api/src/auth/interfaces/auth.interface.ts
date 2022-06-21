import { IUser } from './user.interface';

export interface IPushSubscription {
  endpoint: string;
  expirationTime?: string;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export interface IAuth {
  user: Partial<IUser>;
  pushSubscriptions: IPushSubscription[];
}
