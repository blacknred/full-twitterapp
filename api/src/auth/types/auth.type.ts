import { User } from 'src/users/users/types/user.type';

export type PushSubscription = {
  endpoint: string;
  expirationTime?: string;
  keys: {
    auth: string;
    p256dh: string;
  };
};

export type Auth = {
  user: Partial<User>;
  pushSubscriptions: PushSubscription[];
};
