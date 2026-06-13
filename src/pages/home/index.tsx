import { Button, Divider, Flex, Space, Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";
import { Logo } from "@/components/Logo";
import {
  EyeOutlined,
  InboxOutlined,
  MenuOutlined,
  SafetyCertificateOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { gstate } from "@/global";
import { changeLang, langList } from "@/locale";
import { homeState } from "@/states/home";
import { getFilesFromClipboard, hasImageInClipboard } from "@/functions";
import { UploadCard } from "@/components/UploadCard";
import { useWorkerHandler } from "@/engines/transform";
import { createImageList } from "@/engines/transform";
import { Compare } from "@/components/Compare";
import { useResponse } from "@/media";
import { RightOption } from "./RightOption";
import { LeftContent } from "./LeftContent";
import { useEffect } from "react";

const featureIcons = [
  <SafetyCertificateOutlined />,
  <ThunderboltOutlined />,
  <EyeOutlined />,
  <InboxOutlined />,
];

const LandingSections = observer(() => {
  const content = gstate.locale?.homeContent;
  if (!content) return null;

  return (
    <section className={style.landingSections}>
      <div className={style.sectionIntro}>
        <Typography.Text className={style.eyebrow}>
          {content.intro.eyebrow}
        </Typography.Text>
        <Typography.Title level={2}>{content.intro.title}</Typography.Title>
        <Typography.Paragraph>{content.intro.description}</Typography.Paragraph>
      </div>

      <div className={style.featureGrid}>
        {content.features.map((item, index) => (
          <article className={style.featureCard} key={item.title}>
            <span className={style.featureIcon}>{featureIcons[index]}</span>
            <Typography.Title level={3}>{item.title}</Typography.Title>
            <Typography.Paragraph>{item.description}</Typography.Paragraph>
          </article>
        ))}
      </div>

      <div className={style.workflowBand}>
        <div>
          <Typography.Text className={style.eyebrow}>
            {content.workflow.eyebrow}
          </Typography.Text>
          <Typography.Title level={2}>{content.workflow.title}</Typography.Title>
        </div>
        <div className={style.stepList}>
          {content.steps.map((step, index) => (
            <div key={step}>
              <strong>{index + 1}</strong>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={style.faqGrid}>
        {content.faqs.map((item) => (
          <article className={style.faqItem} key={item.question}>
            <Typography.Title level={3}>{item.question}</Typography.Title>
            <Typography.Paragraph>{item.answer}</Typography.Paragraph>
          </article>
        ))}
      </div>
    </section>
  );
});

const Header = observer(() => {
  const { isPC } = useResponse();

  return (
    <Flex align="center" justify="space-between" className={style.header}>
      <Logo title={gstate.locale?.logo} />
      <Space>
        <nav className={style.localeList} aria-label="Language">
          {langList.map((item) => {
            if (!item || !("key" in item) || !("label" in item)) return null;
            const key = String(item.key);
            const selected = key === gstate.lang;
            return (
              <button
                className={selected ? style.localeActive : undefined}
                key={key}
                onClick={() => changeLang(key)}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </nav>
        {/* If non-PC is determined, the menu button will be displayed */}
        {!isPC && homeState.list.size > 0 && (
          <>
            <Divider type="vertical" style={{ background: "#dfdfdf" }} />
            <Button
              icon={<MenuOutlined />}
              onClick={() => {
                homeState.showOption = !homeState.showOption;
              }}
            />
          </>
        )}
      </Space>
    </Flex>
  );
});

const Body = observer(() => {
  const hasFiles = homeState.list.size > 0;

  return (
    <Flex align="stretch" className={style.main}>
      <div className={style.workbench}>
        <UploadCard compact={hasFiles} />
        {hasFiles && (
          <div className={style.resultDock}>
            <LeftContent />
          </div>
        )}
        {!hasFiles && <LandingSections />}
      </div>
      <RightOption />
    </Flex>
  );
});

const Home = observer(() => {
  useWorkerHandler();
  const meta = gstate.locale?.homeContent.meta;

  useEffect(() => {
    if (!meta) return;
    document.title = meta.title;
    const selector = 'meta[name="description"]';
    let description = document.querySelector<HTMLMetaElement>(selector);
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = meta.description;
  }, [meta]);

  // 全局粘贴事件处理
  useEffect(() => {
    const handlePaste = async (event: ClipboardEvent) => {
      if (hasImageInClipboard(event)) {
        event.preventDefault();
        const files = await getFilesFromClipboard(event);
        if (files.length > 0) {
          createImageList(files);
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div className={style.container}>
      <Header />
      <Body />
      {homeState.compareId !== null && <Compare />}
    </div>
  );
});

export default Home;
