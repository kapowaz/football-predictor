const PNG_SIGNATURE = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const CHUNK_HEADER_SIZE = 8; // length (4) + type (4)
const CHUNK_CRC_SIZE = 4;

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

const crc32 = (data: Uint8Array): number => {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i += 1) {
    c = crcTable[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
};

const matchesSignature = (bytes: Uint8Array): boolean =>
  PNG_SIGNATURE.every((value, index) => bytes[index] === value);

const concatArrays = (arrays: Uint8Array[]): Uint8Array => {
  const total = arrays.reduce((sum, arr) => sum + arr.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;

  for (const arr of arrays) {
    output.set(arr, offset);
    offset += arr.length;
  }

  return output;
};

const createTextChunk = (keyword: string, value: string): Uint8Array => {
  const normalizedKeyword = keyword.trim();
  if (!normalizedKeyword) {
    throw new Error('PNG metadata keyword cannot be empty');
  }
  if (normalizedKeyword.length > 79) {
    throw new Error('PNG metadata keyword must be <= 79 characters');
  }
  if (normalizedKeyword.includes('\0')) {
    throw new Error('PNG metadata keyword cannot contain NUL');
  }

  const encoder = new TextEncoder();
  const type = encoder.encode('tEXt');
  const keyBytes = encoder.encode(normalizedKeyword);
  const valueBytes = encoder.encode(value);
  const data = new Uint8Array(keyBytes.length + 1 + valueBytes.length);
  data.set(keyBytes, 0);
  data[keyBytes.length] = 0;
  data.set(valueBytes, keyBytes.length + 1);

  const length = data.length;
  const chunk = new Uint8Array(CHUNK_HEADER_SIZE + data.length + CHUNK_CRC_SIZE);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, length, false);
  chunk.set(type, 4);
  chunk.set(data, 8);

  const crcInput = new Uint8Array(type.length + data.length);
  crcInput.set(type, 0);
  crcInput.set(data, type.length);
  view.setUint32(8 + data.length, crc32(crcInput), false);

  return chunk;
};

export const embedPngTextMetadata = async (
  pngBlob: Blob,
  metadata: Record<string, string>,
): Promise<Blob> => {
  const bytes = new Uint8Array(await pngBlob.arrayBuffer());
  if (bytes.length < PNG_SIGNATURE.length || !matchesSignature(bytes)) {
    throw new Error('Invalid PNG data');
  }

  const metadataEntries = Object.entries(metadata).filter(([, value]) => value.length > 0);
  if (metadataEntries.length === 0) {
    return pngBlob;
  }

  let iendOffset = -1;
  let offset = PNG_SIGNATURE.length;

  while (offset + CHUNK_HEADER_SIZE + CHUNK_CRC_SIZE <= bytes.length) {
    const view = new DataView(bytes.buffer, bytes.byteOffset + offset);
    const length = view.getUint32(0, false);
    const typeOffset = offset + 4;
    const type = String.fromCharCode(
      bytes[typeOffset],
      bytes[typeOffset + 1],
      bytes[typeOffset + 2],
      bytes[typeOffset + 3],
    );

    const chunkTotalSize = CHUNK_HEADER_SIZE + length + CHUNK_CRC_SIZE;
    if (offset + chunkTotalSize > bytes.length) {
      break;
    }

    if (type === 'IEND') {
      iendOffset = offset;
      break;
    }

    offset += chunkTotalSize;
  }

  if (iendOffset === -1) {
    throw new Error('PNG is missing IEND chunk');
  }

  const metadataChunks = metadataEntries.map(([key, value]) => createTextChunk(key, value));
  const output = concatArrays([
    bytes.slice(0, iendOffset),
    ...metadataChunks,
    bytes.slice(iendOffset),
  ]);

  const outputBuffer = new ArrayBuffer(output.byteLength);
  new Uint8Array(outputBuffer).set(output);
  return new Blob([outputBuffer], { type: 'image/png' });
};
