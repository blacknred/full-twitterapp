import { Options } from '@mikro-orm/core';
import { ConfigService } from '@nestjs/config';
import { Like } from './src/likes/entities/like.entity';
import { Subscription } from './src/subscriptions/entities/subscription.entity';
import { Tweet } from './src/tweets/entities/tweet.entity';
import { User } from './src/users/entities/user.entity';

// initialize the ConfigService manually since it is not a part of a NestJS app
const configService = new ConfigService();

const MikroOrmConfig: Options = {
  entities: [User, Tweet, Subscription, Like],
  clientUrl: configService.get('DB_URL'),
  type: 'postgresql',
};

export default MikroOrmConfig;
