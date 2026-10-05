const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createOgImage() {
  const width = 1200;
  const height = 630;

  const logo1Path = path.join(__dirname, '../src/assets/logo/logo1.png');

  // 1. Create a rounded version of logo1.png with a luxury gold border
  const logoSize = 480;
  const roundedMask = Buffer.from(`
    <svg width="${logoSize}" height="${logoSize}">
      <rect x="0" y="0" width="${logoSize}" height="${logoSize}" rx="28" fill="#fff"/>
    </svg>
  `);

  const processedLogo = await sharp(logo1Path)
    .resize(logoSize, logoSize, { fit: 'cover' })
    .composite([
      {
        input: roundedMask,
        blend: 'dest-in'
      }
    ])
    .png()
    .toBuffer();

  // 2. SVG layout
  const svgOverlay = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#07060E"/>
        <stop offset="60%" stop-color="#0F0C2E"/>
        <stop offset="100%" stop-color="#1A1244"/>
      </linearGradient>

      <radialGradient id="gold-glow" cx="25%" cy="50%" r="55%">
        <stop offset="0%" stop-color="#D97706" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>

      <radialGradient id="purple-glow" cx="85%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#6366F1" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#bg-grad)"/>
    <rect width="${width}" height="${height}" fill="url(#gold-glow)"/>
    <rect width="${width}" height="${height}" fill="url(#purple-glow)"/>

    <!-- Subtle Gold Border Frame -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="24" fill="none" stroke="rgba(245, 158, 11, 0.25)" stroke-width="1.5"/>

    <!-- Logo Card Border / Glow -->
    <rect x="68" y="${Math.floor((height - logoSize) / 2) - 4}" width="${logoSize + 8}" height="${logoSize + 8}" rx="32" fill="none" stroke="rgba(245, 158, 11, 0.4)" stroke-width="2"/>

    <!-- Right Side Content -->
    <!-- Eyebrow badge -->
    <g transform="translate(600, 120)">
      <rect x="0" y="0" width="370" height="38" rx="19" fill="rgba(255, 255, 255, 0.07)" stroke="rgba(253, 230, 138, 0.45)" stroke-width="1.2"/>
      <text x="185" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" fill="#FDE68A" letter-spacing="2" text-anchor="middle">
        ESCROW-SECURED MARKETPLACE
      </text>
    </g>

    <!-- Headings -->
    <text x="600" y="215" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="bold" fill="#FFFFFF" letter-spacing="-0.5">
      Curated Celebrations.
    </text>
    <text x="600" y="272" font-family="Georgia, 'Times New Roman', serif" font-size="46" font-weight="bold" fill="#F59E0B" letter-spacing="-0.5">
      100% Escrow Certainty.
    </text>

    <!-- Description -->
    <text x="600" y="335" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="400" fill="#CBD5E1">
      Book top photographers, DJs, caterers &amp; venues
    </text>
    <text x="600" y="365" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="400" fill="#CBD5E1">
      with milestone payments released solely upon approval.
    </text>

    <!-- Trust Badges -->
    <g transform="translate(600, 420)">
      <g transform="translate(0, 0)">
        <rect width="165" height="40" rx="12" fill="rgba(15, 12, 59, 0.9)" stroke="rgba(99, 102, 241, 0.6)" stroke-width="1"/>
        <text x="82" y="25" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">🔒 FDIC Escrow</text>
      </g>
      <g transform="translate(180, 0)">
        <rect width="165" height="40" rx="12" fill="rgba(15, 12, 59, 0.9)" stroke="rgba(99, 102, 241, 0.6)" stroke-width="1"/>
        <text x="82" y="25" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">✨ Vetted Artisans</text>
      </g>
      <g transform="translate(360, 0)">
        <rect width="180" height="40" rx="12" fill="rgba(15, 12, 59, 0.9)" stroke="rgba(99, 102, 241, 0.6)" stroke-width="1"/>
        <text x="90" y="25" font-family="-apple-system, sans-serif" font-size="13" font-weight="600" fill="#FFFFFF" text-anchor="middle">⚡ Milestone Payouts</text>
      </g>
    </g>

    <!-- Footer -->
    <text x="600" y="540" font-family="-apple-system, sans-serif" font-size="14" font-weight="500" fill="rgba(255, 255, 255, 0.5)">
      ophir-events.com • The Premier Milestone Marketplace
    </text>
  </svg>
  `;

  // 3. Composite
  const ogImageBuffer = await sharp(Buffer.from(svgOverlay))
    .composite([
      {
        input: processedLogo,
        top: Math.floor((height - logoSize) / 2),
        left: 72,
      }
    ])
    .png({ quality: 95 })
    .toBuffer();

  const publicPng = path.join(__dirname, '../public/og-image.png');
  const publicJpg = path.join(__dirname, '../public/og-image.jpg');
  fs.writeFileSync(publicPng, ogImageBuffer);

  const jpgBuffer = await sharp(ogImageBuffer).jpeg({ quality: 92 }).toBuffer();
  fs.writeFileSync(publicJpg, jpgBuffer);

  console.log('Successfully updated OG images with logo1.png');
}

createOgImage().catch(console.error);
