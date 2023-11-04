interface Phase {
  name: string;
  users: number;
  emitListenEvents: number;
}

interface Metric{
  name: string;
  users: number;
  p90: number;
  p95: number;
  p99: number;
  //emitListenEventPerSec: number;
  successRate: number;
  errorRate: number;
}

interface UserMetric{
  responseTimes: number[];
  successCount: number;
  errorCount: number;
}

export {
  Phase,
  Metric,
  UserMetric
}
