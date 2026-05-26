/**
 * src/utils/imageOptimizer.ts
 *
 * Client-side image compressor using HTML5 Canvas.
 * Compresses any image (PNG, JPEG, WebP, etc.) to a highly optimized WebP/JPEG base64 data URL.
 */

export const compressImageToWebP = (
  fileOrBase64: File | string,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Proportional scale checking
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        // Draw image into the canvas size
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas contents to modern WebP format
        let dataUrl = canvas.toDataURL('image/webp', quality);
        
        // If webp is not natively supported by the browser, fallback to jpeg
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => {
      reject(new Error('Failed to load image in optimizer: ' + String(err)));
    };

    // Load source
    if (typeof fileOrBase64 === 'string') {
      img.src = fileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          img.src = e.target.result;
        } else {
          reject(new Error('Failed to read file as DataURL'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrBase64);
    }
  });
};
