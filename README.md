# myTROUVEpro Backend - Payment Server

Payment processing server for myTROUVEpro using Square API.

## Quick Deploy to Railway (Recommended)

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Connect this repository
4. Add environment variables (see below)
5. Deploy!

## Environment Variables

Set these in Railway/Render/Heroku:

```
SQUARE_APPLICATION_ID=sandbox-sq0idb-Z6g4W5yCPznRerTcgUTLBQ
SQUARE_ACCESS_TOKEN=EAAAl8hoVJHtRCbpSQVcM5Hi4K8qWpj4cexH_Vx-PJJYM9534a-435P4n8x3Q06Y
SQUARE_LOCATION_ID=LGKWFNKR77SCA
SQUARE_ENVIRONMENT=sandbox
PORT=3001
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/config` | Get Square config |
| GET | `/api/test` | Test Square connection |
| POST | `/api/create-payment-link` | Create payment link |
| POST | `/api/process-payment` | Process card payment |
| GET | `/api/payment/:id` | Get payment status |
| GET | `/api/payments` | List all payments |
| POST | `/api/refund` | Process refund |

## Company

Performance Cristal Technologies Avancées S.A.  
NEQ: 2280629637  
Laval, Quebec, Canada
