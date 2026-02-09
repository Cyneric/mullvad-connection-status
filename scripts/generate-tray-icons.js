/**
 * @file generate-tray-icons.js
 *
 * Generates colored PNG tray icons from SVG sources
 * Creates green (connected), red (disconnected), and blue (unknown) versions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICON_SIZE = 32;
const SRC_DIR = path.join(__dirname, '../src/assets/icons');
const DEST_DIR = path.join(__dirname, '../src-tauri/icons');

// Icon mappings: which SVG to use for which state
const ICON_CONFIGS = [
  {
    input: 'shield_encrypted.svg',
    output: 'tray-connected.png',
    color: '#44ad4d', // Mullvad green
    description: 'Connected state',
    size: 32
  },
  {
    input: 'shield_question.svg',
    output: 'tray-disconnected.png',
    color: '#e34039', // Mullvad red
    description: 'Disconnected state',
    size: 32
  },
  {
    input: 'shield_question.svg',
    output: 'tray-unknown.png',
    color: '#294d73', // Mullvad blue
    description: 'Unknown state',
    size: 32
  },
  {
    input: 'shield_encrypted.svg',
    output: 'icon.png',
    color: '#294d73', // Mullvad blue for app icon
    description: 'Application window icon',
    size: 256
  }
];

/**
 * Generates a colored PNG icon from an SVG file
 */
async function generateIcon(config) {
  const inputPath = path.join(SRC_DIR, config.input);
  const outputPath = path.join(DEST_DIR, config.output);
  const size = config.size || ICON_SIZE;

  console.log(`Generating ${config.description}: ${config.output}`);

  // Read the SVG file and replace the fill color
  let svgContent = fs.readFileSync(inputPath, 'utf8');
  svgContent = svgContent.replace(/fill="[^"]*"/, `fill="${config.color}"`);

  // Convert to PNG
  await sharp(Buffer.from(svgContent))
    .resize(size, size)
    .png()
    .toFile(outputPath);

  console.log(`  ✓ Created ${outputPath}`);
}

/**
 * Main function to generate all icons
 */
async function main() {
  console.log('Generating tray icons...\n');

  // Ensure destination directory exists
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  // Generate all icons
  for (const config of ICON_CONFIGS) {
    try {
      await generateIcon(config);
    } catch (error) {
      console.error(`Failed to generate ${config.output}:`, error.message);
      process.exit(1);
    }
  }

  console.log('\n✓ All tray icons generated successfully!');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
