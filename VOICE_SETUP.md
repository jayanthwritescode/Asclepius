# 🎤 Voice Features Setup & Troubleshooting

## Quick Test
Visit: http://localhost:3000/test-voice

This page will help you diagnose any issues with voice features.

## ✨ 100% Free Voice Features

**No API keys needed!** The app now uses browser's built-in Web Speech API for both:
- **Speech-to-Text (STT)**: Unlimited, free
- **Text-to-Speech (TTS)**: Unlimited, free

Just open the app and start talking - it works out of the box!

## Setup Steps

### 1. No Setup Required! 🎉
The voice features work immediately without any configuration.

### 2. Just Run the App
```bash
npm run dev
```

### 3. Start Using Voice
Visit any patient page and click the microphone button!

## Testing Voice Features

### Test Page
1. Visit: http://localhost:3000/test-voice
2. Click "Check API Key" - should show ✅ if configured
3. Click "Start Listening" and speak
4. Click "Test Browser TTS" - should hear voice
5. Click "Test ElevenLabs TTS" - should hear higher quality voice

### Patient Pages
- http://localhost:3000/patient/history
- http://localhost:3000/patient/assistant

Click the microphone button and speak!

## Common Issues & Solutions

### Issue 1: "Speech Recognition not supported"
**Solution:** Use Chrome, Edge, or Safari browser. Firefox doesn't support Web Speech API.

### Issue 2: Microphone not working
**Solutions:**
- Allow microphone permissions when prompted
- Check browser settings → Privacy → Microphone
- Try HTTPS (required in production)
- Check if another app is using the microphone

### Issue 3: "API Key not configured"
**Solutions:**
- Make sure you added the key to `.env.local` (not `.env`)
- Remove placeholder text `your_elevenlabs_api_key_here`
- Restart dev server after adding key
- Check for typos in the key

### Issue 4: ElevenLabs TTS not working
**Solutions:**
- Verify API key is valid on elevenlabs.io
- Check you haven't exceeded free tier (10k chars/month)
- Look at browser console for errors (F12)
- System will automatically fallback to browser TTS

### Issue 5: Voice works but doesn't auto-send message
**Solution:** This is expected! The voice transcription appears in the text box, then you need to click send or press Enter.

### Issue 6: No sound output
**Solutions:**
- Check system volume
- Check browser isn't muted
- Try different browser
- Test with "Browser TTS" button first

## How It Works

### Speech-to-Text (STT)
- Uses Web Speech API (built into browser)
- 100% FREE, unlimited usage
- Works offline
- Supports Indian languages (en-IN, hi-IN, ta-IN, etc.)

### Text-to-Speech (TTS)
- Primary: ElevenLabs API (high quality, natural voice)
- Fallback: Browser Speech Synthesis (if ElevenLabs fails)
- Automatic fallback ensures it always works

## Voice Flow

```
1. Click microphone 🎙️
2. Speak naturally
3. Web Speech API transcribes
4. Text appears in input box
5. Message sent to AI
6. AI responds with text
7. ElevenLabs converts to speech
8. Audio plays automatically
```

## Browser Compatibility

| Browser | STT | TTS |
|---------|-----|-----|
| Chrome  | ✅  | ✅  |
| Edge    | ✅  | ✅  |
| Safari  | ✅  | ✅  |
| Firefox | ❌  | ✅  |

## API Limits

### Free Tier (ElevenLabs)
- 10,000 characters/month
- ~200 AI responses
- Resets monthly

### If You Exceed
- System automatically uses browser TTS
- Still works, just different voice quality
- Or upgrade to paid plan ($5/month)

## Debugging

### Check Browser Console
1. Press F12 to open DevTools
2. Go to Console tab
3. Look for errors in red
4. Common errors:
   - "API key not configured" → Add key to .env.local
   - "Failed to generate speech" → Check API key validity
   - "not-allowed" → Grant microphone permissions

### Check Network Tab
1. Press F12 → Network tab
2. Click microphone and speak
3. Look for `/api/tts` request
4. Check response status:
   - 200 = Success ✅
   - 500 = API key issue ⚠️
   - 401 = Invalid key ❌

### Check Server Logs
Look at terminal where `npm run dev` is running:
- "ElevenLabs API key not found" → Not in .env.local
- "ElevenLabs API error" → Invalid key or quota exceeded

## Still Not Working?

1. Visit test page: http://localhost:3000/test-voice
2. Click "Check API Key" button
3. Try "Browser TTS" first (always works)
4. Check browser console for errors
5. Verify you're using Chrome/Edge
6. Make sure microphone permissions are granted

## Without ElevenLabs (100% Free)

The voice features work WITHOUT ElevenLabs API key!
- STT: Web Speech API (free, unlimited)
- TTS: Browser Speech Synthesis (free, unlimited)
- Just click the microphone and it works!
- Voice quality is lower but completely functional

## Support

If issues persist:
1. Check browser console (F12)
2. Check server terminal logs
3. Try the test page first
4. Verify browser compatibility
