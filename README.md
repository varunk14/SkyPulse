# ✈️ SkyPulse - Modern Flight Search Engine

A feature-rich flight search application built with Next.js 16, TypeScript, and modern web technologies. Search, filter, and book flights with an intuitive interface designed for the best user experience.

![SkyPulse](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🌟 Key Features

### Smart Search System
- ✈️ Real-time airport autocomplete with debouncing
- 🕐 Recent search history with localStorage
- 🔄 Round-trip and one-way flight support
- 📅 Intuitive date picker with validation

### Advanced Filtering
- 🎯 Filter by stops (Nonstop, 1 Stop, 2+ Stops)
- 💰 Interactive price range slider
- ✈️ Multi-airline selection
- ⏰ Departure time ranges
- ⏱️ Duration filters with real-time updates

### Multi-Currency Support
- 💱 9+ currencies (USD, EUR, GBP, INR, AED, SGD, JPY, CAD, AUD)
- 📊 Accurate exchange rates (updated Jan 2026)
- 🔄 Instant price conversion across all flights

### Premium Features
- 📈 AI-powered price prediction recommendations
- 🎟️ Interactive 4-step booking wizard
- 📱 Fully responsive design (mobile, tablet, desktop)
- ✨ Smooth animations with Framer Motion
- 🎭 Mock data mode for testing without API

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, Shadcn/ui Components |
| **State** | Zustand (lightweight state management) |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Forms** | React Hook Form, Zod validation |
| **API** | Amadeus Flight API with mock fallback |
| **Date Handling** | date-fns |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- (Optional) Amadeus API credentials

### Installation
```bash
# Clone the repository
git clone https://github.com/varunkrishna14/skypulse-flight-search.git
cd skypulse-flight-search

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Optional: Add Real Flight Data

Create `.env.local` file:
```env
AMADEUS_API_KEY=your_key_here
AMADEUS_API_SECRET=your_secret_here
AMADEUS_BASE_URL=https://test.api.amadeus.com
```

Get free API credentials at [Amadeus for Developers](https://developers.amadeus.com/)

> **Note**: App works perfectly with mock data mode if API keys are not provided!

## 📱 Feature Showcase

### 🔍 Search & Discovery
- Airport search with city/country information
- Calendar-based date selection with min/max dates
- Passenger count selector (adults, children, infants)
- Cabin class selection (Economy, Premium Economy, Business, First)
- Recent searches quick access dropdown

### 📊 Results & Filtering
- **Sort Options**: Best Value, Cheapest, Fastest, Latest
- **Filter by**: Stops, Price Range, Airlines, Departure Time, Duration
- Real-time price updates with selected currency
- Interactive price distribution chart
- Flight count indicators for each filter

### 🎫 Booking Experience
1. **Flight Summary**: Review selected flight details
2. **Passenger Details**: Multi-passenger form with validation
3. **Contact Information**: Email and phone collection
4. **Review & Confirm**: Final summary with price breakdown
5. **Success Animation**: Confetti celebration on completion

## 🎨 Design Philosophy

- **Clean & Modern**: Minimalist design focused on usability
- **Mobile-First**: Progressive enhancement from mobile to desktop
- **Accessible**: WCAG compliant with keyboard navigation and ARIA labels
- **Performance**: Code splitting, lazy loading, optimized bundle size
- **Smooth UX**: Micro-interactions and loading states throughout

## 📦 Project Structure
```
skypulse/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Main search page
│   │   ├── layout.tsx         # Root layout
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── search/            # Search form components
│   │   │   ├── SearchForm.tsx
│   │   │   ├── AirportSelect.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   └── PassengerSelect.tsx
│   │   ├── flights/           # Flight display
│   │   │   ├── FlightCard.tsx
│   │   │   ├── FlightList.tsx
│   │   │   └── FlightDetails.tsx
│   │   ├── filters/           # Filter components
│   │   │   └── FilterPanel.tsx
│   │   ├── booking/           # Booking wizard
│   │   │   └── BookingWizard.tsx
│   │   └── ui/                # Reusable components
│   ├── lib/
│   │   ├── currency.ts        # Currency conversion
│   │   ├── amadeus.ts         # API client
│   │   └── mock-data/         # Mock data generators
│   ├── store/
│   │   └── searchStore.ts     # Zustand state
│   ├── hooks/
│   │   └── useRecentSearches.ts
│   └── types/
│       └── index.ts           # TypeScript types
├── public/                     # Static assets
└── ...config files
```

## 🧪 Development Features

### Mock Data Mode
Toggle "Mock Data" in the header to test without API credentials:
- ✅ Comprehensive mock flight database
- ✅ Realistic pricing and schedules
- ✅ Multiple airlines and routes
- ✅ Perfect for demos and development

### Testing Checklist
- [ ] Airport autocomplete (type city names)
- [ ] Date validation (past dates disabled)
- [ ] Currency conversion (try switching currencies)
- [ ] Filters (test all filter combinations)
- [ ] Sorting (all 4 sort options)
- [ ] Booking wizard (complete 4-step flow)
- [ ] Recent searches (appears after searches)

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (optional - only if using real API)
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Environment Variables for Production

Only needed if using real Amadeus API:
```
AMADEUS_API_KEY=your_production_key
AMADEUS_API_SECRET=your_production_secret
AMADEUS_BASE_URL=https://api.amadeus.com
```

## 🎯 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices)
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Optimized with code splitting

## 📄 License

MIT License - feel free to use for learning and portfolio projects

## 👨‍💻 Developer

Built by **Varun Krishna**
- GitHub: [@varunkrishna14](https://github.com/varunkrishna14)

---

##  Acknowledgments

- Flight data powered by [Amadeus API](https://developers.amadeus.com/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons by [Lucide React](https://lucide.dev/)

---

⭐ **Star this repo if you found it helpful!**
