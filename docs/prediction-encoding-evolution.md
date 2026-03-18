# Prediction Encoding Evolution

This document captures the design discussion and implementation of a compact URL-safe encoding scheme for match predictions.

## Problem

The app encodes user predictions into the URL query string for sharing. The original approach — text serialization (`matchId:homeGoals:awayGoals;...`) followed by base64 encoding — produced very long URLs, especially for a full 552-match season.

## Iteration 1: Base62 Encoding + Match ID Prefix Stripping

- Replaced base64 (`btoa`/`atob`) with base62 encoding (characters `0-9A-Za-z`), which is URL-safe without percent-encoding.
- Stripped the common `54` prefix from match IDs during serialization (e.g., `540712` → `0712`), re-adding it on decode.
- **Result**: Still produced very long strings because base62 encoding of text bytes actually *inflates* the size (fewer symbols than ASCII).

## Iteration 2: Positional Binary Encoding

Instead of serializing to text and then encoding, pack predictions directly into a compact binary format:

- Create a `Uint8Array` with one byte per match, using the sorted match list as a positional index.
- Each byte packs `(homeGoals << 4) | awayGoals` into the upper and lower nybbles (4 bits each).
- Use `0xFF` as a sentinel for "no prediction" (goal values of 15 are unrealistic).
- Encode the byte array with base64url (URL-safe base64 without padding).

**Result**: Fixed size of 552 bytes → **736 base64url characters** regardless of prediction count.

### Trade-offs

- Fixed size means sparse predictions (few matches predicted) produce the same length URL as dense predictions.
- The encoding depends on the match list being stable (match IDs don't change), which holds for a fixed football season.

## Iteration 3: Skip Count Header

Since predictions are only relevant for `SCHEDULED` matches (the standings calculation ignores predictions for `FINISHED` matches), we can skip encoding finished matches:

- Prepend a 2-byte uint16 header representing how many leading matches (sorted by ID) to skip.
- Only encode the remaining positions after the skip point.

**Result**: For 309 finished + 243 remaining matches → **327 characters**.

### Problem Discovered

The skip count assumes `FINISHED` matches form a contiguous prefix of the sorted ID list. Postponed fixtures (e.g., match 541021 scheduled but later matches already played) break this assumption, causing `FINISHED` matches to appear *after* the skip point. These encode as wasteful `0xFF` sentinel bytes.

## Iteration 4: Bitmap Approach

Replace the sentinel-based encoding with a bitmap that explicitly marks which positions have predictions:

- 552-bit bitmap (69 bytes): one bit per match, `1` = has prediction, `0` = no prediction.
- After the bitmap, pack only the goal bytes for positions with `1` bits. No sentinels needed.

**Result**: 69 + 135 = 204 bytes → **272 characters**. Self-describing and independent of match statuses at decode time.

## Iteration 5 (Final): Skip Count + Bitmap Hybrid

Combine the skip count with the bitmap to eliminate the leading zero bytes:

- **2 bytes**: uint16 skip count — the position of the first prediction in the sorted match list.
- **N bytes**: bitmap covering only positions from the skip point onward (not the full 552).
- **M bytes**: packed goals, one per `1` bit in the bitmap.

### Encoding Format

```
┌──────────────┬──────────────────────┬─────────────────┐
│ Skip Count   │ Bitmap               │ Goals           │
│ (2 bytes)    │ (⌈remaining/8⌉ bytes)│ (1 byte per     │
│ uint16 BE    │ 1 = has prediction   │  prediction)    │
│              │ 0 = no prediction    │ hi=home lo=away │
└──────────────┴──────────────────────┴─────────────────┘
```

### Goal Byte Packing

Each goal byte stores two values:
- Upper nybble (bits 7-4): home goals (0-15)
- Lower nybble (bits 3-0): away goals (0-15)

Example: a 2-1 prediction → `(2 << 4) | 1` → `0x21`

### Encoding Process

1. Sort all matches by ID.
2. Find the index of the first match with a prediction → this is the skip count.
3. For remaining positions, build a bitmap (`1` if predicted, `0` otherwise).
4. Collect packed goal bytes for all predicted matches, in order.
5. Concatenate: `[skip_count_hi, skip_count_lo, ...bitmap, ...goals]`.
6. Base64url-encode the byte array.

### Decoding Process

1. Base64url-decode the string.
2. Read the 2-byte skip count.
3. Calculate `remaining = totalMatches - skipCount` and `bitmapBytes = ⌈remaining / 8⌉`.
4. Walk the bitmap; for each `1` bit, read the next goal byte and associate it with the match ID at `sorted[skipCount + i]`.

### Result

For 135 predictions across 552 matches:
- Skip count: 309 (2 bytes)
- Bitmap: 31 bytes (243 remaining positions)
- Goals: 135 bytes
- **Total: 168 bytes → 224 base64url characters**

### Resilience to Status Changes

The encoded URL is self-describing via the bitmap and skip count — it does not depend on match statuses at decode time. If a predicted match transitions from `SCHEDULED` to `FINISHED` after the URL was shared:

- The prediction is still decoded correctly (the bitmap preserves the positional mapping).
- The standings calculation harmlessly ignores it (it uses the actual result for `FINISHED` matches).

### Size Comparison

| Approach                    | Encoded Length |
|-----------------------------|---------------|
| Text + base64 (original)   | ~6,700 chars  |
| Text + base62              | ~6,700 chars  |
| Full positional array      | 736 chars     |
| Skip count + sentinels     | 327 chars     |
| Full bitmap (no skip)      | 272 chars     |
| **Skip count + bitmap**    | **224 chars** |

### Maximum Case

If all 552 matches had predictions (no skip, full bitmap):
- 2 + 69 + 552 = 623 bytes → ~831 base64url characters. Well under the 1,600 character target.

## Files Modified

- `src/utils/serialization.ts` — `encodePredictions()` and `decodePredictions()` implement the skip count + bitmap scheme.
- `src/hooks/usePredictions.ts` — Accepts `Match[]` (with statuses) and passes to serialization functions.
- `src/App.tsx` — Passes the `matches` array to `usePredictions()`.
