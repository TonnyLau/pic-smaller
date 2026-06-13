# PicSmaller Compression Refactor PRD

## 1. Background

PicSmaller is currently a browser-only image compression tool built with Vite, React, MobX, Web Worker, OffscreenCanvas, and several local WASM codecs. The current compression implementation is concentrated in `src/engines`, where UI-facing worker code, codec selection, image processing, preview generation, and format-specific implementations are coupled together.

The refactor goal is to introduce a stable compression architecture before integrating jSquash. jSquash should be treated as a set of low-level codec packages, not as a page or application framework copied into PicSmaller.

## 2. Goals

- Decouple React UI from concrete compression engines.
- Introduce a unified codec protocol through `codecRouter`.
- Preserve the current user-facing behavior during the first refactor phase.
- Keep existing upload, preview, compression, compare, re-compress, and ZIP download flows working.
- Prepare the project for later jSquash integration through npm packages.
- Avoid copying jSquash monorepo source into this project.

## 3. Non-Goals

- Do not integrate jSquash in the first phase.
- Do not redesign the current UI.
- Do not add new SEO pages in the first phase.
- Do not add target-size compression in the first phase.
- Do not expand AVIF behavior beyond the existing capability detection and experimental path.
- Do not change the app from browser-only local compression to server-side compression.

## 4. Target Architecture

The target compression flow is:

```txt
PicSmaller UI
  -> compressBatch()
  -> compression.worker
  -> compressImage()
  -> codecRouter
  -> selected codec
  -> Canvas fallback
  -> CompressOutput
  -> UI preview / table / ZIP download
```

The UI must not directly know whether compression is handled by Canvas, the current PNG/GIF/AVIF/SVG implementations, or a future jSquash codec.

Recommended source layout:

```txt
src/lib/compression/
src/lib/codecs/
src/lib/workers/
src/lib/download/
src/types/
```

Existing UI components and MobX state may remain in place during the first phase. The first phase should focus on moving compression responsibilities behind stable interfaces.

## 5. Core Interfaces

The refactor should introduce these stable interfaces:

```ts
export type ImageFormat =
  | "jpg"
  | "jpeg"
  | "png"
  | "webp"
  | "gif"
  | "svg"
  | "avif";

export interface CompressionSettings {
  preset: "high" | "balanced" | "small" | "extreme" | "custom";
  quality: number;
  outputFormat: "same" | "jpg" | "jpeg" | "png" | "webp" | "avif";
  maxWidth?: number;
  maxHeight?: number;
  targetSizeKb?: number;
  keepMetadata?: boolean;
  preferWasm?: boolean;
}

export interface CompressInput {
  file: File | Blob;
  fileName: string;
  settings: CompressionSettings;
  signal?: AbortSignal;
}

export interface CompressOutput {
  blob: Blob;
  fileName: string;
  outputFormat: ImageFormat;
  originalSize: number;
  compressedSize: number;
  savedBytes: number;
  savedPercent: number;
  width: number;
  height: number;
  codecName: string;
}

export interface ImageCodec {
  name: string;
  inputFormats: ImageFormat[];
  outputFormats: ImageFormat[];
  isSupported: () => boolean | Promise<boolean>;
  compress: (input: CompressInput) => Promise<CompressOutput>;
}
```

The existing `CompressOption` can remain in the UI layer initially. A small adapter should translate it into `CompressionSettings` so the UI does not need to be rewritten during the first phase.

## 6. Phase 1: Architecture Refactor Without jSquash

Phase 1 should create the new architecture while keeping current behavior unchanged.

Required changes:

- Add `src/lib/compression/compressImage.ts`.
- Add `src/lib/compression/compressBatch.ts`.
- Add `src/lib/compression/formatDetect.ts`.
- Add `src/lib/compression/calculateSaving.ts`.
- Add `src/lib/codecs/codecTypes.ts`.
- Add `src/lib/codecs/codecRouter.ts`.
- Add codec adapters for existing implementations:
  - Canvas-based JPEG/WebP behavior
  - Existing PNG WASM behavior
  - Existing GIF WASM behavior
  - Existing SVG optimization behavior
  - Existing AVIF behavior where supported
- Keep Worker queue behavior equivalent to the current `Queue(3)` model.
- Keep current preview and compression result shapes compatible with `homeState`.
- Keep ZIP download output names compatible with current `getOutputFileName()` behavior.

Phase 1 acceptance criteria:

- `npm run test` passes.
- `npm run build` passes.
- JPG, PNG, WebP, GIF, and SVG uploads still produce preview and compression output.
- Existing output format selection still works for supported formats.
- Existing resize and crop options still work.
- Existing transparent fill behavior for JPEG output still works.
- Existing re-compress and clear flows still work.
- Existing ZIP download still works.
- No jSquash dependency is added.

## 7. Phase 2: jSquash JPEG and WebP Integration

After Phase 1 is stable, integrate jSquash through npm packages.

Install only the packages required for this phase:

```bash
npm install @jsquash/jpeg @jsquash/webp
```

Required changes:

- Add `src/lib/codecs/jsquashJpegCodec.ts`.
- Add `src/lib/codecs/jsquashWebpCodec.ts`.
- Update `codecRouter` so JPEG and WebP output prefer jSquash when supported.
- Keep Canvas as fallback when jSquash fails or is unsupported.
- Ensure React components never import jSquash packages directly.
- Ensure Worker environment can load and execute the jSquash codecs.

Phase 2 acceptance criteria:

- `npm run test` passes.
- `npm run build` passes.
- JPEG output uses jSquash when available.
- WebP output uses jSquash when available.
- Canvas fallback still works.
- No React component imports `@jsquash/*`.

## 8. Future Phases

Possible follow-up work after Phase 2:

- Add `@jsquash/png` for PNG encode/decode support.
- Add `@jsquash/oxipng` for stronger PNG optimization.
- Add `@jsquash/resize` if replacing Canvas resize is useful.
- Add target-size compression such as "compress to 100KB" or "compress to 200KB".
- Revisit AVIF once the project has a stable codec abstraction.
- Add dedicated tool pages only after the compression core is stable.

## 9. Risks

- Worker and WASM paths can break during refactor if codecs are moved too aggressively.
- Existing preview and compression paths have different behavior for SVG and GIF; these must remain compatible.
- AVIF support is capability-dependent and should not become a hard requirement.
- Adding jSquash too early increases blast radius because codec behavior and architecture would change at the same time.
- Directly copying jSquash source would increase maintenance, license, WASM path, and upgrade complexity.

## 10. Implementation Principles

- Keep Phase 1 behavior-preserving.
- Prefer adapters around existing implementations before deeper rewrites.
- Keep codec choice inside `codecRouter`.
- Keep React components focused on UI and state.
- Keep Worker messages stable unless a migration is necessary.
- Add tests for pure helpers and routing behavior before changing production code.
- Run build after each phase.

## 11. Final Recommendation

Execute the refactor in two steps:

1. Build `codecRouter`, unified compression interfaces, Worker/client boundaries, and adapters around current Canvas/WASM implementations.
2. Integrate jSquash JPEG and WebP through npm packages after the architecture is stable.

This keeps the product working while creating a clean path toward stronger codec support.
