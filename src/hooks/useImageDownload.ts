import { useMemo, useEffect, useCallback } from 'react';
import type { RefObject } from 'react';
import { useImageCapture } from './useImageCapture';

interface UseImageDownloadOptions {
  captureRef: RefObject<HTMLElement | null>;
  slug: string;
  competitionName: string;
  competitionSeason: string;
  captureSignature: string;
  scale?: number;
}

interface UseImageDownloadResult {
  imageFile: File | null;
  isRenderingImage: boolean;
  onDownloadImage: () => void;
}

export const useImageDownload = ({
  captureRef,
  slug,
  competitionName,
  competitionSeason,
  captureSignature,
  scale = 2,
}: UseImageDownloadOptions): UseImageDownloadResult => {
  const metadata = useMemo(
    () => ({
      Title: `Football Predictor ${competitionName} ${competitionSeason}`,
      Source: window.location.href,
    }),
    [competitionName, competitionSeason],
  );

  const { imageFile, isRenderingImage, renderImage } = useImageCapture({
    captureRef,
    fileName: `${slug}-standings.png`,
    metadata,
    scale,
  });

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void renderImage();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [captureSignature, renderImage]);

  const onDownloadImage = useCallback(() => {
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
  }, [imageFile]);

  return { imageFile, isRenderingImage, onDownloadImage };
};
