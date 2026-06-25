import type { LocaleData } from "@/type";

export type SeoPageSlug =
  | "image-compressor"
  | "jpg-size-reducer"
  | "tiny-png-alternative"
  | "compressor-io-alternative";

type HomeContent = LocaleData["homeContent"];

type SeoPage = {
  slug: SeoPageSlug;
  title: string;
  description: string;
  intro: HomeContent["intro"];
  comparisonDescription: string;
  workflowTitle: string;
  faqs: HomeContent["faqs"];
};

export const seoPages: Record<SeoPageSlug, SeoPage> = {
  "image-compressor": {
    slug: "image-compressor",
    title: "Image Compressor - Private Browser Image Compression",
    description:
      "Use Frog Compress as a private image compressor for JPG, PNG, WebP, GIF, SVG, and AVIF files. Compress images locally, compare results, and download smaller files.",
    intro: {
      eyebrow: "Private image compressor",
      title: "Compress images locally without an upload queue",
      description:
        "This image compressor keeps the work in your browser, so screenshots, product images, and personal photos can be reduced before sharing or uploading. Add files, review the original and compressed sizes, then save the smaller results.",
    },
    comparisonDescription:
      "Frog Compress works as a local image compressor with batch handling, resize controls, and ZIP export. TinyPNG and Compressor.io are familiar online compressors, but they use public upload flows and different plan limits.",
    workflowTitle: "Use the image compressor in three steps",
    faqs: [
      {
        question: "Is this image compressor online or local?",
        answer:
          "The app runs in the browser and processes supported image files locally. Your images are not sent to a server by Frog Compress.",
      },
      {
        question: "Can it compress JPG and PNG files together?",
        answer:
          "Yes. You can add JPG, PNG, WebP, GIF, SVG, and AVIF files in one batch, then download individual images or one ZIP archive.",
      },
      {
        question: "How is it different from TinyPNG or Compressor.io?",
        answer:
          "Those tools are strong online compressors. Frog Compress is focused on local privacy, batch work, format conversion, and quick before-and-after comparison.",
      },
    ],
  },
  "jpg-size-reducer": {
    slug: "jpg-size-reducer",
    title: "JPG Size Reducer - Make JPEG Images Smaller Locally",
    description:
      "Reduce JPG size in your browser with Frog Compress. Resize, adjust JPEG quality, compare before and after, and keep image compression private.",
    intro: {
      eyebrow: "JPG size reducer",
      title: "Make JPG files smaller before you upload or share",
      description:
        "Use Frog Compress as a JPG size reducer when a form, marketplace, email, or CMS rejects large photos. The browser handles compression locally, and you can compare the result before downloading.",
    },
    comparisonDescription:
      "For JPG size reduction, Frog Compress combines local compression, resize options, and visual comparison. TinyPNG and Compressor.io can also reduce images online, but Frog Compress avoids sending your JPG files away from the browser.",
    workflowTitle: "Reduce JPG size in three steps",
    faqs: [
      {
        question: "Will the JPG look blurry after size reduction?",
        answer:
          "Quality can change with any JPG compression. Frog Compress uses practical defaults and lets you compare the compressed image before saving it.",
      },
      {
        question: "Can I resize a JPG as well as compress it?",
        answer:
          "Yes. You can reduce file size with JPEG quality settings and resize dimensions when the image is larger than needed.",
      },
      {
        question: "Does the JPG size reducer upload my photos?",
        answer:
          "No. Compression runs locally in the browser, so private photos and work images stay on your device.",
      },
    ],
  },
  "tiny-png-alternative": {
    slug: "tiny-png-alternative",
    title: "TinyPNG Alternative - Local Batch Image Compression",
    description:
      "Compare Frog Compress as a TinyPNG alternative for private local compression, batch image workflows, resize controls, format conversion, and ZIP download.",
    intro: {
      eyebrow: "TinyPNG alternative",
      title: "A local image workflow when TinyPNG-style compression is not enough",
      description:
        "TinyPNG is popular for quick PNG and JPG compression. Frog Compress takes a different route: files stay in the browser, batches can include folders, and resize or format controls sit next to the compression step.",
    },
    comparisonDescription:
      "Frog Compress is not a clone of TinyPNG or tiny png workflows. It is a private browser-based image compressor for people who want batch compression, output controls, and a local review step before download.",
    workflowTitle: "Compress a batch without leaving the browser",
    faqs: [
      {
        question: "Why use Frog Compress instead of TinyPNG?",
        answer:
          "Use Frog Compress when local privacy, folder drag-and-drop, batch ZIP download, resize controls, or output format conversion matter more than a simple upload page.",
      },
      {
        question: "Does it work for PNG and JPG?",
        answer:
          "Yes. Frog Compress supports common web image formats including PNG, JPG, WebP, GIF, SVG, and AVIF.",
      },
      {
        question: "Is there a daily upload limit?",
        answer:
          "Frog Compress runs in your browser and does not use a hosted upload queue, so the practical limit is your device and browser memory.",
      },
    ],
  },
  "compressor-io-alternative": {
    slug: "compressor-io-alternative",
    title: "Compressor.io Alternative - Private Image Compression",
    description:
      "Use Frog Compress as a Compressor.io alternative when you need local image compression, batch handling, before-and-after comparison, and no server upload.",
    intro: {
      eyebrow: "Compressor.io alternative",
      title: "Compress images privately with browser-side controls",
      description:
        "Compressor.io is a known online compressor. Frog Compress is designed for a more private workflow: add images, compress them locally, compare the result, and download one file or a ZIP archive.",
    },
    comparisonDescription:
      "Compared with Compressor.io or compressor io searches, Frog Compress emphasizes local processing, batch image compression, resize and crop controls, and a clear before-and-after review before saving.",
    workflowTitle: "Compress and compare in three steps",
    faqs: [
      {
        question: "Is Frog Compress a Compressor.io replacement?",
        answer:
          "It can be an alternative when you want local browser compression, batch handling, and no server upload for supported image formats.",
      },
      {
        question: "Can I compare image quality after compression?",
        answer:
          "Yes. Frog Compress includes before-and-after comparison so you can check whether the smaller file still looks acceptable.",
      },
      {
        question: "Does it support batch image compression?",
        answer:
          "Yes. You can add multiple files or folders, compress them together, and download results one by one or as a ZIP.",
      },
    ],
  },
};

export const seoPageSlugs = Object.keys(seoPages) as SeoPageSlug[];
export const siteUrl = "https://compresspic.top";

export function getSeoPageSlug(pathname: string): SeoPageSlug | null {
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return seoPageSlugs.includes(slug as SeoPageSlug)
    ? (slug as SeoPageSlug)
    : null;
}

export function getCanonicalPath(slug: SeoPageSlug | null): string {
  return slug ? `/${slug}/` : "/";
}

export function getCanonicalUrl(slug: SeoPageSlug | null): string {
  return `${siteUrl}${getCanonicalPath(slug)}`;
}

export function applySeoPageContent(
  content: HomeContent,
  slug: SeoPageSlug | null,
): HomeContent {
  if (!slug) return content;
  const page = seoPages[slug];

  return {
    ...content,
    meta: {
      title: page.title,
      description: page.description,
    },
    intro: page.intro,
    comparison: {
      ...content.comparison,
      description: page.comparisonDescription,
    },
    workflow: {
      ...content.workflow,
      title: page.workflowTitle,
    },
    faqs: page.faqs,
  };
}
