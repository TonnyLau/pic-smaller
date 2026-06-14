import { LocaleData } from "@/type";
import frFR from "antd/locale/fr_FR";
import { getLandingContent } from "./homeComparison";

const localeData: LocaleData = {
  antLocale: frFR,
  logo: "Frog Compression",
  initial: "Initialisation",
  previewHelp:
    "Faites glisser la ligne de séparation pour comparer l'effet de compression : l'image de gauche est l'image originale, celle de droite est l'image compressée",
  homeContent: {
    meta: {
      title: "Frog Compression - Outil de compression d'images local",
      description:
        "Frog Compression compresse les images dans votre navigateur. Les images ne sont pas téléversées, la confidentialité reste locale et les fichiers deviennent plus légers.",
    },
    intro: {
      eyebrow: "Aucun téléversement, traitement local",
      title: "Réduisez vos images et gardez vos données sur votre appareil",
      description:
        "Frog Compression est conçu pour alléger les images sans réglages compliqués. Ajoutez vos images, laissez le navigateur les compresser localement, puis comparez la taille originale, la taille compressée et le gain.",
    },
    features: [
      {
        title: "Compression locale plus sûre",
        description:
          "Les images sont traitées dans votre navigateur et ne sont pas envoyées à un serveur. Photos, captures et fichiers de travail restent sur votre appareil.",
      },
      {
        title: "Allègement en un clic",
        description:
          "Déposez vos images et la compression démarre automatiquement. Aucun compte, aucune installation, aucun réglage complexe.",
      },
      {
        title: "Plus léger, toujours clair",
        description:
          "Les réglages par défaut réduisent la taille tout en essayant de conserver une netteté adaptée au partage, à l'envoi et à l'affichage.",
      },
      {
        title: "Traitement par lot",
        description:
          "Ajoutez plusieurs images à la fois, téléchargez chaque résultat ou enregistrez tout dans un fichier zip.",
      },
    ],
    ...getLandingContent("fr-FR"),
    workflow: {
      eyebrow: "Comment ça marche",
      title: "Compressez vos images en trois étapes",
    },
    steps: [
      "Ajoutez ou déposez des images",
      "Compression locale dans le navigateur",
      "Téléchargez une image ou un zip",
    ],
    faqs: [
      {
        question: "Les images sont-elles téléversées ?",
        answer:
          "Non. Frog Compression traite les images localement dans votre navigateur et ne conserve pas vos fichiers.",
      },
      {
        question: "L'image sera-t-elle floue ?",
        answer:
          "La compression peut légèrement modifier la qualité, mais les réglages par défaut équilibrent taille réduite et clarté pour un usage quotidien.",
      },
      {
        question: "À quoi cela sert-il ?",
        answer:
          "C'est utile pour les messages, les formulaires, les images web, les documents et la réduction de gros fichiers locaux.",
      },
    ],
  },
  uploadCard: {
    title: "Déposez vos images ici",
    subTitle: "Formats supportés : %s",
    pasteHint: "💡 Collez avec Ctrl+V ou glissez vos images ici",
  },
  listAction: {
    batchAppend: "Ajouter des fichiers",
    addFolder: "Ajouter dossier",
    clear: "Tout retirer",
    downloadAll: "Tout sauvegarder",
    downloadOne: "Sauvegarder l'image",
    removeOne: "Retirer l'image",
    reCompress: "Relancer compression",
  },
  columnTitle: {
    status: "Status",
    name: "Nom",
    preview: "Aperçu",
    size: "Taille",
    dimension: "Dimensions",
    decrease: "Réduction",
    action: "Action",
    newSize: "Nouvelle taille",
    newDimension: "Nouvelles dimensions",
  },
  optionPannel: {
    failTip:
      "Impossible de réduire la taille, veuillez ajuster les paramètres et réessayer.",
    help: "Frog Compression est une application de compression d'images par lot. Les modifications apportées aux options seront appliquées à toutes les images.",
    resizeLable: "Redimensionner l'image",
    jpegLable: "Paramètres JPEG/WEBP",
    pngLable: "Paramètres PNG",
    gifLable: "Paramètres GIF",
    avifLable: "Paramètres AVIF",
    resizePlaceholder: "Sélectionner le mode d'ajustement",
    fitWidth: "Régler la largeur, la hauteur s'ajuste automatiquement",
    fitHeight: "Régler la hauteur, la largeur s'ajuste automatiquement",
    setShort: "Régler le petit côté, le long côté s'ajuste automatiquement",
    setLong: "Régler le long côté, le petit côté s'ajuste automatiquement",
    setCropRatio: "Mode de recadrage, définir le rapport de recadrage",
    setCropSize: "Mode recadrage, définir la taille du recadrage",
    cwRatioPlaceholder: "Définir le rapport de largeur",
    chRatioPlaceholder: "Définir le rapport de hauteur",
    cwSizePlaceholder: "Définir la largeur du recadrage",
    chSizePlaceholder: "Définir la hauteur de recadrage",
    widthPlaceholder: "Largeur de l'image de sortie",
    heightPlaceholder: "Hauteur de l'image de sortie",
    shortPlaceholder: "Longueur du petit côté de l'image de sortie",
    longPlaceholder: "Longueur du côté long de l'image de sortie",
    resetBtn: "Réinitialiser",
    confirmBtn: "Appliquer",
    qualityTitle: "Qualité de l'image de sortie (0-1)",
    colorsDesc: "Nombre de couleurs de sortie (2-256)",
    pngDithering: "Coefficient de tramage (0-1)",
    gifDithering: "Activer le tramage",
    avifQuality: "Qualité de l'image de sortie (1-100)",
    avifSpeed: "Vitesse de compression (1-10)",
    outputFormat: "Format de sortie",
    outputFormatPlaceholder: "Format de l'image de sortie",
    transparentFillDesc: "Couleur de remplissage transparente",
    cropCompareWarning:
      "Le mode Recadrage ne prend pas en charge l'aperçu de comparaison",
  },
  error404: {
    backHome: "Retour à l'accueil",
    description: "Désolé, la page que vous avez visitée n'existe pas~",
  },
  progress: {
    before: "Avant compression",
    after: "Après compression",
    rate: "Taux de diminution",
  },
};

export default localeData;
