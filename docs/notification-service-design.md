# Notification Service Design

## Overview
A lightweight, scalable notification system for archery competition events that notifies athletes 24 hours and 1 hour before their registered competitions start.

## System Architecture

### 1. Database Schema (Minimal Storage)

```sql
-- Notifications Table (Recent notifications only)
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'competition_reminder_24h', 'competition_reminder_1h'
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON, -- {competitionId, eventId, competitionName, startTime}
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP, -- Auto-delete after 30 days
    INDEX idx_user_unread (user_id, is_read, created_at),
    INDEX idx_expires (expires_at)
);

-- Notification Preferences
CREATE TABLE notification_preferences (
    user_id BIGINT PRIMARY KEY,
    enable_competition_reminders BOOLEAN DEFAULT TRUE,
    reminder_24h BOOLEAN DEFAULT TRUE,
    reminder_1h BOOLEAN DEFAULT TRUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Push Notification Tokens (for mobile apps)
CREATE TABLE device_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    device_type ENUM('ios', 'android', 'web') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id)
);

-- Notification Jobs Queue (temporary processing)
CREATE TABLE notification_jobs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    competition_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    scheduled_time TIMESTAMP NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    INDEX idx_schedule (scheduled_time, status)
);
```

### 2. Backend Service Components

#### A. Notification Scheduler (Cron Job)
```javascript
// Runs every 5 minutes
async function scheduleCompetitionReminders() {
    const now = new Date();
    const check24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const check1h = new Date(now.getTime() + 60 * 60 * 1000);
    
    // Find competitions starting in 24 hours (±5 min window)
    const competitions24h = await db.query(`
        SELECT c.id, c.event_id, c.name, c.start_time, c.bow_type, c.category
        FROM competitions c
        WHERE c.start_time BETWEEN ? AND ?
        AND c.status = 'scheduled'
    `, [check24h, new Date(check24h.getTime() + 5 * 60 * 1000)]);
    
    // Find competitions starting in 1 hour (±5 min window)
    const competitions1h = await db.query(`
        SELECT c.id, c.event_id, c.name, c.start_time, c.bow_type, c.category
        FROM competitions c
        WHERE c.start_time BETWEEN ? AND ?
        AND c.status = 'scheduled'
    `, [check1h, new Date(check1h.getTime() + 5 * 60 * 1000)]);
    
    // Create notification jobs
    for (const comp of competitions24h) {
        await createNotificationJob(comp, '24h');
    }
    
    for (const comp of competitions1h) {
        await createNotificationJob(comp, '1h');
    }
}

async function createNotificationJob(competition, type) {
    // Check if job already exists
    const exists = await db.query(`
        SELECT id FROM notification_jobs
        WHERE competition_id = ? 
        AND notification_type = ?
        AND status IN ('pending', 'completed')
    `, [competition.id, `competition_reminder_${type}`]);
    
    if (exists.length > 0) return;
    
    // Create job
    await db.query(`
        INSERT INTO notification_jobs 
        (competition_id, event_id, notification_type, scheduled_time)
        VALUES (?, ?, ?, NOW())
    `, [competition.id, competition.event_id, `competition_reminder_${type}`]);
}
```

#### B. Notification Processor (Background Worker)
```javascript
async function processNotificationJobs() {
    // Get pending jobs
    const jobs = await db.query(`
        SELECT * FROM notification_jobs
        WHERE status = 'pending'
        AND scheduled_time <= NOW()
        LIMIT 100
    `);
    
    for (const job of jobs) {
        try {
            // Mark as processing
            await db.query(`
                UPDATE notification_jobs 
                SET status = 'processing' 
                WHERE id = ?
            `, [job.id]);
            
            // Get registered athletes for this competition
            const athletes = await db.query(`
                SELECT DISTINCT u.id, u.name, u.email, u.fcm_token
                FROM users u
                JOIN registrations r ON u.id = r.user_id
                JOIN competition_registrations cr ON r.id = cr.registration_id
                WHERE cr.competition_id = ?
                AND r.status = 'confirmed'
            `, [job.competition_id]);
            
            // Get competition details
            const competition = await getCompetitionDetails(job.competition_id);
            
            // Send notifications to each athlete
            for (const athlete of athletes) {
                await sendNotificationToAthlete(athlete, competition, job.notification_type);
            }
            
            // Mark as completed
            await db.query(`
                UPDATE notification_jobs 
                SET status = 'completed', processed_at = NOW()
                WHERE id = ?
            `, [job.id]);
            
        } catch (error) {
            console.error('Job processing failed:', error);
            await db.query(`
                UPDATE notification_jobs 
                SET status = 'failed' 
                WHERE id = ?
            `, [job.id]);
        }
    }
}
```

#### C. Notification Sender
```javascript
async function sendNotificationToAthlete(athlete, competition, type) {
    // Check user preferences
    const prefs = await db.query(`
        SELECT * FROM notification_preferences WHERE user_id = ?
    `, [athlete.id]);
    
    if (!prefs || !prefs.enable_competition_reminders) return;
    
    const timeText = type.includes('24h') ? '24 hours' : '1 hour';
    
    const notification = {
        title: `Competition Starting Soon!`,
        message: `Your ${competition.bow_type} ${competition.category} competition "${competition.name}" starts in ${timeText}`,
        data: {
            competitionId: competition.id,
            eventId: competition.event_id,
            competitionName: competition.name,
            startTime: competition.start_time,
            type: type
        }
    };
    
    // Save to database (for in-app notifications)
    const notificationId = await db.query(`
        INSERT INTO notifications 
        (user_id, type, title, message, data, expires_at)
        VALUES (?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))
    `, [
        athlete.id, 
        type, 
        notification.title, 
        notification.message,
        JSON.stringify(notification.data)
    ]);
    
    // Send push notification (if enabled)
    if (prefs.push_enabled && athlete.fcm_token) {
        await sendPushNotification(athlete.fcm_token, notification);
    }
    
    // Send email (if enabled)
    if (prefs.email_enabled && athlete.email) {
        await sendEmailNotification(athlete.email, notification, competition);
    }
}

// Push notification via Firebase Cloud Messaging
async function sendPushNotification(token, notification) {
    const message = {
        notification: {
            title: notification.title,
            body: notification.message,
        },
        data: notification.data,
        token: token
    };
    
    try {
        await admin.messaging().send(message);
    } catch (error) {
        console.error('Push notification failed:', error);
        // If token is invalid, remove it
        if (error.code === 'messaging/invalid-registration-token') {
            await db.query('DELETE FROM device_tokens WHERE token = ?', [token]);
        }
    }
}

// Email notification
async function sendEmailNotification(email, notification, competition) {
    const emailContent = {
        to: email,
        subject: notification.title,
        html: `
            <h2>${notification.title}</h2>
            <p>${notification.message}</p>
            <p><strong>Competition Details:</strong></p>
            <ul>
                <li>Name: ${competition.name}</li>
                <li>Start Time: ${new Date(competition.start_time).toLocaleString()}</li>
                <li>Location: ${competition.location}</li>
                <li>Bow Type: ${competition.bow_type}</li>
                <li>Category: ${competition.category}</li>
            </ul>
            <p><a href="${process.env.APP_URL}/competitions/${competition.id}">View Competition Details</a></p>
        `
    };
    
    await emailService.send(emailContent);
}
```

### 3. Data Cleanup Strategy (Facebook-style)

```javascript
// Runs daily at 2 AM
async function cleanupOldNotifications() {
    // Delete expired notifications
    await db.query(`
        DELETE FROM notifications 
        WHERE expires_at < NOW()
    `);
    
    // Keep only last 50 read notifications per user
    await db.query(`
        DELETE n1 FROM notifications n1
        INNER JOIN (
            SELECT id FROM notifications
            WHERE is_read = TRUE
            ORDER BY created_at DESC
        ) n2 ON n1.id > n2.id
        WHERE n1.user_id IN (
            SELECT DISTINCT user_id FROM notifications
        )
        AND n1.is_read = TRUE
    `);
    
    // Delete completed jobs older than 7 days
    await db.query(`
        DELETE FROM notification_jobs
        WHERE status = 'completed'
        AND processed_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);
}

// Delete old device tokens (inactive for 90 days)
async function cleanupDeviceTokens() {
    await db.query(`
        DELETE FROM device_tokens
        WHERE last_used_at < DATE_SUB(NOW(), INTERVAL 90 DAY)
    `);
}
```

### 4. Frontend API Endpoints

```javascript
// Get user notifications (paginated)
app.get('/api/notifications', authenticate, async (req, res) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    
    const notifications = await db.query(`
        SELECT id, type, title, message, data, is_read, created_at
        FROM notifications
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `, [userId, limit, offset]);
    
    const unreadCount = await db.query(`
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = ? AND is_read = FALSE
    `, [userId]);
    
    res.json({
        notifications,
        unreadCount: unreadCount[0].count,
        hasMore: notifications.length === limit
    });
});

// Mark notification as read
app.post('/api/notifications/:id/read', authenticate, async (req, res) => {
    const userId = req.user.id;
    const notificationId = req.params.id;
    
    await db.query(`
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ? AND user_id = ?
    `, [notificationId, userId]);
    
    res.json({ success: true });
});

// Mark all as read
app.post('/api/notifications/read-all', authenticate, async (req, res) => {
    const userId = req.user.id;
    
    await db.query(`
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ? AND is_read = FALSE
    `, [userId]);
    
    res.json({ success: true });
});

// Update notification preferences
app.put('/api/notifications/preferences', authenticate, async (req, res) => {
    const userId = req.user.id;
    const { 
        enable_competition_reminders,
        reminder_24h,
        reminder_1h,
        push_enabled,
        email_enabled
    } = req.body;
    
    await db.query(`
        INSERT INTO notification_preferences 
        (user_id, enable_competition_reminders, reminder_24h, reminder_1h, push_enabled, email_enabled)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            enable_competition_reminders = VALUES(enable_competition_reminders),
            reminder_24h = VALUES(reminder_24h),
            reminder_1h = VALUES(reminder_1h),
            push_enabled = VALUES(push_enabled),
            email_enabled = VALUES(email_enabled)
    `, [userId, enable_competition_reminders, reminder_24h, reminder_1h, push_enabled, email_enabled]);
    
    res.json({ success: true });
});

// Register device token for push notifications
app.post('/api/notifications/device-token', authenticate, async (req, res) => {
    const userId = req.user.id;
    const { token, device_type } = req.body;
    
    await db.query(`
        INSERT INTO device_tokens (user_id, token, device_type)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE last_used_at = NOW()
    `, [userId, token, device_type]);
    
    res.json({ success: true });
});
```

### 5. Real-time Updates (Optional - WebSocket)

```javascript
// For real-time notification delivery
io.on('connection', (socket) => {
    const userId = socket.handshake.auth.userId;
    
    // Join user's notification room
    socket.join(`user:${userId}`);
    
    socket.on('disconnect', () => {
        socket.leave(`user:${userId}`);
    });
});

// When sending notification, also emit via WebSocket
async function sendRealtimeNotification(userId, notification) {
    io.to(`user:${userId}`).emit('new_notification', notification);
}
```

## Implementation Steps

### Phase 1: Database Setup
1. Create tables (notifications, notification_preferences, device_tokens, notification_jobs)
2. Add indexes for performance
3. Set up auto-cleanup triggers

### Phase 2: Backend Services
1. Implement notification scheduler (cron job every 5 minutes)
2. Implement notification processor (background worker)
3. Create notification sender with multi-channel support

### Phase 3: API Development
1. Build REST APIs for fetching/managing notifications
2. Implement WebSocket for real-time updates (optional)
3. Add device token management

### Phase 4: Frontend Integration
1. Create notification bell UI component
2. Implement notification list with pagination
3. Add notification preferences page
4. Integrate push notification service (Firebase)

### Phase 5: Testing & Monitoring
1. Load testing for high-volume events
2. Set up monitoring for failed notifications
3. Analytics for notification engagement

## Key Features

✅ **Minimal Data Storage**: Only stores recent notifications (30-day expiry)
✅ **Efficient Querying**: Indexed for fast user lookups
✅ **Multi-Channel**: Push, Email, In-app
✅ **User Preferences**: Granular control over notification types
✅ **Scalable**: Job queue handles high volumes
✅ **Reliable**: Retry mechanism for failed notifications
✅ **Clean**: Auto-cleanup of old data
✅ **Real-time**: Optional WebSocket support

## Performance Considerations

- **Database Indexes**: Ensure fast queries on user_id, created_at, is_read
- **Job Processing**: Use queue system (Redis/RabbitMQ) for high volume
- **Caching**: Cache user preferences in Redis
- **Batch Processing**: Send notifications in batches of 100
- **Rate Limiting**: Prevent notification spam

## Monitoring Metrics

- Notification delivery rate
- Average processing time
- Failed notification count
- User engagement rate (read/unread ratio)
- Database size over time

## Security

- Authenticate all API requests
- Encrypt device tokens
- Validate notification data before sending
- Rate limit notification API calls
- Sanitize notification content (prevent XSS)

