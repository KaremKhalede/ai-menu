---
Task ID: 2
Agent: Main Agent
Task: Add real AI API integration + auth system with login, onboarding, and admin settings

Work Log:
- Updated Prisma schema: added User model (roles, phone, email, isOnboarded, restaurantId) and Session model
- Built 6 auth API routes: send-otp, verify-otp, send-magic-link, verify-magic-link, me, logout
- Created OTP store with rate limiting (3/min) and 2-min expiry
- Built real AI chat API route using z-ai-web-dev-sdk LLM (glm-4-flash model)
- Created login page with 6 states: method selection, phone input, OTP verification, email, email success, loading
- Built 4-step onboarding wizard: restaurant type, name/theme/currency, AI menu generation, welcome success
- Built admin settings page: profile, restaurant info, team management, security, subscription
- Updated AI chat component to call real LLM API with fallback to local templates
- Added auth guards (AuthGuard components) to Dashboard and MenuEditor
- Added user welcome message in dashboard header
- Updated landing page with "تسجيل الدخول" nav button
- Fixed onboarding step 3→4 transition bug
- Fixed React hooks conditional call errors (moved auth guards to wrapper components)
- Verified complete auth flow via agent-browser: login → OTP → onboarding → dashboard → settings → AI chat

Stage Summary:
- Real LLM integration confirmed working (AI responds with contextual Arabic, not templates)
- WhatsApp OTP flow: phone input → 6-digit code (demo: 123456) → auto-verify → onboarding
- Email magic link flow with demo shortcut
- Auth-protected views: Dashboard and Menu Editor require login
- Zero lint errors, zero console errors after all fixes
- Session management with JWT-like tokens stored in database