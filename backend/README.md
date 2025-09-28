# Pulse Capture Backend

Node.js backend for the AI Lead Qualifier & Outreach Micro-App.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
# Set up PostgreSQL database
createdb pulse_capture

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.js              # Main server file
│   ├── database/
│   │   ├── connection.js      # Database connection
│   │   ├── schema.sql         # Database schema
│   │   └── migrate.js         # Migration script
│   ├── routes/
│   │   ├── auth.js           # Authentication routes
│   │   ├── leads.js          # Lead capture routes
│   │   ├── admin.js          # Admin dashboard routes
│   │   └── webhooks.js       # n8n webhook routes
│   ├── services/
│   │   ├── aiService.js      # OpenAI integration
│   │   ├── emailService.js    # Email sending
│   │   └── webhookService.js  # n8n webhook calls
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   └── utils/
│       ├── logger.js         # Winston logging
│       └── validation.js    # Joi validation schemas
├── package.json
├── env.example
└── README.md
```

## 🔧 Environment Variables

See `env.example` for all required environment variables:

- `DATABASE_URL` - PostgreSQL connection string
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `JWT_SECRET` - Secret for JWT token signing
- `SMTP_*` - Email configuration
- `N8N_WEBHOOK_*` - n8n webhook URLs
- `SLACK_WEBHOOK_URL` - Slack notifications (optional)

## 🗄️ Database Schema

The system uses PostgreSQL with the following main tables:

- `users` - Admin users
- `leads` - Lead information and AI analysis
- `events` - Lead activity timeline
- `outreach` - Email outreach tracking
- `analytics` - Performance metrics

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side)

### Lead Management
- `POST /api/leads` - Submit new lead (public)
- `GET /api/leads/:id` - Get lead status (public)
- `GET /api/admin/leads` - List leads (admin)
- `GET /api/admin/leads/:id` - Get lead details (admin)
- `PATCH /api/admin/leads/:id` - Update lead (admin)
- `POST /api/admin/leads/:id/outreach` - Send outreach (admin)

### Webhooks
- `POST /api/webhooks/lead-processing` - n8n lead processing
- `POST /api/webhooks/send-outreach` - n8n outreach sending

### Analytics
- `GET /api/admin/stats` - Dashboard statistics

## 🤖 AI Integration

### Lead Scoring
The system uses OpenAI GPT-3.5-turbo to:
- Classify use cases (Internal automation, Customer support, etc.)
- Generate fit scores (0-100)
- Determine priority bands (High/Medium/Low)
- Provide rationale for decisions

### Outreach Generation
AI generates:
- Personalized email content (90-120 words)
- Compelling subject lines (<50 characters)
- Appropriate tone and call-to-action

## 📧 Email Features

### SMTP Configuration
- Supports any SMTP provider
- Recommended: Mailtrap for testing
- Production: SendGrid, Mailgun, AWS SES

### Email Types
- **Outreach Emails**: Personalized to leads
- **Notifications**: Admin alerts for new leads
- **Templates**: HTML formatted with fallback text

## 🔗 n8n Integration

### Webhook Endpoints
- **Lead Processing**: Triggered when new lead is captured
- **Outreach Sending**: Triggered when admin sends outreach

### Workflow Support
- Automatic lead scoring and classification
- Enrichment data collection
- Slack/email notifications
- Event logging and tracking

## 🔒 Security

### Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt
- Role-based access control

### Security Headers
- Helmet.js for security headers
- CORS configuration
- Rate limiting on all endpoints
- Input validation with Joi

## 📊 Logging

### Winston Logger
- Structured JSON logging
- Multiple log levels
- File rotation in production
- Error tracking and debugging

### Log Levels
- `error` - Critical errors
- `warn` - Warnings and issues
- `info` - General information
- `debug` - Detailed debugging

## 🧪 Testing

### Sample Data
The migration script includes 5 sample leads for testing:
- Different priority levels
- Various use cases
- Realistic company data

### Test Endpoints
- `GET /health` - Health check
- `GET /api/webhooks/test` - Webhook test

## 🚀 Deployment

### Production Checklist
1. Set all environment variables
2. Use production database
3. Configure SMTP service
4. Set up n8n workflows
5. Enable logging
6. Set up monitoring


## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**
   ```bash
   # Check connection string format
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   ```

2. **OpenAI API Errors**
   - Verify API key is valid
   - Check account credits
   - Review rate limits

3. **SMTP Issues**
   - Test with Mailtrap first
   - Check credentials and ports
   - Verify firewall settings

4. **n8n Webhooks**
   - Ensure webhook URLs are correct
   - Check n8n instance is running
   - Verify workflow is active

### Debug Mode
```bash
# Enable debug logging
LOG_LEVEL=debug npm run dev
```

## 📈 Performance

### Optimization
- Database connection pooling
- Async/await patterns
- Efficient queries with indexes
- Rate limiting protection

### Monitoring
- Health check endpoint
- Structured logging
- Error tracking
- Performance metrics

## 🔄 Development

### Adding Features
1. **New Routes**: Add to `src/routes/`
2. **Database Changes**: Update `schema.sql` and run migration
3. **AI Features**: Extend `aiService.js`
4. **Email Templates**: Update `emailService.js`

### Code Style
- ES6+ JavaScript
- Async/await for promises
- Error handling with try/catch
- JSDoc comments for functions

## 📄 License

MIT License - see LICENSE file for details.
