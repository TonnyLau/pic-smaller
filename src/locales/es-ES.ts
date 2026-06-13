import { LocaleData } from "@/type";
import esES from "antd/locale/es_ES";

const localeData: LocaleData = {
  antLocale: esES,
  logo: "Frog Compresor",
  initial: "Inicializando",
  previewHelp:
    "Arrastra la línea divisoria para comparar el efecto de compresión: a la izquierda es la imagen original, a la derecha es la imagen comprimida",
  homeContent: {
    meta: {
      title: "Frog Compresor - Compresor de imágenes local",
      description:
        "Frog Compresor comprime imágenes en el navegador. Las imágenes no se suben, la privacidad queda en tu dispositivo y los archivos se reducen manteniendo buena claridad.",
    },
    intro: {
      eyebrow: "Sin subida, procesamiento local",
      title: "Reduce tus imágenes y mantén la privacidad en tu dispositivo",
      description:
        "Frog Compresor está pensado para usuarios que necesitan imágenes más ligeras sin pasos complicados. Añade imágenes, comprímelas localmente y revisa tamaño original, tamaño final y ahorro antes de descargar.",
    },
    features: [
      {
        title: "Compresión local más segura",
        description:
          "Las imágenes se procesan en tu navegador y no se envían a un servidor, por lo que fotos, capturas y archivos de trabajo permanecen en tu dispositivo.",
      },
      {
        title: "Reducción con un clic",
        description:
          "Suelta imágenes y la compresión comienza automáticamente. No necesitas cuenta, instalación ni ajustes complejos.",
      },
      {
        title: "Menos peso, buena claridad",
        description:
          "Los ajustes predeterminados reducen el tamaño intentando conservar la claridad necesaria para compartir, subir y ver imágenes.",
      },
      {
        title: "Procesamiento por lotes",
        description:
          "Añade varias imágenes a la vez, descarga resultados individuales o guarda todo en un archivo zip.",
      },
    ],
    workflow: {
      eyebrow: "Cómo funciona",
      title: "Comprime imágenes en tres pasos",
    },
    steps: [
      "Añade o arrastra imágenes",
      "Comprime localmente en el navegador",
      "Descarga una imagen o un zip",
    ],
    faqs: [
      {
        question: "¿Se suben las imágenes?",
        answer:
          "No. Frog Compresor procesa las imágenes localmente en tu navegador y no guarda tus archivos.",
      },
      {
        question: "¿La imagen se verá borrosa?",
        answer:
          "La compresión puede cambiar ligeramente la calidad, pero los valores predeterminados equilibran menor tamaño y claridad para uso diario.",
      },
      {
        question: "¿Para qué sirve?",
        answer:
          "Sirve para enviar por chat, subir formularios, preparar imágenes web, reducir documentos y ordenar archivos grandes.",
      },
    ],
  },
  uploadCard: {
    title: "Selecciona o arrastra tus imágenes aquí",
    subTitle: "Formatos soportados: %s",
    pasteHint: "💡 Pega con Ctrl+V o arrastra imágenes aquí",
  },
  listAction: {
    batchAppend: "Añadir imagenes",
    addFolder: "Añadir carpeta",
    clear: "Eliminar todas",
    downloadAll: "Guardar todas",
    downloadOne: "Guardar imagen",
    removeOne: "Eliminar imagen",
    reCompress: "Recomprimir",
  },
  columnTitle: {
    status: "Estado",
    name: "Nombre",
    preview: "Miniatura",
    size: "Tamaño",
    dimension: "Resolución",
    decrease: "Compresión",
    action: "Acciones",
    newSize: "Nuevo tamaño",
    newDimension: "Nueva resolución",
  },
  optionPannel: {
    failTip:
      "Imposible de reducir más el tamaño, por favor ajusta los parámetros e inténtalo de nuevo.",
    help: "Frog Compresor es una aplicación de compresión de imágenes por lotes. Las modificaciones se aplicarán a todas las imágenes.",
    resizeLable: "Cambia el tamaño de la imagen",
    jpegLable: "Parámetros JPEG/WEBP",
    pngLable: "Parámetros PNG",
    gifLable: "Parámetros GIF",
    avifLable: "Parámetros AVIF",
    resizePlaceholder: "Selecciona el ajuste de tamaño",
    fitWidth: "Ajusta la anchura, la altura se escala automáticamente",
    fitHeight: "Ajusta la altura, la anchura se escala automáticamente",
    setShort:
      "Ajusta el lado más corto, el lado más largo se adaptará automáticamente",
    setLong:
      "Ajusta el lado más largo, el lado más corto se adaptará automáticamente",
    setCropRatio: "Modo de recorte, establecer proporción de recorte",
    setCropSize: "Modo de recorte, establecer tamaño de recorte",
    cwRatioPlaceholder: "Establecer relación de ancho",
    chRatioPlaceholder: "Establecer relación de altura",
    cwSizePlaceholder: "Establecer ancho de recorte",
    chSizePlaceholder: "Establecer altura de recorte",
    widthPlaceholder: "Ajusta la anchura de la imagen",
    heightPlaceholder: "Ajusta la altura de la imagen",
    shortPlaceholder: "Ajusta el lado mas corto de la imagen",
    longPlaceholder: "Ajusta el lado mas largo de la imagen",
    resetBtn: "Reiniciar ajustes",
    confirmBtn: "Aplicar ajustes",
    qualityTitle: "Calidad de imagen (0-1)",
    colorsDesc: "Número de colores de salida (2-256)",
    pngDithering: "Coeficiente de difuminado (0-1)",
    gifDithering: "Difuminado",
    avifQuality: "Calidad de imagen (1-100)",
    avifSpeed: "Velocidad de compresión (1-10)",
    outputFormat: "Formato de fichero",
    outputFormatPlaceholder: "Selecciona el formato de imagen",
    transparentFillDesc: "Elige un color de relleno transparente",
    cropCompareWarning:
      "El modo de recorte no admite la vista previa de comparación",
  },
  error404: {
    backHome: "Volver al inicio",
    description: "Lo siento, la página visitada no existe~",
  },
  progress: {
    before: "Antes de comprimir",
    after: "Después de comprimir",
    rate: "Índice de compresión",
  },
};

export default localeData;
