import { IAuth, IPushSubscription } from '../interfaces/auth.interface';

export class Auth implements IAuth {
  pushSubscriptions: IPushSubscription[];
  user: {
    id: number;
    name: string;
    email: string;
    image?: string;
    phone?: string;
    isAdmin: null;
  };
}
