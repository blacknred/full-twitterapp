export type User = {
  id: number;
  username: string;
  name: string;
  bio?: string;
  img?: string;
  createdAt: string;
  //
  email?: string;
  followersCnt: number;
  followingCnt: number;
  statusesCnt: number;
};
