import { PaginatedRequestDto } from '../../../__shared__/dto/request.dto';

export class GetUsersDto extends PaginatedRequestDto {
  recommended?: boolean;
  // statusesCnt: 0,  followersCnt: 0, followingCnt: 0,
}
