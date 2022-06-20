// import { ConfigService } from '@nestjs/config';
// import { ClientProxyFactory, Transport} from '@nestjs/microservices';
// import { QUEUE_SERVICE } from '../consts';

// export const queueProvider = {
//   provide: QUEUE_SERVICE,
//   inject: [ConfigService],
//   useFactory: (configService: ConfigService) =>
//     ClientProxyFactory.create({
//       transport: Transport.RMQ,
//       options: {
//         urls: [configService.get('QUEUE_URL')],
//         queue: 'notifications',
//       },
//     }),
// };
