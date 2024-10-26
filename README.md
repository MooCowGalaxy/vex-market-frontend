# VEX Market Frontend
A modern marketplace for VEX Robotics teams to buy and sell parts. Built with React and TypeScript.
## Features
- Browse and search listings for VEX parts
- Real-time messaging between buyers and sellers
- Secure user authentication
- Image upload support for listings
- Responsive design for mobile and desktop
- Real-time notifications for new messages
## Getting Started
### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Backend service running (see [backend repository](https://github.com/MooCowGalaxy/vex-market-frontend))
### Installation
1. Clone the repository:
```bash
git clone https://github.com/MooCowGalaxy/vex-market-frontend.git
```
2. Install dependencies:
```bash
cd vex-market-frontend
npm install
```
3. Start the development server:
```bash
npm run dev
```
The app will be available at http://localhost:5173
### Building for Production
```bash
npm run build
```
On the official production server (https://vexmarket.com), the site is deployed to Cloudflare Pages automatically.
## Project Structure
```
src/
  ├── components/    # Reusable UI components
  ├── hooks/         # Custom React hooks for user auth and page titles
  ├── layouts/       # Templates used with React Router
  ├── pages/         # Page components and routes
  ├── providers/     # React context providers
  └── utils/         # Helper functions
```
## Technologies Used
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui
- Socket.io Client
- React Router
