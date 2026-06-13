import { Button, Drawer, Flex, Popover, Space, Typography } from "antd";
import style from "./RightOption.module.scss";
import { observer } from "mobx-react-lite";
import {
  CaretRightOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { gstate } from "@/global";
import { CompressOption } from "@/components/CompressOption";
import { DefaultCompressOption, homeState } from "@/states/home";
import { toJS } from "mobx";
import { useResponse } from "@/media";
import classNames from "classnames";

export const RightOption = observer(() => {
  const disabled = homeState.hasTaskRunning();

  const { isPad, isPC } = useResponse();
  const option = (
    <>
      <Flex justify="space-between" align="center">
        <Space>
          <Typography.Text strong>
            {gstate.locale?.optionPannel.advancedSettings}
          </Typography.Text>
          <Popover
            placement="bottom"
            content={
              <div className={style.optionHelpBox}>
                <Typography.Text>
                  {gstate.locale?.optionPannel.help}
                </Typography.Text>
              </div>
            }
          >
            <Typography.Text type="secondary" className={style.optionHelp}>
              <ExclamationCircleOutlined />
            </Typography.Text>
          </Popover>
        </Space>
        <Space>
          <Button
            icon={<CloseOutlined />}
            onClick={() => {
              homeState.showOption = false;
            }}
          />
          <Button
            disabled={disabled}
            icon={<ReloadOutlined />}
            onClick={async () => {
              homeState.showOption = false;
              homeState.tempOption = { ...DefaultCompressOption };
              homeState.option = { ...DefaultCompressOption };
              homeState.isSmartMode = true;
              homeState.reCompress();
            }}
          >
            {gstate.locale?.optionPannel?.resetBtn}
          </Button>
          <Button
            disabled={disabled}
            icon={<CaretRightOutlined />}
            type="primary"
            onClick={() => {
              homeState.showOption = false;
              homeState.option = toJS(homeState.tempOption);
              homeState.isSmartMode = false;
              homeState.reCompress();
            }}
          >
            {gstate.locale?.optionPannel?.confirmBtn}
          </Button>
        </Space>
      </Flex>
      <div>
        <CompressOption />
      </div>
    </>
  );

  if (isPC) {
    if (!homeState.showOption) {
      return null;
    }
    return <div className={classNames(style.side, style.sidePc)}>{option}</div>;
  } else if (isPad) {
    return (
      <Drawer
        placement="right"
        getContainer={false}
        open={homeState.showOption}
        closable={false}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className={classNames(style.side, style.sidePad)}>{option}</div>
      </Drawer>
    );
  } else {
    return (
      <Drawer
        placement="right"
        getContainer={false}
        open={homeState.showOption}
        closable={false}
        width="100%"
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <div className={classNames(style.side, style.sideMobile)}>{option}</div>
      </Drawer>
    );
  }
});
