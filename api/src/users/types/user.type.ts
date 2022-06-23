export type User = {
  id: number;
  username: string;
  name: string;
  bio?: string;
  img?: string;
  isAdmin?: boolean;
  createdAt: string;
  //
  email?: string;
  followersCnt: number;
  followingCnt: number;
  statusesCnt: number;
  bannedByMe: boolean;
};
