import { Typography } from "antd";
import style from "./index.module.scss";
import { observer } from "mobx-react-lite";

interface LogoProps {
  title?: string;
}

export const Logo = observer(({ title = "Pic Smaller" }: LogoProps) => {
  return (
    <div className={style.container}>
      <span className={style.mark} aria-hidden="true">
        <svg viewBox="0 0 64 64">
          <path
            className={style.body}
            d="M8 31.5C8 18.5 18.7 8 32 8s24 10.5 24 23.5V43c0 7.2-5.8 13-13 13H21c-7.2 0-13-5.8-13-13V31.5Z"
          />
          <circle className={style.eye} cx="22" cy="21" r="8.5" />
          <circle className={style.eye} cx="42" cy="21" r="8.5" />
          <circle className={style.pupil} cx="22" cy="21" r="3.2" />
          <circle className={style.pupil} cx="42" cy="21" r="3.2" />
          <path className={style.smile} d="M21 38c3.2 4 6.9 6 11 6s7.8-2 11-6" />
        </svg>
      </span>
      <Typography.Text>{title}</Typography.Text>
    </div>
  );
});
