# AI Lead Qualifier & Outreach Micro-App

A complete full-stack application for capturing, analyzing, and automating lead outreach using AI. Built with React frontend, Node.js backend, PostgreSQL database, and n8n automation workflows.

## 🚀 Features

- **Lead Capture**: Beautiful landing page with lead capture form
- **AI Analysis**: Automatic lead scoring and classification using OpenAI
- **Admin Dashboard**: Complete lead management interface
- **Automated Outreach**: AI-generated personalized outreach emails
- **n8n Integration**: Automated workflows for lead processing
- **Real-time Notifications**: Slack and email notifications
- **Analytics**: Lead funnel tracking and performance metrics

## 🏗️ Architecture

```
Frontend (React) → Backend (Node.js) → Database (PostgreSQL)
                      ↓
                 n8n Workflows → OpenAI → Email/Slack
```

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- OpenAI API Key
- n8n instance (optional)
- SMTP server (Mailtrap recommended for testing)

## 🛠️ Quick Setup

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb pulse_capture

# Run migrations
cd backend
npm run migrate
```

### 2. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

### 3. Frontend Setup

```bash
# In project root
npm install
npm run dev
```

### 4. n8n Workflows (Optional)

1. Import `n8n-workflows/on-new-lead.json` into n8n
2. Import `n8n-workflows/send-outreach.json` into n8n
3. Configure webhook URLs in your `.env` file

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/pulse_capture

# OpenAI
OPENAI_API_KEY=sk-your-openai-api-key-here

# n8n Webhooks
N8N_WEBHOOK_A=https://your-n8n-instance.com/webhook/lead-capture
N8N_WEBHOOK_B=https://your-n8n-instance.com/webhook/send-outreach

# SMTP (Mailtrap for testing)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-username
SMTP_PASS=your-mailtrap-password
SMTP_FROM=noreply@pulsecapture.com

# JWT
JWT_SECRET=your-super-secret-jwt-key-here

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Slack (Optional)
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

## 🧪 Testing

### Sample Lead Data

The system includes 5 sample leads for testing:

1. **Sarah Mitchell** (TechFlow Inc) - High Priority (92/100)
2. **David Chen** (Growth Startup) - Medium Priority (78/100)  
3. **Jennifer Rodriguez** (Marketing Pro) - High Priority (85/100)
4. **Michael Thompson** (SalesForce Dev) - Medium Priority (71/100)
5. **Lisa Wang** (Enterprise Co) - Low Priority (58/100)

### Test the Flow

1. **Submit a Lead**: Visit `http://localhost:5173` and submit the lead form
2. **Check Admin Dashboard**: Login at `http://localhost:5173/admin/login`
   - Email: `admin@leadcapture.com`
   - Password: `admin123`
3. **View Lead Details**: Click on any lead to see AI analysis and timeline
4. **Send Outreach**: Click "Send Outreach" to trigger automated email

## 📊 API Endpoints

### Public Endpoints

- `POST /api/leads` - Submit new lead
- `GET /api/leads/:id` - Get lead status

### Admin Endpoints (Authentication Required)

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `GET /api/admin/leads` - List leads with filtering
- `GET /api/admin/leads/:id` - Get lead details
- `PATCH /api/admin/leads/:id` - Update lead
- `POST /api/admin/leads/:id/outreach` - Send outreach
- `GET /api/admin/stats` - Dashboard statistics

### Webhook Endpoints

- `POST /api/webhooks/lead-processing` - n8n lead processing
- `POST /api/webhooks/send-outreach` - n8n outreach sending

## 🤖 AI Features

### Lead Scoring
- **Use Case Classification**: Internal automation, Customer support, Data processing, Sales ops, Other
- **Fit Score**: 0-100 numerical score
- **Fit Band**: High/Medium/Low priority
- **Rationale**: AI explanation for scoring

### Outreach Generation
- **Personalized Emails**: 90-120 word first-touch emails
- **Subject Lines**: Compelling, under 50 characters
- **Tone**: Friendly, crisp, specific
- **Call-to-Action**: Concrete next steps (15-min call or demo)

## 🔄 n8n Workflows

### On New Lead Workflow
1. Receives webhook from backend
2. Calls OpenAI for scoring/classification
3. Stores results in database
4. Sends Slack/email notifications
5. Logs all events

### Send Outreach Workflow
1. Receives webhook with lead_id
2. Generates personalized outreach email
3. Sends via SMTP
4. Updates lead status
5. Logs outreach events

## 📈 Analytics

The system tracks:
- Total leads captured
- Lead scoring distribution
- Outreach success rates
- Response rates by fit band
- Lead source performance
- AI accuracy metrics

## 🚀 Deployment

### Production Checklist

1. **Database**: Use managed PostgreSQL (Supabase, Neon, or AWS RDS)
2. **Backend**: Deploy to Railway, Heroku, or AWS
3. **Frontend**: Deploy to Vercel, Netlify, or AWS
4. **n8n**: Use n8n Cloud or self-hosted instance
5. **SMTP**: Use production email service (SendGrid, Mailgun)
6. **Environment**: Set all production environment variables


## 🔒 Security

- JWT authentication for admin routes
- Rate limiting on all endpoints
- Input validation with Joi
- SQL injection protection
- CORS configuration
- Helmet security headers

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection**: Check DATABASE_URL format
2. **OpenAI API**: Verify API key and credits
3. **SMTP**: Test with Mailtrap first
4. **n8n Webhooks**: Check webhook URLs and n8n status
5. **CORS**: Ensure CORS_ORIGIN matches frontend URL

### Logs

Backend logs are available in:
- Console output (development)
- `logs/` directory (production)
- Winston logger with structured logging

## 📝 Development

### Project Structure

```
pulse-capture-app/
├── src/                    # Frontend React app
├── backend/               # Node.js backend
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── database/     # DB connection & schema
│   │   └── utils/         # Utilities
├── n8n-workflows/        # n8n workflow JSON files
└── README.md
```

### Adding Features

1. **New API Endpoints**: Add to `backend/src/routes/`
2. **Database Changes**: Update `backend/src/database/schema.sql`
3. **AI Features**: Extend `backend/src/services/aiService.js`
4. **Frontend Components**: Add to `src/components/`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the logs for error details

---

**Built with ❤️ for the AI Lead Qualifier & Outreach Micro-App assignment**