import { LocaleData } from "@/type";
import trTR from "antd/locale/tr_TR";
import { getLandingContent } from "./homeComparison";

const localeData: LocaleData = {
  antLocale: trTR,
  logo: "Frog Sıkıştırma",
  initial: "Başlatılıyor",
  previewHelp:
    "Sıkıştırma etkisini karşılaştırmak için bölme çizgisini sürükleyin: soldaki orijinal görüntü, sağdaki sıkıştırılmış görüntü",
  homeContent: {
    meta: {
      title: "Frog Sıkıştırma - Yerel Görsel Sıkıştırma Aracı",
      description:
        "Frog Sıkıştırma görselleri tarayıcınızda sıkıştırır. Görseller yüklenmez, gizlilik cihazınızda kalır ve dosyalar günlük kullanım için net kalacak şekilde küçülür.",
    },
    intro: {
      eyebrow: "Yükleme yok, yerel işlem",
      title: "Görselleri küçültün, gizliliği cihazınızda tutun",
      description:
        "Frog Sıkıştırma karmaşık ayarlar olmadan görselleri hafifletmek için tasarlandı. Görselleri ekleyin, tarayıcıda yerel olarak sıkıştırın, ardından özgün boyut, yeni boyut ve tasarrufu karşılaştırın.",
    },
    features: [
      {
        title: "Daha güvenli yerel sıkıştırma",
        description:
          "Görseller tarayıcınızda işlenir ve sunucuya gönderilmez; fotoğraflar, ekran görüntüleri ve iş dosyaları cihazınızda kalır.",
      },
      {
        title: "Tek tıkla küçültme",
        description:
          "Görselleri bırakın, sıkıştırma otomatik başlasın. Hesap, kurulum veya karmaşık ayar gerekmez.",
      },
      {
        title: "Daha küçük ama net",
        description:
          "Varsayılan ayarlar dosya boyutunu azaltırken paylaşım, yükleme ve görüntüleme için gereken netliği korumaya çalışır.",
      },
      {
        title: "Toplu görsel işleme",
        description:
          "Birden fazla görsel ekleyin, tek tek indirin veya tüm sonuçları zip olarak kaydedin.",
      },
    ],
    ...getLandingContent("tr-TR"),
    workflow: {
      eyebrow: "Nasıl çalışır",
      title: "Görselleri üç adımda küçültün",
    },
    steps: [
      "Görselleri ekleyin veya bırakın",
      "Tarayıcıda yerel olarak sıkıştırın",
      "Tek dosya veya zip indirin",
    ],
    faqs: [
      {
        question: "Görseller yükleniyor mu?",
        answer:
          "Hayır. Frog Sıkıştırma görselleri tarayıcınızda yerel olarak işler ve dosyalarınızı kaydetmez.",
      },
      {
        question: "Sıkıştırma görseli bulanık yapar mı?",
        answer:
          "Sıkıştırma kaliteyi biraz değiştirebilir, ancak varsayılan ayarlar küçük dosya ve günlük kullanım netliği arasında denge kurar.",
      },
      {
        question: "Hangi durumlarda kullanılır?",
        answer:
          "Sohbet paylaşımı, form yükleme, web görselleri, belge görselleri ve büyük yerel dosyaları küçültmek için uygundur.",
      },
    ],
  },
  uploadCard: {
    title: "Resimlerinizi buraya bırakın",
    subTitle: "Desteklenen formatlar: %s",
    pasteHint: "💡 Ctrl+V ile yapıştırın veya resimleri sürükleyin",
  },
  listAction: {
    batchAppend: "Toplu ekle",
    addFolder: "Klasör ekle",
    clear: "Hepsini temizle",
    downloadAll: "Hepsini İndir",
    downloadOne: "İndir",
    removeOne: "Sil",
    reCompress: "Yeniden sıkıştır",
  },
  columnTitle: {
    status: "Durum",
    name: "İsim",
    preview: "Önizleme",
    size: "Boyut",
    dimension: "Boyut",
    decrease: "Sıkıştır",
    action: "Eylem",
    newSize: "Yeni boyut",
    newDimension: "Yeni boyutlar",
  },
  optionPannel: {
    failTip:
      "Daha küçük olamaz, lütfen parametreleri ayarlayın ve tekrar deneyin.",
    help: "Frog Sıkıştırma, toplu resim sıkıştırma uygulamasıdır. Seçeneklerde yapılan değişiklikler tüm resimlere uygulanacaktır.",
    resizeLable: "Görüntüyü yeniden boyutlandır",
    jpegLable: "JPEG/WEBP parametreleri",
    pngLable: "PNG parametreleri",
    gifLable: "GIF parametreleri",
    avifLable: "AVIF parametreleri",
    resizePlaceholder: "Ayarlama modunu seçin",
    fitWidth: "Genişliği ayarla, yükseklik otomatik ayarlanır",
    fitHeight: "Yüksekliği ayarla, genişlik otomatik ayarlanır",
    setShort: "Kısa kenarı ayarla, uzun kenar otomatik ayarlanır",
    setLong: "Uzun kenarı ayarla, kısa kenar otomatik ayarlanır",
    setCropRatio: "Kırpma modu, kırpma oranını ayarlayın",
    setCropSize: "Kırpma modu, kırpma boyutunu ayarla",
    cwRatioPlaceholder: "Genişlik oranını ayarla",
    chRatioPlaceholder: "Yükseklik oranını ayarla",
    cwSizePlaceholder: "Kırpma genişliğini ayarla",
    chSizePlaceholder: "Kırpma yüksekliğini ayarla",
    widthPlaceholder: "Çıktının genişliğini ayarlayın",
    heightPlaceholder: "Çıktının yüksekliğini ayarlayın",
    shortPlaceholder: "Çıktının kısa kenar uzunluğunu ayarlayın",
    longPlaceholder: "Çıktının uzun kenar uzunluğunu ayarlayın",
    resetBtn: "Seçenekleri sıfırla",
    confirmBtn: "Seçenekleri uygula",
    qualityTitle: "Çıktının kalitesini ayarla (0-1)",
    colorsDesc: "Çıktınun renk sayısını ayarla (2-256)",
    pngDithering: "Dithering katsayısını ayarla (0-1)",
    gifDithering: "Dithering'i aç",
    avifQuality: "Çıktının kalitesini ayarla (1-100)",
    avifSpeed: "Sıkıştırma hızını ayarla (1-10)",
    outputFormat: "Çıktı formatını ayarla",
    outputFormatPlaceholder: "Çıktı formatını seçin",
    transparentFillDesc: "Şeffaflık rengini seçin",
    cropCompareWarning: "Kırpma modu karşılaştırma önizlemesini desteklemiyor",
  },
  error404: {
    backHome: "Ana sayfaya dön",
    description: "Üzgünüz, ziyaret ettiğiniz sayfa mevcut değil~",
  },
  progress: {
    before: "Sıkıştırmadan önce",
    after: "Sıkıştırmadan sonra",
    rate: "Sıkıştırma oranı",
  },
};

export default localeData;
