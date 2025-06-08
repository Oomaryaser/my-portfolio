import sharp from 'sharp';

export default async function optimize(buffer) {
  return sharp(buffer)
    .rotate()
    .resize({ width: 1280, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
}
