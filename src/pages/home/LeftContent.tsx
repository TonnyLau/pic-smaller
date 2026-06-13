import { Button, Flex, Space, Table, Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import {
  ClearOutlined,
  CompressOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import { useCallback } from "react";
import { gstate } from "@/global";
import { homeState } from "@/states/home";
import {
  createDownload,
  formatSize,
  getOutputFileName,
  getUniqNameOnNames,
} from "@/functions";
import { ProgressHint } from "@/components/ProgressHint";
import { useColumn } from "./useColumn";
import { useResponse } from "@/media";

export const LeftContent = observer(() => {
  const { isMobile } = useResponse();
  const disabled = homeState.hasTaskRunning();
  const columns = useColumn(disabled);
  const progressInfo = homeState.getProgressHintInfo();
  const isComplete =
    progressInfo.totalNum > 0 && progressInfo.loadedNum === progressInfo.totalNum;
  const savingText = progressInfo.rate.toFixed(2);
  const firstCompleted = Array.from(homeState.list.values()).find(
    (item) => item.preview && item.compress,
  );

  const downloadZip = useCallback(async () => {
    gstate.loading = true;
    try {
      const jszip = await import("jszip");
      const zip = new jszip.default();
      const names: Set<string> = new Set();
      /* eslint-disable @typescript-eslint/no-unused-vars */
      for (const [_, info] of homeState.list) {
        const fileName = getOutputFileName(info, homeState.option);
        const uniqName = getUniqNameOnNames(names, fileName);
        names.add(uniqName);
        if (info.compress?.blob) {
          zip.file(uniqName, info.compress.blob);
        }
      }
      const result = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 6,
        },
      });
      createDownload("frog-compress.zip", result);
    } finally {
      gstate.loading = false;
    }
  }, []);

  return (
    <Flex align="stretch" vertical className={style.content}>
      <Flex align="center" justify="space-between" className={style.resultHero}>
        <div className={style.resultCopy}>
          <Typography.Title level={2}>
            {isComplete
              ? `${gstate.locale?.logo ?? "青蛙压缩"}已帮你瘦身 ${savingText}%`
              : `正在本地压缩...（${progressInfo.loadedNum}/${progressInfo.totalNum}）`}
          </Typography.Title>
          <Typography.Text>
            {progressInfo.totalNum} 张图片已处理&nbsp;&nbsp;|&nbsp;&nbsp;原图{" "}
            {formatSize(progressInfo.originSize)}
            &nbsp;→&nbsp;压缩后 {formatSize(progressInfo.outputSize)}
          </Typography.Text>
        </div>
        <Space wrap className={style.heroActions}>
          {firstCompleted && (
            <Button
              disabled={disabled || homeState.isCropMode()}
              icon={<CompressOutlined />}
              onClick={() => {
                homeState.compareId = firstCompleted.key;
              }}
            >
              {!isMobile && gstate.locale?.listAction.compareAction}
            </Button>
          )}
          <Button
            disabled={disabled}
            icon={<ClearOutlined />}
            danger
            onClick={() => {
              homeState.clear();
            }}
          >
            {!isMobile && gstate.locale?.listAction.clear}
          </Button>
          <Button
            icon={<DownloadOutlined />}
            type="primary"
            size="large"
            disabled={disabled}
            onClick={downloadZip}
          >
            {!isMobile &&
              (gstate.locale?.listAction.downloadZip ??
                gstate.locale?.listAction.downloadAll)}
          </Button>
        </Space>
      </Flex>
      <div className={style.tablePanel}>
        <Table
          columns={columns}
          size="small"
          pagination={false}
          dataSource={Array.from(homeState.list.values())}
        />
      </div>
      <Flex align="center" justify="space-between" className={style.footerBar}>
        <ProgressHint />
        <Button
          icon={<DownloadOutlined />}
          type="primary"
          size="large"
          disabled={disabled}
          onClick={downloadZip}
        >
          {gstate.locale?.listAction.downloadZip ??
            gstate.locale?.listAction.downloadAll}
        </Button>
      </Flex>
    </Flex>
  );
});
