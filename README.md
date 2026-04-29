<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0c43440d-e6a4-4038-af58-b40cc4b82ed7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## Login Credentials Configuration

Add the following environment variables in your local `.env` (or deployment environment):

```env
ASSET_APP_USERNAME=your_shared_username
ASSET_APP_PASSWORD=your_shared_password
```

These are injected at build time and used by the login screen. Do not expose credentials directly in source files.
