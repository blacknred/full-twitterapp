export type User = {
  id: number;
  username: string;
  name: string;
  bio?: string;
  img?: string;
  createdAt: number;
  email?: string;
  //
  totalFollowers: number;
  totalFollowing: number;
  totalStatuses: number;
  //
  relation: {
    banned: boolean;
    followed: boolean;
    totalInterFollowing: number;
  };
};
