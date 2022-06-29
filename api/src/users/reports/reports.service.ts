import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

import { CreateReportDto } from './dto/create-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(
    private readonly redisService: RedisService,
    @InjectRepository(Report)
    private reportRepository: EntityRepository<Report>,
  ) {}

  async create(createReportDto: CreateReportDto) {
    const users = await this.redisService.getClient('users');
    const statuses = await this.redisService.getClient('statuses');

    const { uid, sid } = createReportDto;

    if (!(await users.exists(`USER:${uid}`))) {
      throw new ConflictException({
        errors: [{ field: 'uid', message: 'User not exists' }],
      });
    }

    if (sid && !(await statuses.exists(`STATUS:${sid}`))) {
      throw new ConflictException({
        errors: [{ field: 'sid', message: 'Status not exists' }],
      });
    }

    const report = new Report(createReportDto);
    await this.reportRepository.persistAndFlush(report);

    return { data: report };
  }
}
