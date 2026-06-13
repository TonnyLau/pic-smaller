// 韩语

import { LocaleData } from "@/type";
import koKR from "antd/locale/ko_KR";

const localeData: LocaleData = {
  antLocale: koKR,
  logo: "개구리 압축",
  initial: "초기화 중",
  previewHelp:
    "압축 효과를 비교하려면 구분선을 드래그하세요. 왼쪽은 원본 이미지, 오른쪽은 압축된 이미지입니다.",
  homeContent: {
    meta: {
      title: "개구리 압축 - 로컬 이미지 압축 도구",
      description:
        "개구리 압축는 브라우저에서 이미지를 압축합니다. 이미지는 업로드되지 않고, 개인정보는 기기에 남으며, 일상 사용에 필요한 선명도를 유지하면서 파일 크기를 줄입니다.",
    },
    intro: {
      eyebrow: "업로드 없음, 로컬 처리",
      title: "이미지는 작게, 개인정보는 기기에",
      description:
        "개구리 압축는 복잡한 설정 없이 이미지를 가볍게 만들기 위한 도구입니다. 이미지를 추가하면 브라우저에서 로컬로 압축하고, 원본 크기와 압축 후 크기, 절감률을 확인한 뒤 다운로드할 수 있습니다.",
    },
    features: [
      {
        title: "더 안전한 로컬 압축",
        description:
          "이미지는 브라우저에서 처리되며 서버로 전송되지 않습니다. 개인 사진, 스크린샷, 업무 이미지를 기기 안에 보관할 수 있습니다.",
      },
      {
        title: "한 번에 가볍게",
        description:
          "이미지를 끌어다 놓으면 자동으로 압축이 시작됩니다. 계정, 설치, 복잡한 설정이 필요 없습니다.",
      },
      {
        title: "작지만 선명하게",
        description:
          "기본 설정은 공유, 업로드, 보기 용도에 필요한 선명도를 최대한 유지하면서 파일 크기를 줄입니다.",
      },
      {
        title: "여러 이미지 일괄 처리",
        description:
          "여러 이미지를 한 번에 추가하고, 개별 결과를 다운로드하거나 zip 파일로 저장할 수 있습니다.",
      },
    ],
    workflow: {
      eyebrow: "사용 방법",
      title: "세 단계로 이미지 줄이기",
    },
    steps: [
      "이미지 추가 또는 드롭",
      "브라우저에서 로컬 압축",
      "개별 파일 또는 zip 다운로드",
    ],
    faqs: [
      {
        question: "이미지가 업로드되나요?",
        answer:
          "아니요. 개구리 압축는 브라우저에서 이미지를 로컬 처리하며 파일을 저장하지 않습니다.",
      },
      {
        question: "압축 후 흐려지나요?",
        answer:
          "압축으로 품질이 약간 달라질 수 있지만, 기본 설정은 작은 파일 크기와 일상 사용에 필요한 선명도 사이의 균형을 맞춥니다.",
      },
      {
        question: "어떤 상황에 유용한가요?",
        answer:
          "채팅 전송, 폼 업로드, 웹 이미지, 문서 이미지, 큰 로컬 이미지 정리에 유용합니다.",
      },
    ],
  },
  uploadCard: {
    title: "이미지 파일을 여기에 넣기",
    subTitle: "지원 형식: %s",
    pasteHint: "💡 Ctrl+V로 붙여넣기 또는 이미지를 끌어다 놓기",
  },

  listAction: {
    batchAppend: "일괄 추가",
    addFolder: "폴더 추가",
    clear: "목록 지우기",
    downloadAll: "모두 저장",
    downloadOne: "이미지 저장",
    removeOne: "사진 제거",
    reCompress: "재압축",
  },
  columnTitle: {
    status: "상태",
    name: "파일 이름",
    preview: "미리보기",
    size: "크기",
    dimension: "크기",
    decrease: "압축 비율",
    action: "액션",
    newSize: "새 크기",
    newDimension: "새 차원",
  },
  optionPannel: {
    failTip: "더 작게 만들 수 없습니다. 매개변수를 조정하고 다시 시도하세요.",
    help: "개구리 압축는 옵션에 대한 수정 사항이 모든 이미지에 적용되는 일괄 이미지 압축 응용 프로그램입니다.",
    resizeLable: "이미지 크기 조정",
    jpegLable: "JPEG/WEBP 매개변수",
    pngLable: "PNG 매개변수",
    gifLable: "GIF 매개변수",
    avifLable: "AVIF 매개변수",
    resizePlaceholder: "조정 모드 선택",
    fitWidth: "너비, 높이는 자동으로 조정됩니다.",
    fitHeight: "높이 설정, 너비 자동 조정",
    setShort: "짧은 쪽, 긴 쪽은 자동으로 크기 조절 설정",
    setLong: "긴 쪽, 짧은 쪽 자동 크기 조정",
    setCropRatio: "자르기 모드, 자르기 비율 설정",
    setCropSize: "자르기 모드, 자르기 크기 설정",
    cwRatioPlaceholder: "너비 비율 설정",
    chRatioPlaceholder: "높이 비율 설정",
    cwSizePlaceholder: "자르기 너비 설정",
    chSizePlaceholder: "자르기 높이 설정",
    widthPlaceholder: "출력 이미지의 너비를 설정합니다",
    heightPlaceholder: "출력 이미지의 높이를 설정합니다",
    shortPlaceholder: "출력 이미지의 짧은 쪽 길이를 설정합니다",
    longPlaceholder: "출력 이미지의 긴 쪽 길이를 설정합니다",
    resetBtn: "재설정 옵션",
    confirmBtn: "옵션 적용",
    qualityTitle: "출력 이미지 품질 설정(0-1)",
    colorsDesc: "출력 색상 수 설정(2-256)",
    pngDithering: "디더링 계수 설정(0-1)",
    gifDithering: "디더링 켜기",
    avifQuality: "출력 이미지 품질 설정(1-100)",
    avifSpeed: "압축 속도 설정(1-10)",
    outputFormat: "출력 형식 설정",
    outputFormatPlaceholder: "출력 이미지 형식 선택",
    transparentFillDesc: "투명한 채우기 색상 선택",
    cropCompareWarning: "자르기 모드는 비교 미리보기를 지원하지 않습니다.",
  },
  error404: {
    backHome: "홈 페이지로 돌아가기",
    description: "죄송합니다. 방문하신 페이지는 존재하지 않습니다~",
  },
  progress: {
    before: "압축 전",
    after: "압축 후",
    rate: "압축률",
  },
};

export default localeData;
