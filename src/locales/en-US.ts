import { LocaleData } from "@/type";
import enUS from "antd/locale/en_US";

const localeData: LocaleData = {
  antLocale: enUS,
  logo: "Frog Compress",
  initial: "Initializing",
  previewHelp:
    "Drag the dividing line to compare the compression effect: the left is the original image, the right is the compressed image",
  homeContent: {
    meta: {
      title: "Frog Compress - Local Image Compression Tool",
      description:
        "Frog Compress compresses images in your browser. Images are not uploaded, privacy stays local, and files get smaller while staying clear for everyday use.",
    },
    intro: {
      eyebrow: "No upload, local processing",
      title: "Make images smaller and keep privacy on your device",
      description:
        "Frog Compress is built for everyday image cleanup. Add images, let the browser compress them locally, then compare original size, compressed size, and savings before downloading.",
    },
    features: [
      {
        title: "Safer local compression",
        description:
          "Images are processed in your browser and are not sent to a server, so personal photos, screenshots, and work files stay on your device.",
      },
      {
        title: "One-click slimming",
        description:
          "Drop images in and compression starts automatically. No account, no install, no complex settings required.",
      },
      {
        title: "Smaller but still clear",
        description:
          "The default settings reduce file size while trying to preserve the clarity needed for sharing, uploading, and viewing.",
      },
      {
        title: "Batch image workflow",
        description:
          "Add multiple images at once, download individual results, or save everything as one zip file.",
      },
    ],
    workflow: {
      eyebrow: "How it works",
      title: "Shrink images in three steps",
    },
    steps: ["Add or drop images", "Compress locally in the browser", "Download one file or a zip"],
    faqs: [
      {
        question: "Are images uploaded?",
        answer:
          "No. Frog Compress processes images locally in your browser and does not save your files.",
      },
      {
        question: "Will compressed images look blurry?",
        answer:
          "Compression can slightly change quality, but the default settings balance smaller files with clear everyday viewing.",
      },
      {
        question: "What is it useful for?",
        answer:
          "It is useful for chat sharing, form uploads, web images, document images, and reducing large local image files.",
      },
    ],
  },
  uploadCard: {
    title: "Select files here, support dragging files and folders",
    subTitle: "Open source batch image compression tool, supports %s format",
    pasteHint: "💡 Tip: You can also paste image with Ctrl+V (Cmd+V), or drag and drop images here",
  },
  listAction: {
    batchAppend: "Batch append",
    addFolder: "Add folder",
    clear: "Clear all",
    downloadAll: "Save all",
    downloadOne: "Save image",
    removeOne: "Remove image",
    reCompress: "Recompress",
  },
  columnTitle: {
    status: "Status",
    name: "Name",
    preview: "Preview",
    size: "Size",
    dimension: "Dimension",
    decrease: "Decrease",
    action: "Action",
    newSize: "New size",
    newDimension: "New Dimension",
  },
  optionPannel: {
    failTip: "Cannot be smaller, please adjust the parameters and try again.",
    help: "Frog Compress is a batch image compression application. Modifications to the options will be applied to all images.",
    resizeLable: "Resize image",
    jpegLable: "JPEG/WEBP parameters",
    pngLable: "PNG parameters",
    gifLable: "GIF parameters",
    avifLable: "AVIF parameters",
    resizePlaceholder: "Select adjustment mode",
    fitWidth: "Set width, height automatically scales",
    fitHeight: "Set height, width automatically scales",
    setShort: "Set short side, long side automatically scale",
    setLong: "Set long side, short side automatically scale",
    setCropRatio: "Crop mode, set the crop ratio",
    setCropSize: "Crop mode, set the crop size",
    cwRatioPlaceholder: "Set width ratio",
    chRatioPlaceholder: "Set height ratio",
    cwSizePlaceholder: "Set crop width",
    chSizePlaceholder: "Set crop height",
    widthPlaceholder: "Set the width of the output image",
    heightPlaceholder: "Set the height of the output image",
    shortPlaceholder: "Set short side length of the output image",
    longPlaceholder: "Set long side length of the output image",
    resetBtn: "Reset options",
    confirmBtn: "Apply options",
    qualityTitle: "Set output image quality (0-1)",
    colorsDesc: "Set the number of output colors (2-256)",
    pngDithering: "Set dithering coefficient (0-1)",
    gifDithering: "Turn on dithering",
    avifQuality: "Set output image quality (1-100)",
    avifSpeed: "Set compression speed (1-10)",
    outputFormat: "Set output format",
    outputFormatPlaceholder: "Select output image format",
    transparentFillDesc: "Choose a transparent fill color",
    cropCompareWarning: "Crop mode does not support comparison preview",
  },
  error404: {
    backHome: "Back to home",
    description: "Sorry, the page you visited does not exist~",
  },
  progress: {
    before: "Before compression",
    after: "After compression",
    rate: "Decrease ratio",
  },
};

export default localeData;
