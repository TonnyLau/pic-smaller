// 日语

import { LocaleData } from "@/type";
import jaJP from "antd/locale/ja_JP";
import { getLandingContent } from "./homeComparison";

const localeData: LocaleData = {
  antLocale: jaJP,
  logo: "Frog圧縮",
  initial: "初期化中",
  previewHelp:
    "分割線をドラッグして圧縮効果を比較します。左が元の画像、右が圧縮された画像です",
  homeContent: {
    meta: {
      title: "Frog圧縮 - ローカル画像圧縮ツール",
      description:
        "Frog圧縮 はブラウザ内で画像を圧縮します。画像はアップロードされず、プライバシーを保ちながら、日常利用に十分な見やすさでファイルを小さくします。",
    },
    intro: {
      eyebrow: "アップロードなし、ローカル処理",
      title: "画像を小さくし、プライバシーは端末に残す",
      description:
        "Frog圧縮 は、複雑な設定なしで画像を軽くしたい人向けのツールです。画像を追加するとブラウザ内で圧縮し、元サイズ、圧縮後サイズ、削減率を確認してからダウンロードできます。",
    },
    features: [
      {
        title: "より安心なローカル圧縮",
        description:
          "画像はブラウザ内で処理され、サーバーへ送信されません。写真、スクリーンショット、仕事用の画像を端末内に保てます。",
      },
      {
        title: "ワンクリックで軽量化",
        description:
          "画像をドロップすると自動で圧縮が始まります。アカウント登録、インストール、複雑な設定は不要です。",
      },
      {
        title: "小さくても見やすく",
        description:
          "既定設定では、共有、アップロード、閲覧に必要な見やすさを保ちながらファイルサイズを減らします。",
      },
      {
        title: "複数画像をまとめて処理",
        description:
          "複数の画像を一度に追加し、個別にダウンロードすることも、zip でまとめて保存することもできます。",
      },
    ],
    ...getLandingContent("ja-JP"),
    workflow: {
      eyebrow: "使い方",
      title: "3ステップで画像を軽量化",
    },
    steps: [
      "画像を追加またはドロップ",
      "ブラウザ内でローカル圧縮",
      "単体または zip でダウンロード",
    ],
    faqs: [
      {
        question: "画像はアップロードされますか？",
        answer:
          "いいえ。Frog圧縮 は画像をブラウザ内でローカル処理し、ファイルを保存しません。",
      },
      {
        question: "圧縮後にぼやけますか？",
        answer:
          "圧縮により品質が少し変わる場合がありますが、既定設定では小さなサイズと日常利用の見やすさのバランスを取ります。",
      },
      {
        question: "どんな用途に向いていますか？",
        answer:
          "チャット送信、フォーム投稿、Web画像、文書内画像、大きなローカル画像の整理に向いています。",
      },
    ],
  },
  uploadCard: {
    title: "画像をドラッグまたは選択",
    subTitle: "対応フォーマット：%s",
    pasteHint: "💡 Ctrl+V で画像を貼り付け、またはドラッグ＆ドロップ可能",
  },
  listAction: {
    batchAppend: "バッチ追加",
    addFolder: "フォルダーを追加",
    clear: "リストをクリア",
    downloadAll: "すべて保存",
    downloadOne: "画像を保存",
    removeOne: "画像を削除",
    reCompress: "再圧縮",
  },
  columnTitle: {
    status: "ステータス",
    name: "ファイル名",
    preview: "プレビュー",
    size: "サイズ",
    dimension: "サイズ",
    decrease: "圧縮率",
    action: "アクション",
    newSize: "新しいサイズ",
    newDimension: "新しいディメンション",
  },
  optionPannel: {
    failTip:
      "小さくすることができません。パラメータを調整して再試行してください。",
    help: "Frog圧縮 はバッチ画像圧縮アプリケーションです。オプションの変更はすべての画像に適用されます。",
    resizeLable: "画像のサイズを変更する",
    jpegLable: "JPEG/WEBPパラメータ",
    pngLable: "PNG パラメータ",
    gifLable: "GIF パラメータ",
    avifLable: "AVIF パラメータ",
    resizePlaceholder: "調整モードの選択",
    fitWidth: "幅と高さを自動的に調整します",
    fitHeight: "高さと幅を自動的に調整します",
    setShort: "短辺と長辺を自動的に調整します",
    setLong: "長辺と短辺を自動的に調整します",
    setCropRatio: "クロップモード、クロップ率の設定",
    setCropSize: "切り抜きモード、切り抜きサイズを設定",
    cwRatioPlaceholder: "幅の比率を設定",
    chRatioPlaceholder: "高さの比率を設定",
    cwSizePlaceholder: "切り抜き幅を設定",
    chSizePlaceholder: "トリミングの高さを設定",
    widthPlaceholder: "出力画像の幅を設定します",
    heightPlaceholder: "出力画像の高さを設定します",
    shortPlaceholder: "出力画像の短辺の長さを設定する",
    longPlaceholder: "出力画像の長辺の長さを設定する",
    resetBtn: "オプションをリセット",
    confirmBtn: "オプションを適用",
    qualityTitle: "出力画質を設定します(0-1)",
    colorsDesc: "出力色の数を設定します (2-256)",
    pngDithering: "ディザリング係数を設定します (0-1)",
    gifDithering: "ディザリングをオンにする",
    avifQuality: "出力画質を設定します (1-100)",
    avifSpeed: "圧縮速度を設定します (1-10)",
    outputFormat: "出力形式を設定する",
    outputFormatPlaceholder: "出力画像フォーマットの選択",
    transparentFillDesc: "透明な塗りつぶしの色を選択します",
    cropCompareWarning: "クロップ モードは比較プレビューをサポートしていません",
  },
  error404: {
    backHome: "ホームページに戻る",
    description: "申し訳ありませんが、アクセスしたページは存在しません~",
  },
  progress: {
    before: "圧縮前",
    after: "圧縮後",
    rate: "圧縮率",
  },
};

export default localeData;
