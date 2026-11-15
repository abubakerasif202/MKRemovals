# Cinematic homepage visual QA

Playwright captures of the production build at all nine requested widths. Lazy images are visited and decoded before capture. Motion is enabled; the separate browser tests verify actual transform progression, section entrances, and reduced-motion behavior on Chromium, Firefox, WebKit, iPhone and Android emulation.

| Viewport width | Full homepage |
| --- | --- |
| 320 | [320px](home-320.webp) |
| 360 | [360px](home-360.webp) |
| 375 | [375px](home-375.webp) |
| 390 | [390px](home-390.webp) |
| 430 | [430px](home-430.webp) |
| 768 | [768px](home-768.webp) |
| 1024 | [1024px](home-1024.webp) |
| 1440 | [1440px](home-1440.webp) |
| 1920 | [1920px](home-1920.webp) |

Hero close-ups: [mobile](hero-390.webp), [desktop](hero-1440.webp).

`viewports.json` records overflow, selected truck image and sampled motion. `browser-errors.json` records uncaught page errors. The full-page captures are stored as WebP from Playwright screenshot buffers to keep the review artifacts compact. Original reference: user-supplied MRK cinematic homepage concept. The exact riverside scene is unavailable separately; existing approved concept artwork is reused as documented in `../../CINEMATIC_REDESIGN.md`.
