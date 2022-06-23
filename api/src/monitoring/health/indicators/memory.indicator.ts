import type { HealthIndicatorResult } from '@nestjs/terminus';
import { MemoryHealthIndicator } from '@nestjs/terminus';

import { PrometheusService } from '../../prometheus/prometheus.service';
import type { HealthIndicator } from '../types/health-indicator.type';
import { BaseIndicator } from './base.indicator';

export class MemoryIndicator extends BaseIndicator implements HealthIndicator {
  readonly name = 'MemoryHealthIndicator';
  protected readonly help = 'Status of ' + this.name;
  private readonly limit = 150 * 1024 * 1024;
  private readonly indicator = new MemoryHealthIndicator();
  protected readonly prometheusService?: PrometheusService;

  constructor(prometheusService?: PrometheusService) {
    super();
    this.prometheusService = prometheusService;
    this.registerMetrics();
    // this.registerGauges();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    // The heap should not use more than 150MB memory
    const result = await this.indicator.checkHeap('memory_heap', this.limit);
    // The process should not use more than 150MB memory
    // this.indicator.checkRSS('memory_heap', this.limit);
    // The process should not have more than 150MB allocated
    // this.indicator.checkRSS('memory_rss', this.limit);

    this.updatePrometheusData(true);
    return result;
  }
}
