# SheSafe - Build & Deployment Guide

## Development Setup

### Start Development Environment
```bash
npm install
npm run dev:all
```

This starts:
- **Frontend (Vite):** http://localhost:5173
- **Backend (Express):** http://localhost:3000

### Mobile Testing
Find your PC IP:
```bash
ipconfig
# Look for "IPv4 Address" like 192.168.x.x
```

Open on mobile at: `http://YOUR_PC_IP:5173`

---

## Production Build

```bash
npm run build
```

Creates optimized production build in `dist/` folder.

---

## Deployment

### Option 1: Netlify/Vercel (Frontend Only)
1. Run `npm run build`
2. Deploy `dist/` folder to Netlify/Vercel
3. Backend must be deployed separately

### Option 2: Self-hosted Server
1. Deploy Node.js backend to your server
2. Update ESP IP in app settings
3. Deploy frontend build to same server

### Option 3: Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
EXPOSE 3000 5173
CMD ["npm", "run", "dev:all"]
```

---

## Environment Variables

Create `.env` file for production:
```
VITE_API_URL=https://api.yourdomain.com
VITE_FAST2SMS_URL=https://www.fast2sms.com/dev/bulkV2
```

---

## Performance Optimization

The app includes:
- ✅ Code splitting (Vite)
- ✅ PWA caching (vite-plugin-pwa)
- ✅ Image optimization
- ✅ Lazy loading routes
- ✅ Minified CSS/JS

---

## Browser Support

| Browser | iOS | Android | Support |
|---------|-----|---------|---------|
| Chrome | - | 90+ | ✅ Full |
| Safari | 14+ | - | ✅ Full |
| Firefox | - | 88+ | ✅ Full |
| Edge | - | 90+ | ✅ Full |
| UC Browser | - | 12+ | ⚠️ Limited |

---

## Testing Checklist

- [ ] User registration works
- [ ] Login/logout functions
- [ ] Can add emergency contacts
- [ ] Phone number validation works
- [ ] Fast2SMS API key saves
- [ ] Test SMS can be sent
- [ ] SOS button requires 2-second hold
- [ ] GPS location permission requested
- [ ] Alert sent with location link
- [ ] Alert history displays correctly
- [ ] Admin dashboard loads
- [ ] PWA installs on mobile
- [ ] Works offline (loads from cache)

---

*For detailed information, see README.md*
