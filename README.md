# OBS Control Panel

A TypeScript/React application for controlling and monitoring OBS (Open Broadcaster Software) with a modern UI.

## 🚀 Features

- Real-time control panel interface
- Broadcast monitoring and management
- TypeScript for type safety
- Built with React 18 and Vite
- Responsive design with Tailwind CSS
- Supabase integration for data management

## 📦 Tech Stack

- **Frontend**: React 18.3, TypeScript 5.5
- **Build Tool**: Vite 5.4
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React
- **Backend/DB**: Supabase
- **Linting**: ESLint 9

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/koki-9/obs-.git
cd obs-
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Create a `.env.local` file in the root directory
   - Add your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🏃 Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Check TypeScript types

## 🔨 Building for Production

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` directory.

## 📤 Deployment Options

### GitHub Pages
Your repository already has GitHub Pages enabled:
1. Ensure `dist/` is in `.gitignore` (it is)
2. Set GitHub Pages source to `gh-pages` branch
3. Add a deploy workflow or use a tool like `gh-pages`

### Vercel (Recommended for React)
```bash
npm i -g vercel
vercel
```

### Netlify
Connect your GitHub repository directly to Netlify for automatic deployments.

## 📄 License

Creative Commons Zero v1.0 Universal (CC0-1.0) - See LICENSE file for details.

## 👤 Author

[koki-9](https://github.com/koki-9)
