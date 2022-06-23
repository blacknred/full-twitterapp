import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { HealthCheckResult } from '@nestjs/terminus';

import { HealthService } from './health.service';

@ApiTags('Metrics')
@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async check(): Promise<HealthCheckResult> {
    const healthCheckResult = await this.healthService.check();

    for (const key in healthCheckResult?.info) {
      if (healthCheckResult?.info[key].status === 'down') {
        throw new ServiceUnavailableException(healthCheckResult);
      }
    }

    return healthCheckResult;
  }
}
