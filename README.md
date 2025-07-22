# thunk. 🧠

> My first proper full-stack app. A place to dump your thoughts before they disappear into the void.
> 
> **Live at:** [thunk-jx31.onrender.com](https://thunk-jx31.onrender.com/)

**thunk.** is basically a digital notebook that actually keeps your stuff private. Built this about halfway through bootcamp when I was still figuring out how all the pieces fit together.

## What it does ✨

- **🔐 Your thoughts, your data** - Auth0 login means only you can see your thunks
- **📝 Full CRUD operations** - Create, read, update, delete your thoughts 
- **🎨 Nice animations** - Used GSAP and Motion for the first time on the login page
- **📱 Works on everything** - Responsive design that doesn't break on phones
- **🚀 Deployed** - Real app you can use
- **🔒 Locked down tight** - Can't access other people's thunks, even if you tried

## Getting it running 🚀

You'll need:
- Node.js 18+ 
- Auth0 account

```bash
git clone <your-repo-url>
cd thunk
npm install
cp .env.example .env
# Add your Auth0 details to .env
npm run dev
```

Then go to http://localhost:5173

## Environment setup ⚙️

Make a `.env` file with your Auth0 stuff:

```bash
# Auth0 authentication
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience

# Database (for local development)
DATABASE_URL=your-sqlite-file-path
```

### Setting up Auth0 🔐

1. Create a "Single Page Application" in Auth0
2. Add your localhost URL to allowed callback/logout URLs
3. Create an API in Auth0 for the backend
4. Copy the domain, client ID, and audience to your .env

## How it's built 🏗️

### Tech stack 🛠️

- **React 18** with TypeScript
- **Node.js** backend with Express
- **SQLite** database
- **Auth0** for authentication
- **BulmaCSS** for styling
- **GSAP & Motion** for animations
- **Lucide React** for icons

### Code organisation 📁

```
src/
├── components/          # React components
│   ├── ThunkCard.tsx   # Individual thunk display
│   ├── ThunkForm.tsx   # Create/edit form
│   └── LoginPage.tsx   # Auth0 login with animations
├── pages/
│   ├── Dashboard.tsx   # Main thunks list
│   └── EditThunk.tsx   # Edit existing thunk
├── hooks/
│   └── useThunks.ts    # API calls and state management
└── main.tsx           # App entry point
```

### How I organised things 🧩

This was my first time building a full app, so I tried to keep components small and focused:

- **ThunkCard** - displays a single thunk with edit/delete buttons
- **ThunkForm** - handles both creating new thunks and editing existing ones  
- **ThunkLog** - shows all your thunks in a list
- **LoginPage** - Auth0 integration with some fancy GSAP animations

The `useThunks` hook handles all the API calls. Probably could have split it up more, but it worked for what I needed.

## Development challenges 💭

**Being halfway through bootcamp:**
- Still learning React hooks properly
- First time connecting frontend to backend
- JWT tokens were a mystery at first
- SQLite seemed less scary than PostgreSQL

**Build process was clunky:**
- Deployment took way longer than it should have
- Had to figure out environment variables for production
- Auth0 callback URLs kept breaking things
- No real development process followed

**CSS decisions:**
- Chose BulmaCSS because Tailwind felt overwhelming
- Wanted to focus on functionality first, styling second
- BulmaCSS classes made more sense to my brain at the time

**Animation experiments:**
- First time using GSAP - spent hours on the login page animations
- Motion library for some micro-interactions
- Probably overdid it, but it was fun to learn

## Security stuff 🔒

**Authentication:**
- Auth0 handles all the login/logout flow
- JWT tokens required for every API call
- No access to other users' data - each thunk is tied to the authenticated user

**Database:**
- Each thunk has a user_id that gets checked on every request
- SQLite for simplicity
- No sensitive data stored beyond what you put in your thunks

## Deployment 🚀

**Development:**
```bash
npm run dev          # Frontend on localhost:5173
npm run server       # Backend API on localhost:3001
```

**Production:**
```bash
npm run build
# Deploy to Render, Vercel, wherever
```

Got it deployed on Render. Took a few tries to get the build process right.

## Why I built this 💭

Needed a project that was:
- **Actually useful** - I did need somewhere to dump random thoughts
- **Full-stack** - wanted to connect all the bootcamp pieces together
- **My own** - solo project to see if I could build and deploy something
- **Deployable** - prove to myself that I can ship real apps

This was my "can I actually build a thing?" project. Turns out, yeah, I can.

## The design 🎨

- Clean, minimal interface
- Card-based layout for thunks
- Responsive design that works on phones
- Login page animations - just a choice

## Current status 📊

**Working features:**
- ✅ Auth0 authentication
- ✅ Create/read/update/delete thunks
- ✅ Responsive design
- ✅ Deployed and usable
- ✅ User data separation

**Things I'd do differently now:**
- Use PostgreSQL instead of SQLite
- Better error handling throughout
- More comprehensive testing
- Cleaner component structure
- Maybe use Tailwind now that I know it better

**But honestly?** For my first solo full-stack app, built halfway through bootcamp, I'm pretty happy with how it turned out.

## Tech I learned building this 🎓

- **First time:** Full-stack authentication flow
- **First time:** GSAP animations
- **First time:** Motion library
- **First time:** SQLite with Node.js
- **First time:** Deploying a full-stack app
- **First time:** JWT tokens and protected routes

First time doing most things. That's why the code might not be perfect, but it works and it's mine.

## Future improvements 🔮

If I come back to this project:
- [ ] Better search and filtering
- [ ] Tags or categories for thunks
- [ ] Rich text editing
- [ ] Export functionality
- [ ] Better mobile experience
- [ ] Dark mode toggle

---

**thunk.** - because sometimes you just need to get the thoughts out of your head and somewhere safe.

*My first real full-stack app. Still learning, still improving.* 🚀
