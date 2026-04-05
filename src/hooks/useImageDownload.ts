import { useMemo, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';
import { useImageCapture } from './useImageCapture';

interface UseImageDownloadOptions {
  captureRefs: [RefObject<HTMLElement | null>, RefObject<HTMLElement | null>];
  slug: string;
  competitionName: string;
  competitionSeason: string;
  captureSignature: string;
  scale?: number;
}

interface UseImageDownloadResult {
  imageFiles: { top: File | null; bottom: File | null };
  isRenderingImage: boolean;
  onDownloadImage: () => void;
}

export const useImageDownload = ({
  captureRefs,
  slug,
  competitionName,
  competitionSeason,
  captureSignature,
  scale = 2,
}: UseImageDownloadOptions): UseImageDownloadResult => {
  const [topCaptureRef, bottomCaptureRef] = captureRefs;
  const metadata = useMemo(
    () => ({
      Title: `Football Predictor ${competitionName} ${competitionSeason}`,
      Source: window.location.href,
    }),
    [competitionName, competitionSeason],
  );

  const {
    imageFile: topImageFile,
    isRenderingImage: isRenderingTopImage,
    renderImage: renderTopImage,
  } = useImageCapture({
    captureRef: topCaptureRef,
    fileName: `${slug}-standings-top.png`,
    metadata,
    scale,
  });

  const {
    imageFile: bottomImageFile,
    isRenderingImage: isRenderingBottomImage,
    renderImage: renderBottomImage,
  } = useImageCapture({
    captureRef: bottomCaptureRef,
    fileName: `${slug}-standings-bottom.png`,
    metadata,
    scale,
  });

  const imageFiles = useMemo(
    () => ({ top: topImageFile, bottom: bottomImageFile }),
    [topImageFile, bottomImageFile],
  );
  const isRenderingImage = isRenderingTopImage || isRenderingBottomImage;

  useEffect(() => {
    // Defer image capture to avoid blocking the main thread during navigation/render.
    // requestIdleCallback ensures it runs when the browser is idle; the 2s timeout
    // guarantees it still fires even on busy pages.
    const scheduleCapture = typeof requestIdleCallback === 'function'
      ? (cb: () => void) => requestIdleCallback(cb, { timeout: 2000 })
      : (cb: () => void) => window.setTimeout(cb, 500);

    const cancelCapture = typeof cancelIdleCallback === 'function'
      ? (id: number) => cancelIdleCallback(id)
      : (id: number) => window.clearTimeout(id);

    const id = scheduleCapture(() => {
      void Promise.all([renderTopImage(), renderBottomImage()]);
    });

    return () => {
      cancelCapture(id as number);
    };
  }, [captureSignature, renderTopImage, renderBottomImage]);

  const onDownloadImage = useCallback(() => {
    [imageFiles.top, imageFiles.bottom].forEach((imageFile) => {
      if (!imageFile) {
        return;
      }

      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(imageFile);
      link.download = imageFile.name;
      link.href = objectUrl;
      link.click();
      // Revoke URL shortly after triggering download.
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    });
  }, [imageFiles]);

  return { imageFiles, isRenderingImage, onDownloadImage };
};
