export type User = {
  id: number;
  username: string;
  name: string;
  img?: string;
  createdAt: number;
  //
  bio?: string;
  email?: string;
  //
  totalFollowers: number;
  totalFollowing: number;
  totalStatuses: number;
  //
  relation?: {
    blockned: boolean;
    followed: boolean;
    totalInterFollowing: number;
  };
};
