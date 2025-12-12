# Notification Service: Architecture Decision

**Decision Date:** December 1, 2025  
**Status:** ✅ Decided - Use Background Services (with migration path to Hangfire + RabbitMQ)

---

## Executive Summary

**Decision:** Implement notification service using **native .NET Background Services** for MVP, with a clear migration path to Hangfire + RabbitMQ when scale demands it.

**Rationale:** 
- Faster development (1-2 days vs 3-5 days)
- Zero additional infrastructure cost
- Aligns with existing monolithic architecture
- Sufficient for 100+ concurrent events
- Simple to maintain and debug

**When to Upgrade:** When reaching 500+ concurrent events or 10,000+ notifications/hour (estimated Q3 2026)

---

## Quick Comparison

| Aspect | Background Services ⭐ | Hangfire + RabbitMQ |
|--------|----------------------|---------------------|
| **Setup Time** | 1-2 days | 3-5 days |
| **Infrastructure** | PostgreSQL only | PostgreSQL + RabbitMQ |
| **Monthly Cost** | $0 extra | +$20-50 |
| **Complexity** | Low | High |
| **Max Throughput** | ~1,000 jobs/min | ~10,000+ jobs/min |
| **Monitoring** | Custom (Grafana) | Built-in dashboard |
| **Best For** | MVP & small-medium scale | Enterprise & high scale |

---

## Detailed Analysis

### Approach 1: Hangfire + RabbitMQ (ChatGPT's Typical Recommendation)

**What it is:**
- **Hangfire**: Enterprise job scheduler with web dashboard
- **RabbitMQ**: Message broker (AMQP protocol) for reliable message delivery
- **Quartz.NET**: Alternative enterprise scheduler (optional)

**Architecture:**
```
Hangfire Scheduler → RabbitMQ Queue → Consumer Workers → Send Notifications
       ↓                    ↓                ↓
   SQL Storage      Message Persistence   Multi-instance
```

**Pros:**
- ✅ Enterprise-grade reliability (5-nines uptime)
- ✅ Web dashboard for job monitoring
- ✅ Automatic retry with exponential backoff
- ✅ Horizontal scaling (add more workers easily)
- ✅ Message persistence (survives crashes)
- ✅ Dead letter queue (failed messages captured)
- ✅ Battle-tested by thousands of companies

**Cons:**
- ❌ Requires RabbitMQ server (500MB-1GB RAM)
- ❌ 3-4 additional NuGet packages
- ❌ Steeper learning curve
- ❌ More complex deployment
- ❌ Higher infrastructure cost
- ❌ Network overhead (message serialization)
- ❌ Overkill for MVP scale

**Cost:**
- RabbitMQ server: $20-50/month (VPS)
- Development time: +2-3 days
- Maintenance overhead: +10-20%

---

### Approach 2: Background Services ⭐ (Recommended for MVP)

**What it is:**
- **BackgroundService**: Native .NET hosted service
- **PostgreSQL**: Existing database as job queue
- **Zero external dependencies**: All built-in

**Architecture:**
```
Background Service (Scheduler) → PostgreSQL (notification_jobs) → Background Service (Processor) → Send Notifications
                                         ↓
                                  ACID Guarantees
```

**Pros:**
- ✅ Zero external dependencies
- ✅ Simple architecture (easy to understand)
- ✅ No additional infrastructure
- ✅ Fast development (1-2 days)
- ✅ Cost-effective ($0 extra)
- ✅ Database ACID guarantees
- ✅ Easy debugging (all in one app)
- ✅ Perfect for MVP scale

**Cons:**
- ❌ Harder to scale horizontally (need distributed locking)
- ❌ No built-in monitoring dashboard
- ❌ Manual retry logic implementation
- ❌ Database polling overhead
- ❌ Single point of failure (app crash = jobs pause)
- ❌ Tightly coupled to main application

**Cost:**
- Infrastructure: $0 (uses existing PostgreSQL)
- Development time: 1-2 days
- Maintenance overhead: Low

---

## Why Background Services Win for Your Project

### 1. **Your Architecture is Monolithic**
You deliberately chose monolithic architecture for simplicity. Adding RabbitMQ contradicts this decision.

```
Current: Frontend → Backend → PostgreSQL ✅ Simple
With RabbitMQ: Frontend → Backend → PostgreSQL + RabbitMQ ❌ Complex
```

### 2. **Your Scale Doesn't Require It Yet**
- Target: 100+ concurrent events
- Athletes per event: ~50-200
- Notifications: 2 per athlete (24h + 1h)
- Peak load: ~400 notifications per event × 100 events = 40,000 notifications/day
- That's **~28 notifications/minute** on average

Background Services can handle **1,000+ jobs/minute** - you have 35x headroom!

### 3. **Development Velocity Matters**
- MVP launch timeline: Critical
- Background Services: 1-2 days implementation
- Hangfire + RabbitMQ: 3-5 days setup + 2 days learning

**Savings: 4-6 days = $2,000-$3,000 in development cost**

### 4. **Infrastructure Simplicity**
- Current stack: VPS + Docker + PostgreSQL + Nginx
- With RabbitMQ: VPS + Docker + PostgreSQL + Nginx + **RabbitMQ + RabbitMQ Management Plugin**

**Additional maintenance:**
- RabbitMQ monitoring
- RabbitMQ updates
- RabbitMQ security patches
- RabbitMQ backup strategy
- RabbitMQ network configuration

### 5. **Team Familiarity**
- Background Services: Standard .NET pattern (everyone knows)
- Hangfire: Requires learning
- RabbitMQ: Requires learning + AMQP protocol understanding
- MassTransit: Another abstraction layer to learn

---

## Migration Path: Start Simple, Scale Smart

### Phase 1: MVP (Month 1-3) - Background Services ⭐

**Implementation:**
```csharp
builder.Services.AddHostedService<NotificationSchedulerService>();
builder.Services.AddHostedService<NotificationProcessorService>();
builder.Services.AddHostedService<NotificationCleanupService>();
```

**What you get:**
- ✅ Working notification system
- ✅ 24h + 1h reminders
- ✅ Multi-channel delivery (Push, Email, In-app)
- ✅ User preferences
- ✅ Zero extra cost

**Time to implement:** 1-2 days

---

### Phase 2: Add Monitoring (Month 3-6) - Hangfire (Optional)

**When:** After MVP launch, when you need better monitoring

**Implementation:**
```csharp
// Add Hangfire for dashboard + reliability
builder.Services.AddHangfire(config => 
    config.UsePostgreSqlStorage(connectionString));
builder.Services.AddHangfireServer();

// Migrate Background Services to Hangfire jobs
RecurringJob.AddOrUpdate<NotificationSchedulerService>(
    "schedule-reminders",
    service => service.ScheduleReminders(),
    "*/5 * * * *" // Cron expression
);
```

**What you get:**
- ✅ Web dashboard for monitoring
- ✅ Better retry logic
- ✅ Job history tracking
- ✅ Still no RabbitMQ needed

**Cost:** 1 day migration + $0 infrastructure

---

### Phase 3: Scale to Enterprise (Month 12+) - Add RabbitMQ

**When:** You reach these thresholds:
- ✅ 500+ concurrent events
- ✅ 10,000+ notifications/hour
- ✅ Multiple notification workers needed
- ✅ Enterprise SLA requirements
- ✅ Complex message routing needed

**Implementation:**
```csharp
// Add RabbitMQ with MassTransit
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<NotificationConsumer>();
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host("rabbitmq-server", "/", h =>
        {
            h.Username("archery_app");
            h.Password(Environment.GetEnvironmentVariable("RABBITMQ_PASSWORD"));
        });
        
        cfg.ReceiveEndpoint("notification-queue", e =>
        {
            e.ConfigureConsumer<NotificationConsumer>(context);
            e.PrefetchCount = 100;
        });
    });
});

// Hangfire publishes to RabbitMQ
RecurringJob.AddOrUpdate<NotificationSchedulerService>(
    "publish-notification-jobs",
    service => service.PublishToRabbitMQ(),
    "*/5 * * * *"
);
```

**What you get:**
- ✅ Horizontal scaling
- ✅ Message persistence
- ✅ Dead letter queue
- ✅ Enterprise-grade reliability

**Cost:** 2-3 days migration + $30-50/month infrastructure

---

## Real-World Comparison

### Companies Using Background Services
- **Small-Medium SaaS** (100-1,000 users): Common pattern
- **Internal tools**: Standard approach
- **MVPs**: Recommended approach
- **Cost-sensitive startups**: Smart choice

### Companies Using Hangfire + RabbitMQ
- **Uber** (ride notifications): Millions of notifications/day
- **Slack** (message delivery): Billions of messages/day
- **Shopify** (order processing): Millions of orders/day
- **Large e-commerce**: Black Friday scale

**Your scale:** 40,000 notifications/day ≠ Uber's 10,000,000+ notifications/day

---

## Implementation Checklist

### ✅ Background Services (Immediate)

**Week 1: Database Setup**
- [ ] Create `notifications` table (30-day retention)
- [ ] Create `notification_preferences` table
- [ ] Create `device_tokens` table
- [ ] Create `notification_jobs` table (job queue)
- [ ] Add database indexes
- [ ] Add cleanup triggers

**Week 2: Backend Services**
- [ ] Implement `NotificationSchedulerService`
- [ ] Implement `NotificationProcessorService`
- [ ] Implement `NotificationSender` (FCM, Email, In-app)
- [ ] Implement `NotificationCleanupService`
- [ ] Add error handling and logging
- [ ] Unit tests

**Week 3: API Development**
- [ ] `GET /api/v1/notifications` (list with pagination)
- [ ] `POST /api/v1/notifications/{id}/read` (mark read)
- [ ] `POST /api/v1/notifications/read-all` (mark all)
- [ ] `PUT /api/v1/notifications/preferences` (update settings)
- [ ] `POST /api/v1/notifications/device-token` (register device)
- [ ] Integration tests

**Week 4: Frontend Integration**
- [ ] Notification bell component
- [ ] Notification list UI
- [ ] Notification preferences page
- [ ] Firebase Cloud Messaging setup
- [ ] WebSocket integration (optional)

**Week 5: Testing**
- [ ] Load testing (simulate 1,000 notifications)
- [ ] End-to-end testing
- [ ] Monitor Grafana dashboards
- [ ] Performance optimization

---

### 📋 Hangfire Migration (Future - When Needed)

**Triggers:**
- [ ] Need visual dashboard for job monitoring
- [ ] Need better job history tracking
- [ ] Need more reliable retry logic
- [ ] Team requests enterprise features

**Steps:**
1. Add Hangfire NuGet package
2. Configure Hangfire with PostgreSQL storage
3. Enable Hangfire dashboard (`/hangfire`)
4. Migrate one Background Service at a time
5. Test in staging environment
6. Deploy to production with blue-green
7. Monitor for 1 week
8. Remove old Background Services

**Estimated Time:** 1-2 days  
**Cost:** $0 (uses existing PostgreSQL)

---

### 📋 RabbitMQ Migration (Future - Only if Scale Requires)

**Triggers:**
- [ ] Hitting 500+ concurrent events
- [ ] 10,000+ notifications/hour
- [ ] Database queue becoming bottleneck
- [ ] Need horizontal scaling across multiple servers
- [ ] Enterprise customers requiring SLA

**Steps:**
1. Provision RabbitMQ server (Docker container)
2. Add MassTransit NuGet package
3. Configure RabbitMQ connection
4. Create message contracts
5. Implement consumer workers
6. Update Hangfire jobs to publish to RabbitMQ
7. Deploy RabbitMQ to staging
8. Load test with 10,000+ jobs
9. Blue-green deployment to production
10. Monitor RabbitMQ metrics

**Estimated Time:** 3-5 days  
**Cost:** $30-50/month

---

## Monitoring Strategy

### Background Services (Current)
- **Grafana Dashboard**: Custom panels
  - Jobs scheduled per minute
  - Jobs processed per minute
  - Failed job count
  - Average processing time
  - Queue depth
- **Prometheus Metrics**: Custom exporters
- **Application Logs**: Structured logging via Loki

### Hangfire (Future)
- **Built-in Dashboard**: `https://your-app.com/hangfire`
  - Real-time job monitoring
  - Job history (succeeded, failed, retrying)
  - Server statistics
  - Recurring job management
- **+ All existing monitoring**

### RabbitMQ (Future)
- **RabbitMQ Management UI**: `https://rabbitmq.your-app.com:15672`
  - Queue depth
  - Message rates (publish, deliver, ack)
  - Consumer utilization
  - Node statistics
- **+ Prometheus Exporter**: RabbitMQ metrics
- **+ All existing monitoring**

---

## Cost-Benefit Analysis

### Background Services (Year 1)

**Costs:**
- Development: 2 days × $500/day = **$1,000**
- Infrastructure: $0 (uses existing PostgreSQL)
- Maintenance: 2 hours/month × $100/hour × 12 months = **$2,400**

**Total Year 1: $3,400**

---

### Hangfire + RabbitMQ (Year 1)

**Costs:**
- Development: 5 days × $500/day = **$2,500**
- RabbitMQ server: $40/month × 12 months = **$480**
- Maintenance: 4 hours/month × $100/hour × 12 months = **$4,800**
- Learning curve: 3 days × $500/day = **$1,500**

**Total Year 1: $9,280**

---

**Savings with Background Services: $5,880 in Year 1**

---

## Final Recommendation

### ✅ **Implement Background Services Now**

**Why:**
1. **Right size for your scale** (100+ events, not 10,000+)
2. **Faster time to market** (1-2 days vs 3-5 days)
3. **Cost-effective** ($3,400 vs $9,280 in Year 1)
4. **Aligns with monolithic architecture**
5. **Easy to maintain and debug**
6. **Clear migration path when scale demands it**

### 📅 **Schedule Reassessment**

**Q3 2026 (9 months from now):**
- Review notification volume metrics
- Evaluate concurrent event count
- Assess team growth and expertise
- Consider customer SLA requirements
- Decide: Stay with Background Services or migrate to Hangfire + RabbitMQ

---

## Questions & Answers

**Q: What if we suddenly get a huge event with 1,000 athletes?**  
A: Background Services can handle 1,000+ jobs/minute. A single event with 1,000 athletes × 2 reminders = 2,000 notifications. Processing time: ~2 minutes. Perfectly acceptable.

**Q: What if the server crashes while processing notifications?**  
A: Jobs in `notification_jobs` table persist. When server restarts, `NotificationProcessorService` resumes processing pending jobs. No notifications lost.

**Q: Can we scale Background Services horizontally?**  
A: Yes, but requires distributed locking (using PostgreSQL advisory locks or Redis). For 2-3 instances, it's manageable. For 10+ instances, RabbitMQ becomes better.

**Q: What if we need more notification types (score updates, event changes, etc.)?**  
A: Add more `notification_type` values and processor logic. Background Services handle it fine. RabbitMQ shines when you have 10+ notification types with different routing rules.

**Q: How do we monitor Background Services?**  
A: Use existing Grafana + Prometheus stack. Add custom metrics:
```csharp
_meterProvider.CreateCounter<long>("notification_jobs_scheduled");
_meterProvider.CreateCounter<long>("notification_jobs_processed");
_meterProvider.CreateCounter<long>("notification_jobs_failed");
```

---

**Document Status:** ✅ Complete  
**Next Steps:** Implement Background Services (start Week 1)  
**Reassessment Date:** Q3 2026  
**Owner:** Backend Team
