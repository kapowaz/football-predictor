import { useState, useCallback } from 'react';
import type { RefObject } from 'react';
import { domToPng as modernScreenshotToPng } from 'modern-screenshot';
import { embedPngTextMetadata } from '../utils/pngMetadata';

interface UseImageCaptureOptions {
  captureRef: RefObject<HTMLElement | null>;
  fileName: string;
  metadata?: Record<string, string>;
  scale?: number;
}

interface UseImageCaptureResult {
  imageFile: File | null;
  isRendering: boolean;
  renderImage: () => Promise<void>;
}

const waitForImages = async (container: HTMLElement): Promise<void> => {
  const images = Array.from(container.querySelectorAll('img'));
  await Promise.all(
    images.map(async (image) => {
      if (image.complete && image.naturalWidth > 0) {
        return;
      }
      if (typeof image.decode === 'function') {
        try {
          await image.decode();
          return;
        } catch {
          // Fall through to load/error listeners.
        }
      }
      await new Promise<void>((resolve) => {
        const done = () => resolve();
        image.addEventListener('load', done, { once: true });
        image.addEventListener('error', done, { once: true });
      });
    }),
  );
};

export const useImageCapture = ({
  captureRef,
  fileName,
  metadata,
  scale = 2,
}: UseImageCaptureOptions): UseImageCaptureResult => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  const renderImage = useCallback(async () => {
    const node = captureRef.current;
    if (!node) {
      return;
    }

    setIsRendering(true);

    try {
      if ('fonts' in document) {
        await document.fonts.ready;
      }
      await waitForImages(node);

      const dataUrl = await modernScreenshotToPng(node, { scale });
      const sourceBlob = await fetch(dataUrl).then((response) => response.blob());
      const outputBlob = metadata ? await embedPngTextMetadata(sourceBlob, metadata) : sourceBlob;
      const file = new File([outputBlob], fileName, { type: 'image/png' });
      setImageFile(file);
    } catch (error) {
      console.error('Failed to render image:', error);
      setImageFile(null);
    } finally {
      setIsRendering(false);
    }
  }, [captureRef, fileName, metadata, scale]);

  return { imageFile, isRendering, renderImage };
};
