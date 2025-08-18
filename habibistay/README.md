# Habibistay - Premium Property Investment & Vacation Rentals Platform

A full-featured Airbnb clone with advanced host tools, AI-powered chatbot assistance, and comprehensive investment management features.

## 🎨 Brand Identity

- **Primary Color**: #2957c3 (Habibistay Blue)
- **Design Philosophy**: Clean, modern UI with consistent branding, ample white space, and intuitive navigation

## ✨ Key Features

### Guest Experience
- **Sara AI Assistant**: Button and voice-driven chatbot interface for seamless property discovery and booking
- Featured property showcase with high-quality images and detailed information
- Minimal text input required - all interactions through buttons and voice
- Instant booking confirmation and check-in instructions
- 24/7 AI-powered support

### Admin Dashboard
- Comprehensive property and booking management
- AI configuration panel for customizing Sara's behavior
- Real-time analytics and revenue tracking
- Multi-model AI support (GPT-4, GPT-3.5, Claude, etc.)
- Payment gateway integration management

### Investment Platform
- **17% Average Annual ROI**
- End-to-end property management
- Diverse portfolio across prime tourist destinations
- Real-time ROI tracking dashboard
- Secure payment processing
- Monthly performance reports

### Host Tools
- Channel manager for seamless listing management
- Financial reporting and analytics
- Property performance metrics
- Automated pricing optimization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- OpenAI API key (or alternative AI model API)
- Payment gateway credentials (MyFatoorah, PayPal)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/habibistay.git
cd habibistay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
- Database URL
- NextAuth secret
- OpenAI API key
- Payment gateway keys

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
habibistay/
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── auth/            # Authentication pages
│   │   ├── booking/         # Booking flow pages
│   │   ├── host/            # Host dashboard pages
│   │   ├── investment/      # Investment pages
│   │   └── property/        # Property detail pages
│   ├── components/          # React components
│   │   ├── admin/           # Admin-specific components
│   │   ├── chatbot/         # Sara AI chatbot components
│   │   ├── home/            # Homepage components
│   │   └── layout/          # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and libraries
│   └── types/               # TypeScript type definitions
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── package.json
```

## 🤖 Sara AI Assistant

Sara is the intelligent chatbot that powers the guest experience:

### Features
- Greeting and property recommendations
- Button-driven interface for easy navigation
- Voice input support
- Property search and filtering
- Booking assistance
- Payment processing
- Check-in/check-out support
- Local recommendations

### Configuration
Admins can configure Sara through the AI Settings panel:
- Choose AI model (GPT-4, GPT-3.5, Claude, etc.)
- Adjust temperature for response creativity
- Customize system prompts
- Set greeting messages
- Enable/disable features

## 💳 Payment Integration

### Supported Gateways
- **MyFatoorah**: Primary payment processor for Middle East
- **PayPal**: International payments
- **Stripe**: (Coming soon)

### Security Features
- PCI compliance
- Secure tokenization
- Fraud detection
- Multi-currency support

## 📊 Investment Features

### For Investors
- Browse investment opportunities
- Real-time ROI calculator
- Performance dashboards
- Monthly payout tracking
- Detailed property reports
- Portfolio diversification tools

### Investment Highlights
- Average 17% annual ROI
- Fully managed properties
- Prime location portfolio
- Transparent reporting
- Secure transactions
- Regular dividend payments

## 🔧 Admin Features

### Property Management
- Add/edit/delete properties
- Manage availability
- Set dynamic pricing
- Upload property images
- Configure amenities

### Booking Management
- View all bookings
- Process refunds
- Handle cancellations
- Generate invoices
- Guest communication

### Analytics Dashboard
- Revenue tracking
- Occupancy rates
- Performance metrics
- Investor returns
- Guest satisfaction scores

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Integration**: OpenAI API
- **Payment Processing**: MyFatoorah, PayPal
- **Charts**: Recharts
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Security

- JWT-based authentication
- Role-based access control (Guest, Host, Investor, Admin)
- Encrypted sensitive data
- HTTPS enforcement
- Rate limiting
- Input validation and sanitization

## 🚦 API Endpoints

Key API routes:
- `/api/auth/*` - Authentication endpoints
- `/api/properties/*` - Property CRUD operations
- `/api/bookings/*` - Booking management
- `/api/chat/*` - Sara AI chat endpoints
- `/api/payments/*` - Payment processing
- `/api/admin/*` - Admin operations

## 📈 Performance Optimization

- Image optimization with Next.js Image component
- Lazy loading for components
- Code splitting
- Caching strategies
- Database query optimization
- CDN integration for static assets

## 🧪 Testing

Run tests:
```bash
npm run test
```

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support, email support@habibistay.com or use the in-app chat feature.

## 🔄 Updates

The platform is regularly updated with new features and improvements. Check the changelog for the latest updates.

---

Built with ❤️ by the Habibistay Team