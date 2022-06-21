import { IUser } from '../../users/interfaces/user.interface';

export interface ITweet {
  id: number;
  text?: string;
  media: string[];
  hashes: string[];
  authorId: number;
  originId?: number;
  createdAt: string;
  //
  author: IUser;
  origin?: ITweet;
}
