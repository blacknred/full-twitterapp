import type { HealthIndicatorResult } from '@nestjs/terminus';
import { DiskHealthIndicator } from '@nestjs/terminus';

import { PrometheusService } from '../../prometheus/prometheus.service';
import type { HealthIndicator } from '../types/health-indicator.type';
import { BaseIndicator } from './base.indicator';

export class DiskIndicator extends BaseIndicator implements HealthIndicator {
  readonly name = 'DiskHealthIndicator';
  protected readonly help = 'Status of ' + this.name;
  private readonly indicator = new DiskHealthIndicator(null);
  protected readonly prometheusService?: PrometheusService;

  constructor(prometheusService?: PrometheusService) {
    super();
    this.prometheusService = prometheusService;
    // this.registerMetrics();
    this.registerGauges();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    // The used disk storage should not exceed 50% of the full disk size
    const result = await this.indicator.checkStorage('disk storage', {
      thresholdPercent: 0.5,
      path: '/',
    });

    this.updatePrometheusData(true);
    return result;
  }
}
