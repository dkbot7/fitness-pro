/**
 * Script para gerar ícones PWA a partir do SVG
 *
 * Uso:
 * pnpm add -D sharp (se ainda não tiver)
 * node scripts/generate-icons.js
 *
 * Gera:
 * - public/icon-192x192.png
 * - public/icon-512x512.png
 */

import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svgPath = join(__dirname, '../public/icon.svg');
const publicPath = join(__dirname, '../public');

async function generateIcons() {
  try {
    const svgBuffer = readFileSync(svgPath);

    // Gerar 192x192
    await sharp(svgBuffer)
      .resize(192, 192)
      .png()
      .toFile(join(publicPath, 'icon-192x192.png'));

    console.log('✅ icon-192x192.png gerado com sucesso');

    // Gerar 512x512
    await sharp(svgBuffer)
      .resize(512, 512)
      .png()
      .toFile(join(publicPath, 'icon-512x512.png'));

    console.log('✅ icon-512x512.png gerado com sucesso');

    // Gerar apple-touch-icon 180x180
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(join(publicPath, 'apple-touch-icon.png'));

    console.log('✅ apple-touch-icon.png gerado com sucesso');

    // Gerar favicon 32x32
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(join(publicPath, 'favicon-32x32.png'));

    console.log('✅ favicon-32x32.png gerado com sucesso');

    // Gerar favicon 16x16
    await sharp(svgBuffer)
      .resize(16, 16)
      .png()
      .toFile(join(publicPath, 'favicon-16x16.png'));

    console.log('✅ favicon-16x16.png gerado com sucesso');

    console.log('\n🎉 Todos os ícones foram gerados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();
