import { Flex, Typography } from "antd";
import style from "./index.module.scss";
import { useEffect, useRef } from "react";
import classNames from "classnames";
import { observer } from "mobx-react-lite";
import { gstate } from "@/global";
import { ImageInput } from "../ImageInput";
import { state } from "./state";
import { createImageList } from "@/engines/transform";
import { getFilesFromEntry, getFilesFromHandle } from "@/functions";
import { sprintf } from "sprintf-js";
import { Mimes } from "@/mimes";

type UploadCardProps = {
  compact?: boolean;
};

export const UploadCard = observer(({ compact = false }: UploadCardProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dragLeave = () => {
      state.dragActive = false;
    };
    const dragOver = (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = true;
    };
    const drop = async (event: DragEvent) => {
      event.preventDefault();
      state.dragActive = false;
      const files: Array<File> = [];
      if (event.dataTransfer?.items) {
        // https://stackoverflow.com/questions/55658851/javascript-datatransfer-items-not-persisting-through-async-calls
        const list: Array<Promise<void>> = [];
        for (const item of event.dataTransfer.items) {
          if (typeof item.getAsFileSystemHandle === "function") {
            list.push(
              (async () => {
                const handle = await item.getAsFileSystemHandle!();
                const result = await getFilesFromHandle(handle);
                files.push(...result);
              })(),
            );
            continue;
          }
          if (typeof item.webkitGetAsEntry === "function") {
            list.push(
              (async () => {
                const entry = await item.webkitGetAsEntry();
                if (entry) {
                  const result = await getFilesFromEntry(entry);
                  files.push(...result);
                }
              })(),
            );
          }
        }
        await Promise.all(list);
      } else if (event.dataTransfer?.files) {
        const list = event.dataTransfer?.files;
        for (let index = 0; index < list.length; index++) {
          const file = list.item(index);
          if (file) {
            files.push(file);
          }
        }
      }

      files.length > 0 && createImageList(files);
    };

    const target = dragRef.current!;
    target.addEventListener("dragover", dragOver);
    target.addEventListener("dragleave", dragLeave);
    target.addEventListener("drop", drop);

    return () => {
      target.removeEventListener("dragover", dragOver);
      target.removeEventListener("dragleave", dragLeave);
      target.removeEventListener("drop", drop);
    };
  }, []);

  return (
    <Flex
      justify="center"
      align="center"
      className={classNames(
        style.container,
        compact && style.compact,
        state.dragActive && style.active,
      )}
    >
      <Flex vertical align="center" className={style.inner}>
        <div className={style.dropZone}>
          <div className={style.brandMark}>
            <svg viewBox="0 0 1024 1024" aria-hidden="true">
              <path
                className={style.frogBody}
                d="M224 416c0-159.1 128.9-288 288-288s288 128.9 288 288v192c0 106-86 192-192 192H416c-106 0-192-86-192-192V416Z"
              />
              <circle className={style.frogEye} cx="362" cy="350" r="70" />
              <circle className={style.frogEye} cx="662" cy="350" r="70" />
              <circle className={style.frogPupil} cx="362" cy="350" r="26" />
              <circle className={style.frogPupil} cx="662" cy="350" r="26" />
              <path
                className={style.frogSmile}
                d="M382 584c34 45 77.3 67.5 130 67.5S608 629 642 584"
              />
            </svg>
          </div>
          <Typography.Title level={1}>{gstate.locale?.logo}</Typography.Title>
          <Typography.Text className={style.slogan}>
            {gstate.locale?.uploadCard.slogan}
          </Typography.Text>
          <Typography.Text className={style.privacyHint}>
            {gstate.locale?.uploadCard.privacyHint}
          </Typography.Text>
          <Typography.Text className={style.uploadAction}>
            {gstate.locale?.uploadCard.title}
          </Typography.Text>
          <div className={style.formatHint}>
            {sprintf(
              gstate.locale?.uploadCard.subTitle ?? "",
              Object.keys(Mimes)
                .map((item) => item.toUpperCase())
                .join("/"),
            )}
          </div>
          <div className={style.pasteHint}>
            {gstate.locale?.uploadCard.pasteHint}
          </div>
        </div>
      </Flex>
      <ImageInput ref={fileRef} />
      <div
        className={style.mask}
        ref={dragRef}
        onClick={() => {
          fileRef.current?.click();
        }}
      />
    </Flex>
  );
});
