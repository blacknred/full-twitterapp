import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics, Histogram, Gauge } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly prefix = '';
  private readonly registry: Registry;
  private registeredMetrics: Record<string, Histogram<string>> = {};
  private registeredGauges: Record<string, Gauge<string>> = {};

  constructor() {
    // create a registry which registers the metrics
    this.registry = new Registry();

    // add a default label which is added to all metrics
    this.registry.setDefaultLabels({
      app: 'Backend_Monitoring',
    });

    // enable default metrics
    collectDefaultMetrics({
      register: this.registry,
      prefix: this.prefix,
    });
  }

  get metrics(): Promise<string> {
    return this.registry.metrics();
  }

  removeMetric(name: string) {
    return this.registry.removeSingleMetric(name);
  }

  clearMetrics() {
    this.registry.resetMetrics();

    return this.registry.clear();
  }

  // register custom metrics & gauges

  registerMetrics(
    name: string,
    help: string,
    labelNames: string[],
    buckets: number[],
  ): Histogram<string> {
    if (!this.registeredMetrics[name]) {
      this.registeredMetrics[name] = new Histogram({
        name,
        help,
        labelNames,
        buckets,
      });

      this.registry.registerMetric(this.registeredMetrics[name]);
    }

    return this.registeredMetrics[name];
  }

  registerGauge(name: string, help: string): Gauge<string> {
    if (!this.registeredGauges[name]) {
      this.registeredGauges[name] = new Gauge({
        name: this.prefix + name,
        help,
      });

      this.registry.registerMetric(this.registeredGauges[name]);
    }

    return this.registeredGauges[name];
  }
}
