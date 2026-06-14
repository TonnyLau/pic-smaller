// 台湾繁体

import { LocaleData } from "@/type";
import zhTW from "antd/locale/zh_TW";
import { getLandingContent } from "./homeComparison";

const localeData: LocaleData = {
  antLocale: zhTW,
  logo: "青蛙壓縮",
  initial: "初始化中",
  previewHelp: "拖曳分割線對比壓縮效果：左邊是原始圖，右邊是壓縮圖",
  homeContent: {
    meta: {
      title: "青蛙壓縮 - 本機圖片壓縮工具",
      description:
        "青蛙壓縮在瀏覽器本機壓縮圖片，圖片不會上傳伺服器，一鍵瘦身，盡量保持清晰，也保護隱私。",
    },
    intro: {
      eyebrow: "圖片不上傳，本機處理",
      title: "讓圖片變小，把隱私留在本機",
      description:
        "青蛙壓縮適合一般圖片處理需求：不需要複雜設定，加入圖片後就能自動瘦身。你可以查看原圖大小、壓縮後大小和節省比例，再決定下載結果。",
    },
    features: [
      {
        title: "本機壓縮更安心",
        description:
          "圖片在瀏覽器中完成處理，不上傳伺服器，私人照片、證件截圖和工作圖片都能更放心使用。",
      },
      {
        title: "一鍵瘦身不麻煩",
        description:
          "拖入圖片後自動壓縮，不用註冊帳號，也不用安裝軟體，打開頁面即可使用。",
      },
      {
        title: "變小但盡量清晰",
        description:
          "在減少檔案大小的同時，盡量保留日常查看、傳送和上傳所需的畫面清晰度。",
      },
      {
        title: "多圖批次處理",
        description:
          "一次加入多張圖片，完成後可單張下載，也可以打包儲存到本機。",
      },
    ],
    ...getLandingContent("zh-TW"),
    workflow: {
      eyebrow: "如何使用",
      title: "三步完成圖片瘦身",
    },
    steps: ["拖入或選擇圖片", "瀏覽器本機壓縮", "下載單張或打包儲存"],
    faqs: [
      {
        question: "圖片會上傳嗎？",
        answer:
          "不會。青蛙壓縮會在你的裝置本機處理圖片，不經過伺服器，也不會保存你的圖片。",
      },
      {
        question: "壓縮後會不會模糊？",
        answer:
          "壓縮可能帶來輕微畫質變化，但預設會在體積和清晰度之間取得平衡，適合日常傳送、上傳和整理。",
      },
      {
        question: "適合哪些場景？",
        answer:
          "適合聊天傳送、表單上傳、網頁配圖、文件配圖、相簿整理等圖片太大但又希望保持觀感的場景。",
      },
    ],
  },
  uploadCard: {
    title: "選取文件到這裡，支援拖曳文件和資料夾",
    subTitle: "開源的批量圖片壓縮工具，支援 %s 格式",
    pasteHint: "💡 提示：您也可以複製圖片後按 Ctrl+V (Cmd+V) 貼上",
  },
  listAction: {
    batchAppend: "大量新增",
    addFolder: "新增資料夾",
    clear: "清空清單",
    downloadAll: "儲存全部",
    downloadOne: "儲存圖片",
    removeOne: "移除圖片",
    reCompress: "重新壓縮",
  },
  columnTitle: {
    status: "狀態",
    name: "檔案名稱",
    preview: "預覽",
    size: "大小",
    dimension: "尺寸",
    decrease: "壓縮率",
    action: "操作",
    newSize: "新大小",
    newDimension: "新尺寸",
  },
  optionPannel: {
    failTip: "無法更小，請調整參數後重試",
    help: "青蛙壓縮是一款大量圖片壓縮應用，對選項的修改將套用到所有圖片上",
    resizeLable: "調整圖片尺寸",
    jpegLable: "JPEG/WEBP參數",
    pngLable: "PNG參數",
    gifLable: "GIF參數",
    avifLable: "AVIF參數",
    resizePlaceholder: "選擇調整模式",
    fitWidth: "設定寬度，高度自動縮放",
    fitHeight: "設定高度，寬度自動縮放",
    setShort: "設定短邊，長邊自動縮放",
    setLong: "設定長邊，短邊自動縮放",
    setCropRatio: "裁切模式，設定裁切比例",
    setCropSize: "裁切模式，設定裁切尺寸",
    cwRatioPlaceholder: "設定寬度比例",
    chRatioPlaceholder: "設定高度比例",
    cwSizePlaceholder: "設定裁切寬度",
    chSizePlaceholder: "設定裁切高度",
    widthPlaceholder: "設定輸出圖片寬度",
    heightPlaceholder: "設定輸出圖片高度",
    shortPlaceholder: "設定輸出圖片短邊長度",
    longPlaceholder: "設定輸出圖片長邊長度",
    resetBtn: "重置選項",
    confirmBtn: "應用選項",
    qualityTitle: "設定輸出圖片品質（0-1）",
    colorsDesc: "設定輸出顏色數量（2-256）",
    pngDithering: "設定抖色係數（0-1）",
    gifDithering: "開啟抖色",
    avifQuality: "設定輸出圖片品質（1-100）",
    avifSpeed: "設定壓縮速度（1-10）",
    outputFormat: "設定輸出格式",
    outputFormatPlaceholder: "選擇輸出圖片格式",
    transparentFillDesc: "選擇透明填充色",
    cropCompareWarning: "裁切模式不支援比較預覽",
  },
  error404: {
    backHome: "返回首頁",
    description: "抱歉，你造訪的頁面不存在~",
  },
  progress: {
    before: "壓縮前",
    after: "壓縮後",
    rate: "壓縮率",
  },
};

export default localeData;
