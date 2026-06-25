import { LocaleData } from "@/type";

type LandingLocale = "en-US" | "es-ES" | "fa-IR" | "fr-FR" | "ja-JP" | "ko-KR" | "tr-TR" | "zh-CN" | "zh-TW";

const companies = ["Airbnb", "Spotify", "Netflix", "Uber", "Dropbox", "Slack"];

const supportRows = [
  { frog: true, tinyPng: false, compressor: false },
  { frog: true, tinyPng: true, compressor: true },
  { frog: true, tinyPng: true, compressor: false },
  { frog: true, tinyPng: false, compressor: false },
  { frog: true, tinyPng: true, compressor: true },
  { frog: true, tinyPng: false, compressor: false },
];

const landingCopy: Record<
  LandingLocale,
  {
    trust: {
      title: string;
      description: string;
    };
    comparison: {
      title: string;
      description: string;
      columns: [string, string, string, string];
      notes?: string[];
      switchTitle?: string;
      switchDescription?: string;
      switchRows?: Array<{
        factor: string;
        tinyPng: string;
        compressor: string;
        frog: string;
      }>;
      features: [string, string, string, string, string, string];
    };
  }
> = {
  "en-US": {
    trust: {
      title: "Built for modern image workflows",
      description:
        "These text-only brand tiles represent the kind of product, content, and operations teams that often need fast image prep. They are not customer claims or endorsements.",
    },
    comparison: {
      title: "Frog Compress vs TinyPNG and Compressor.io",
      description:
        "Frog Compress focuses on local browser processing, batch handling, and practical finishing controls for image compressor and JPG size reducer workflows. TinyPNG, tiny png searches, and Compressor.io all point to useful online tools, but their upload model is different.",
      columns: ["Feature", "Frog Compress", "TinyPNG", "Compressor.io"],
      switchTitle: "Why switch from TinyPNG or Compressor.io?",
      switchDescription:
        "The main difference is not a claim that one compressor is always better. Frog Compress is built for cases where privacy, local review, and batch finishing controls matter before you upload images anywhere else.",
      switchRows: [
        {
          factor: "Where images are processed",
          tinyPng: "Uploaded to an online service",
          compressor: "Uploaded to an online service",
          frog: "Processed locally in your browser",
        },
        {
          factor: "JPG size reducer workflow",
          tinyPng: "Quick compression for common uploads",
          compressor: "Online compression with quality choices",
          frog: "Compress, resize, compare, then download",
        },
        {
          factor: "Batch and folder handling",
          tinyPng: "Batch upload workflow",
          compressor: "Batch workflow depends on plan and limits",
          frog: "Drag files or folders, then save one ZIP",
        },
        {
          factor: "Output controls",
          tinyPng: "Focused on compression",
          compressor: "Compression-focused controls",
          frog: "Resize, crop, convert format, and adjust quality",
        },
      ],
      notes: [
        "Notes: this comparison focuses on common browser image compression workflows, not every paid plan or account feature.",
        "Use the online tools when an upload service fits your workflow. Use Frog Compress when you want a local image compressor before sharing, publishing, or sending files.",
      ],
      features: [
        "Local/private processing",
        "Batch workflow",
        "Folder/drag-drop support",
        "Resize/crop controls",
        "Output format conversion",
        "ZIP download",
      ],
    },
  },
  "es-ES": {
    trust: {
      title: "Pensado para flujos modernos de imagen",
      description:
        "Estas tarjetas de texto representan equipos de producto, contenido y operaciones que suelen necesitar preparación rápida de imágenes. No son afirmaciones de clientes ni respaldos.",
    },
    comparison: {
      title: "Cómo se compara Frog Compress",
      description:
        "Frog Compress se centra en el procesamiento local en el navegador, el trabajo por lotes y controles prácticos de acabado. TinyPNG y Compressor.io son herramientas online sólidas, pero sus flujos públicos y límites de plan difieren.",
      columns: ["Función", "Frog Compress", "TinyPNG", "Compressor.io"],
      features: [
        "Procesamiento local/privado",
        "Flujo por lotes",
        "Soporte de carpetas y arrastrar/soltar",
        "Controles de redimensionado/recorte",
        "Conversión de formato de salida",
        "Descarga ZIP",
      ],
    },
  },
  "fa-IR": {
    trust: {
      title: "برای گردش‌کارهای مدرن تصویر ساخته شده",
      description:
        "این کارت‌های متنی نمایانگر تیم‌های محصول، محتوا و عملیات هستند که معمولاً به آماده‌سازی سریع تصویر نیاز دارند. این‌ها ادعای مشتری یا تأییدیه نیستند.",
    },
    comparison: {
      title: "مقایسه Frog Compress",
      description:
        "Frog Compress بر پردازش محلی در مرورگر، کار دسته‌ای و کنترل‌های کاربردی نهایی‌سازی تمرکز دارد. TinyPNG و Compressor.io ابزارهای آنلاین قدرتمندی هستند، اما جریان آپلود عمومی و محدودیت‌های پلن آن‌ها متفاوت است.",
      columns: ["ویژگی", "Frog Compress", "TinyPNG", "Compressor.io"],
      features: [
        "پردازش محلی/خصوصی",
        "گردش‌کار دسته‌ای",
        "پشتیبانی از پوشه و drag-and-drop",
        "کنترل تغییر اندازه/برش",
        "تبدیل فرمت خروجی",
        "دانلود ZIP",
      ],
    },
  },
  "fr-FR": {
    trust: {
      title: "Conçu pour les flux image modernes",
      description:
        "Ces vignettes textuelles représentent des équipes produit, contenu et opérations qui ont souvent besoin de préparer des images rapidement. Ce ne sont ni des clients ni des recommandations.",
    },
    comparison: {
      title: "Comparaison de Frog Compress",
      description:
        "Frog Compress se concentre sur le traitement local dans le navigateur, le traitement par lot et des contrôles de finition pratiques. TinyPNG et Compressor.io sont de solides outils en ligne, mais leurs flux publics et leurs limites de plan diffèrent.",
      columns: ["Fonction", "Frog Compress", "TinyPNG", "Compressor.io"],
      features: [
        "Traitement local/privé",
        "Flux par lot",
        "Prise en charge des dossiers et du glisser-déposer",
        "Contrôles de redimensionnement/recadrage",
        "Conversion du format de sortie",
        "Téléchargement ZIP",
      ],
    },
  },
  "ja-JP": {
    trust: {
      title: "現代的な画像ワークフロー向け",
      description:
        "このテキストのみのブランドタイルは、素早い画像準備を必要とするプロダクト、コンテンツ、運用チームを表しています。顧客実績や推奨を示すものではありません。",
    },
    comparison: {
      title: "Frog Compress の比較",
      description:
        "Frog Compress は、ブラウザ内のローカル処理、バッチ対応、実用的な仕上げコントロールに重点を置いています。TinyPNG と Compressor.io は強力なオンラインツールですが、公開されたアップロードフローとプラン制限は異なります。",
      columns: ["機能", "Frog Compress", "TinyPNG", "Compressor.io"],
      features: [
        "ローカル/非公開処理",
        "バッチ処理",
        "フォルダ・ドラッグ&ドロップ対応",
        "リサイズ/切り抜き制御",
        "出力形式変換",
        "ZIP ダウンロード",
      ],
    },
  },
  "ko-KR": {
    trust: {
      title: "현대적인 이미지 워크플로를 위해",
      description:
        "이 텍스트형 브랜드 타일은 빠른 이미지 준비가 필요한 제품, 콘텐츠, 운영 팀을 나타냅니다. 고객사나 보증을 의미하지는 않습니다.",
    },
    comparison: {
      title: "Frog Compress 비교",
      description:
        "Frog Compress는 브라우저 내 로컬 처리, 일괄 작업, 실용적인 마무리 제어에 집중합니다. TinyPNG와 Compressor.io는 강력한 온라인 도구지만, 공개된 업로드 흐름과 요금제 제한은 다릅니다.",
      columns: ["기능", "Frog Compress", "TinyPNG", "Compressor.io"],
      features: [
        "로컬/비공개 처리",
        "일괄 작업",
        "폴더 및 드래그 앤 드롭 지원",
        "리사이즈/크롭 제어",
        "출력 형식 변환",
        "ZIP 다운로드",
      ],
    },
  },
  "tr-TR": {
    trust: {
      title: "Modern görsel iş akışları için",
      description:
        "Bu metin tabanlı marka kutuları, hızlı görsel hazırlığına ihtiyaç duyan ürün, içerik ve operasyon ekiplerini temsil eder. Müşteri iddiası ya da onay anlamına gelmez.",
    },
    comparison: {
      title: "Frog Compress karşılaştırması",
      description:
        "Frog Compress, tarayıcı içinde yerel işleme, toplu çalışmaya ve pratik sonlandırma kontrollerine odaklanır. TinyPNG ve Compressor.io güçlü çevrimiçi araçlardır, ancak herkese açık yükleme akışları ve plan sınırları farklıdır.",
      columns: ["Özellik", "Frog Compress", "TinyPNG", "Compressor.io"],
      features: [
        "Yerel/gizli işleme",
        "Toplu iş akışı",
        "Klasör ve sürükle-bırak desteği",
        "Yeniden boyutlandırma/kırpma kontrolleri",
        "Çıktı formatı dönüştürme",
        "ZIP indirme",
      ],
    },
  },
  "zh-CN": {
    trust: {
      title: "面向现代图片工作流",
      description:
        "这些纯文本品牌块代表的是经常需要快速处理图片的产品、内容和运营团队，不是客户背书，也不是合作声明。",
    },
    comparison: {
      title: "青蛙压缩怎么比",
      description:
        "青蛙压缩更强调浏览器本地处理、批量工作流和实用的收尾控制。TinyPNG 和 Compressor.io 都是很强的在线工具，但它们公开的上传流程和套餐限制不同。",
      columns: ["功能", "青蛙压缩", "TinyPNG", "Compressor.io"],
      features: [
        "本地/私密处理",
        "批量工作流",
        "支持文件夹和拖拽",
        "缩放/裁剪控制",
        "输出格式转换",
        "ZIP 打包下载",
      ],
    },
  },
  "zh-TW": {
    trust: {
      title: "面向現代圖片工作流程",
      description:
        "這些純文字品牌區塊代表的是經常需要快速處理圖片的產品、內容與營運團隊，不是客戶背書，也不是合作宣稱。",
    },
    comparison: {
      title: "青蛙壓縮怎麼比",
      description:
        "青蛙壓縮更強調瀏覽器本地處理、批次工作流程與實用的收尾控制。TinyPNG 和 Compressor.io 都是很強的線上工具，但它們公開的上傳流程與方案限制不同。",
      columns: ["功能", "青蛙壓縮", "TinyPNG", "Compressor.io"],
      features: [
        "本機/私密處理",
        "批次工作流程",
        "支援資料夾與拖放",
        "縮放/裁切控制",
        "輸出格式轉換",
        "ZIP 打包下載",
      ],
    },
  },
};

export function getLandingContent(locale: LandingLocale) {
  const copy = landingCopy[locale] ?? landingCopy["en-US"];

  return {
    trust: {
      title: copy.trust.title,
      description: copy.trust.description,
      companies,
    },
    comparison: {
      title: copy.comparison.title,
      description: copy.comparison.description,
      columns: copy.comparison.columns,
      notes: copy.comparison.notes,
      rows: copy.comparison.features.map((feature, index) => ({
        feature,
        ...supportRows[index],
      })),
    },
  } satisfies Pick<LocaleData["homeContent"], "trust" | "comparison">;
}
