# Snort Counter 🐷

A fun and interactive counter app with pig snort sounds and floating piggy animations! Built with Vite + React and Tailwind CSS.

## Features

- 🎯 Interactive counter with smooth animations
- 🐽 Realistic pig snort sound effects using Web Audio API
- 🐷 Floating piggy animations when counting
- ✨ Beautiful gradient UI with backdrop blur effects
- 📱 Responsive design for all devices
- 🔄 Undo and reset functionality

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd snort-counter
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will open in your browser at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## How to Use

1. Click the "Count a snort" button to increment the counter
2. Each click plays a realistic pig snort sound
3. Watch as cute piggies float up from the button
4. Use the "Undo" button to go back to the previous count
5. Use the "Reset" button to start over

## Tech Stack

- **Frontend**: React 18 with Hooks
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Audio**: Web Audio API
- **Animations**: CSS animations with React state

## Project Structure

```
snort-counter/
├── src/
│   ├── App.jsx          # Main counter app component
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles and Tailwind imports
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
└── postcss.config.js    # PostCSS configuration
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).
