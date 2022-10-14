/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

import Signin from "../components/Signin";

export default function Home() {
  return (
    <div
      css={css`
        display: flex;
        width: 100%;
        height: 100vh;
        justify-content: center;
        align-items: center;
      `}
    >
      <Signin />
    </div>
  );
}
