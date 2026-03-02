import type { Match, PointDeduction, PredictionsStore } from '../types';

type PredictionsPayload = PredictionsStore['predictions'];

const HEADER_BYTES = 2;

const base64urlEncode = (bytes: Uint8Array): string => {
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
  return btoa(binString).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64urlDecode = (encoded: string): Uint8Array => {
  let padded = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (padded.length % 4 !== 0) padded += '=';
  const binString = atob(padded);
  return Uint8Array.from(binString, (c) => c.charCodeAt(0));
};

export const encodePredictions = (
  predictions: PredictionsPayload,
  matches: Pick<Match, 'id' | 'status'>[],
): string => {
  const sorted = [...matches].sort((a, b) => a.id - b.id);

  let skipCount = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (predictions[String(sorted[i].id)]) {
      skipCount = i;
      break;
    }
  }

  const remaining = sorted.length - skipCount;
  const bitmapBytes = Math.ceil(remaining / 8);
  const bitmap = new Uint8Array(bitmapBytes);
  const goals: number[] = [];

  for (let i = 0; i < remaining; i++) {
    const prediction = predictions[String(sorted[skipCount + i].id)];
    if (prediction) {
      bitmap[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
      goals.push((prediction.homeGoals << 4) | prediction.awayGoals);
    }
  }

  const bytes = new Uint8Array(HEADER_BYTES + bitmapBytes + goals.length);
  bytes[0] = (skipCount >> 8) & 0xff;
  bytes[1] = skipCount & 0xff;
  bytes.set(bitmap, HEADER_BYTES);
  bytes.set(goals, HEADER_BYTES + bitmapBytes);

  return base64urlEncode(bytes);
};

export const decodePredictions = (
  encoded: string,
  matches: Pick<Match, 'id' | 'status'>[],
): PredictionsPayload => {
  const bytes = base64urlDecode(encoded);
  const sorted = [...matches].sort((a, b) => a.id - b.id);

  const skipCount = (bytes[0] << 8) | bytes[1];
  const remaining = sorted.length - skipCount;
  const bitmapBytes = Math.ceil(remaining / 8);
  const predictions: PredictionsPayload = {};

  let goalIndex = 0;
  for (let i = 0; i < remaining; i++) {
    const byteIndex = Math.floor(i / 8);
    const bitMask = 1 << (7 - (i % 8));

    if (bytes[HEADER_BYTES + byteIndex] & bitMask) {
      const goalByte = bytes[HEADER_BYTES + bitmapBytes + goalIndex];
      predictions[String(sorted[skipCount + i].id)] = {
        homeGoals: goalByte >> 4,
        awayGoals: goalByte & 0x0f,
      };
      goalIndex++;
    }
  }

  return predictions;
};

export const encodeDeductions = (deductions: PointDeduction[]): string => {
  return btoa(JSON.stringify(deductions));
};

export const decodeDeductions = (encoded: string): PointDeduction[] => {
  if (!encoded) return [];
  return JSON.parse(atob(encoded)) as PointDeduction[];
};
