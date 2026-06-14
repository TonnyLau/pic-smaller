import { LocaleData } from "@/type";
import zhCN from "antd/locale/zh_CN";
import { getLandingContent } from "./homeComparison";

const localeData: LocaleData = {
  antLocale: zhCN,
  logo: "青蛙压缩",
  initial: "初始化中",
  previewHelp: "拖动分割线对比压缩效果：左边是原始图，右边是压缩图",
  homeContent: {
    meta: {
      title: "青蛙压缩 - 本地图片压缩工具",
      description:
        "青蛙压缩是一款本地图片压缩工具，图片不上传服务器，一键瘦身，尽量保持清晰，保护隐私不泄露。",
    },
    intro: {
      eyebrow: "图片不上传，本地处理",
      title: "把图片变小，把隐私留在本地",
      description:
        "青蛙压缩面向普通用户：不需要复杂设置，添加图片就能自动瘦身。你可以清楚看到原图大小、压缩后大小和节省比例，再决定下载哪一张。",
    },
    features: [
      {
        title: "本地压缩更安全",
        description:
          "图片在浏览器里完成处理，不上传服务器，私人照片、证件截图和工作图片都更安心。",
      },
      {
        title: "一键瘦身不折腾",
        description:
          "拖入图片后自动压缩，不用注册账号，也不用安装软件，打开页面就能用。",
      },
      {
        title: "变小但尽量清晰",
        description:
          "在减小体积的同时尽量保留日常查看、发送和上传需要的画面清晰度。",
      },
      {
        title: "多图批量处理",
        description:
          "一次添加多张图片，压缩完成后可单张下载，也可以打包保存到本地。",
      },
    ],
    ...getLandingContent("zh-CN"),
    workflow: {
      eyebrow: "怎么用",
      title: "三步完成图片瘦身",
    },
    steps: ["拖入或选择图片", "浏览器本地压缩", "下载单张或打包保存"],
    faqs: [
      {
        question: "图片会上传吗？",
        answer:
          "不会。青蛙压缩在你的设备本地处理图片，不经过服务器，也不会保存你的图片。",
      },
      {
        question: "压缩后会不会变模糊？",
        answer:
          "压缩可能带来轻微画质变化，但默认会在体积和清晰度之间做平衡，适合日常发送、上传和整理。",
      },
      {
        question: "适合哪些场景？",
        answer:
          "适合聊天发送、表单上传、网页配图、文档配图、相册整理等图片太大但又希望保持观感的场景。",
      },
    ],
  },
  uploadCard: {
    title: "拖入图片，一键瘦身",
    subTitle: "支持 %s 等常见格式，添加后直接在本地压缩",
    pasteHint: "也可以点击选择、拖拽文件夹，或粘贴剪贴板图片",
    slogan: "本地压缩更安全，一键瘦身不模糊",
    privacyHint: "图片不上传，本地处理，隐私不泄露",
  },
  listAction: {
    batchAppend: "批量添加",
    addFolder: "添加文件夹",
    clear: "清空列表",
    downloadAll: "打包下载",
    downloadZip: "打包下载",
    downloadOne: "下载图片",
    removeOne: "移除图片",
    reCompress: "重新压缩",
    compareAction: "对比效果",
  },
  columnTitle: {
    status: "状态",
    name: "文件名",
    preview: "预览",
    size: "大小",
    dimension: "尺寸",
    decrease: "瘦身比例",
    action: "操作",
    newSize: "压缩后",
    newDimension: "新尺寸",
  },
  optionPannel: {
    failTip: "这张图片已经比较小，可压缩空间有限",
    help: "青蛙压缩默认使用智能压缩，图片只在浏览器本地处理。修改选项后会应用到当前列表中的所有图片。",
    resizeLable: "调整图片尺寸",
    jpegLable: "JPEG/WEBP参数",
    pngLable: "PNG参数",
    gifLable: "GIF参数",
    avifLable: "AVIF参数",
    resizePlaceholder: "选择调整模式",
    fitWidth: "设置宽度，高度自动缩放",
    fitHeight: "设置高度，宽度自动缩放",
    setShort: "设置短边，长边自动缩放",
    setLong: "设置长边，短边自动缩放",
    setCropRatio: "裁剪模式，设置裁剪比例",
    setCropSize: "裁剪模式，设置裁剪尺寸",
    cwRatioPlaceholder: "设置宽度比例",
    chRatioPlaceholder: "设置高度比例",
    cwSizePlaceholder: "设置裁剪宽度",
    chSizePlaceholder: "设置裁剪高度",
    widthPlaceholder: "设置输出图片宽度",
    heightPlaceholder: "设置输出图片高度",
    shortPlaceholder: "设置输出图片短边长度",
    longPlaceholder: "设置输出图片长边长度",
    resetBtn: "重置选项",
    confirmBtn: "应用选项",
    qualityTitle: "设置输出图片质量（0-1）",
    colorsDesc: "设置输出颜色数量（2-256）",
    pngDithering: "设置抖色系数（0-1）",
    gifDithering: "开启抖色",
    avifQuality: "设置输出图片质量（1-100）",
    avifSpeed: "设置压缩速度（1-10）",
    outputFormat: "设置输出格式",
    outputFormatPlaceholder: "选择输出图片格式",
    transparentFillDesc: "选择透明填充色",
    advancedSettings: "高级设置",
    smartMode: "智能压缩",
    cropCompareWarning: "裁剪模式不支持对比预览",
  },
  error404: {
    backHome: "返回首页",
    description: "抱歉，你访问的页面不存在~",
  },
  progress: {
    before: "压缩前",
    after: "压缩后",
    rate: "节省",
    summaryBefore: "原图大小",
    summaryAfter: "压缩后大小",
    summarySaved: "节省",
  },
};

export default localeData;
