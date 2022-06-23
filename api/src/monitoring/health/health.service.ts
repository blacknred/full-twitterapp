import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { HealthCheckResult } from '@nestjs/terminus';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

import { PrometheusService } from '../prometheus/prometheus.service';
import { MemoryIndicator } from './indicators/memory.indicator';
import type { HealthIndicator } from './types/health-indicator.type';

@Injectable()
export class HealthService {
  private readonly targets: HealthIndicator[];
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private configService: ConfigService,
    private health: HealthCheckService,
    private prometheusService: PrometheusService,
  ) {
    this.targets = [
      new MemoryIndicator(this.prometheusService),
      // new DiskIndicator(this.prometheusService),
    ];
  }

  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return await this.health.check(
      this.targets.map((indicator) => async () => {
        try {
          return await indicator.isHealthy();
        } catch (e) {
          this.logger.warn(e);
          return indicator.reportUnhealthy();
        }
      }),
    );
  }
}
