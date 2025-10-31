# reCAPTCHA Setup Guide

## Översikt

Kontaktformuläret använder Google reCAPTCHA v2 för att skydda mot spam. E-postadressen är också dold tills användaren löser CAPTCHA. För att få detta att fungera i produktion behöver du konfigurera både frontend och backend.

## ⚠️ Viktigt att förstå

- **Site Key** (publik) - Kan vara synlig i frontend-koden ✅
- **Secret Key** (privat) - Får ALDRIG vara i frontend-koden ❌
- En statisk site (GitHub Pages) behöver en backend/serverless function för att verifiera CAPTCHA säkert

---

## 🚀 Alternativ 1: Formspree (Enklast - Rekommenderat)

Formspree hanterar både CAPTCHA-verifiering och e-postutskick åt dig.

### Steg 1: Skapa Formspree-konto

1. Gå till [formspree.io](https://formspree.io) och skapa ett gratis konto
2. Skapa ett nytt formulär
3. Kopiera ditt Form ID (ser ut som `xyzabc123`)

### Steg 2: Skaffa reCAPTCHA-nycklar

1. Gå till [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
2. Klicka på "+" för att registrera en ny site
3. Fyll i:
   - **Label**: Namnet på din site (t.ex. "IT Konsult")
   - **reCAPTCHA type**: Välj "reCAPTCHA v2" → "I'm not a robot Checkbox"
   - **Domains**: Lägg till din domän (t.ex. `example.com` och `www.example.com`)
     - För GitHub Pages: `username.github.io`
     - För lokal utveckling: `localhost`
4. Acceptera villkoren och klicka "Submit"
5. Kopiera din **Site Key** och **Secret Key**

### Steg 3: Konfigurera Formspree

1. I Formspree, gå till ditt formulär → Settings → Integrations
2. Aktivera "reCAPTCHA"
3. Klistra in din **Secret Key** från Google
4. Spara inställningarna

### Steg 4: Uppdatera frontend-koden

#### A. Uppdatera Site Key

Öppna `src/pages/Contact.tsx` och hitta rad ~166:

```typescript
<ReCAPTCHA
  ref={recaptchaRef}
  sitekey="DIN_SITE_KEY_HÄR"  // ← Byt ut denna
  onChange={handleCaptchaChange}
/>
```

#### B. Uppdatera formulärets submit-funktion

I `src/pages/Contact.tsx`, hitta `handleSubmit`-funktionen och ersätt simulerad submission med Formspree:

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()

  if (formData.honeypot) {
    return
  }

  if (!captchaVerified) {
    setStatus('error')
    return
  }

  setStatus('sending')

  try {
    const captchaToken = recaptchaRef.current?.getValue()
    
    const response = await fetch('https://formspree.io/f/DITT_FORM_ID', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
        'g-recaptcha-response': captchaToken
      }),
    })

    if (response.ok) {
      setStatus('success')
      setFormData({ name: '', email: '', company: '', message: '', honeypot: '' })
      recaptchaRef.current?.reset()
      setCaptchaVerified(false)
    } else {
      setStatus('error')
    }
  } catch (error) {
    setStatus('error')
  }
}
```

#### C. Uppdatera e-postadress

I `src/pages/Contact.tsx`, hitta rad ~207-208 och byt till din riktiga e-postadress:

```typescript
<a href="mailto:din@email.se" className="text-primary-600 hover:underline">
  din@email.se
</a>
```

### Steg 5: Testa

1. Kör `npm run dev`
2. Gå till kontaktsidan
3. Lös CAPTCHA - e-postadressen ska nu visas
4. Fyll i formuläret och skicka
5. Kontrollera att du får e-post via Formspree

---

## 🔧 Alternativ 2: Netlify Functions (För mer kontroll)

Om du vill ha full kontroll och hostar på Netlify.

### Steg 1: Skaffa reCAPTCHA-nycklar

Samma som Alternativ 1, Steg 2.

### Steg 2: Skapa Netlify Function

Skapa filen `netlify/functions/contact.ts`:

```typescript
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { name, email, company, message, captchaToken } = JSON.parse(event.body || '{}')

  // Verifiera CAPTCHA
  const captchaResponse = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
    }
  )

  const captchaData = await captchaResponse.json()

  if (!captchaData.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'CAPTCHA verification failed' })
    }
  }

  // Skicka e-post här (t.ex. med SendGrid, AWS SES, etc.)
  // Exempel med SendGrid:
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  await sgMail.send({
    to: 'din@email.se',
    from: 'noreply@dindomän.se',
    subject: `Nytt meddelande från ${name}`,
    text: `
      Namn: ${name}
      E-post: ${email}
      Företag: ${company}
      
      Meddelande:
      ${message}
    `
  })
  */

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  }
}
```

### Steg 3: Konfigurera miljövariabler

I Netlify Dashboard → Site Settings → Environment Variables, lägg till:

- `RECAPTCHA_SECRET_KEY`: Din secret key från Google
- `SENDGRID_API_KEY`: Din SendGrid API-nyckel (om du använder SendGrid)

### Steg 4: Uppdatera frontend

I `src/pages/Contact.tsx`:

```typescript
const response = await fetch('/.netlify/functions/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    company: formData.company,
    message: formData.message,
    captchaToken: recaptchaRef.current?.getValue()
  }),
})
```

### Steg 5: Installera dependencies

```bash
npm install --save-dev @netlify/functions
npm install @sendgrid/mail  # Om du använder SendGrid
```

---

## 🌐 Alternativ 3: Cloudflare Workers

Liknande Netlify Functions men med Cloudflare's plattform.

### Steg 1: Skapa Worker

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const { name, email, company, message, captchaToken } = await request.json()

  // Verifiera CAPTCHA
  const formData = new FormData()
  formData.append('secret', RECAPTCHA_SECRET_KEY)
  formData.append('response', captchaToken)

  const captchaResponse = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      body: formData
    }
  )

  const captchaData = await captchaResponse.json()

  if (!captchaData.success) {
    return new Response(
      JSON.stringify({ error: 'CAPTCHA verification failed' }),
      { status: 400 }
    )
  }

  // Skicka e-post här
  // ...

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
}
```

---

## 📝 Checklist

- [ ] Skapat Google reCAPTCHA-konto och fått Site Key + Secret Key
- [ ] Lagt till domäner i reCAPTCHA-inställningar
- [ ] Uppdaterat Site Key i `src/pages/Contact.tsx` (rad ~166)
- [ ] Valt och konfigurerat backend-lösning (Formspree/Netlify/Cloudflare)
- [ ] Uppdaterat `handleSubmit`-funktionen för att skicka till backend
- [ ] Bytt ut e-postadress till din riktiga (rad ~207-208)
- [ ] Testat formuläret lokalt
- [ ] Testat formuläret i produktion

---

## 🔍 Felsökning

### CAPTCHA visas inte
- Kontrollera att Site Key är korrekt
- Kontrollera att domänen är tillåten i reCAPTCHA-inställningar
- Öppna Console i webbläsaren för felmeddelanden

### Formuläret skickas inte
- Kontrollera Network-fliken i DevTools
- Verifiera att backend-endpoint är korrekt
- Kontrollera att Secret Key är korrekt konfigurerad i backend

### E-postadressen visas inte efter CAPTCHA
- Kontrollera att `captchaVerified` state uppdateras korrekt
- Öppna React DevTools och inspektera state

### "CAPTCHA verification failed"
- Kontrollera att Secret Key matchar Site Key
- Verifiera att CAPTCHA-token skickas korrekt till backend
- Kontrollera att backend får rätt token

---

## 📚 Resurser

- [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha/docs/display)
- [Formspree Documentation](https://help.formspree.io/)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

---

## 💡 Tips

1. **Utveckling**: Använd Google's test-nyckel `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI` som alltid godkänns
2. **Produktion**: Byt till din riktiga Site Key innan deployment
3. **Säkerhet**: Lagra aldrig Secret Key i frontend-kod eller Git
4. **Testing**: Testa både lyckad och misslyckad CAPTCHA-verifiering
5. **UX**: Överväg att lägga till loading-spinner när formuläret skickas
