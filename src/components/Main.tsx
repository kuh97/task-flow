import { PropsWithChildren } from "react";

/**
 * Main 영역
 */
const Main = ({ children }: PropsWithChildren) => {
  return <div className={`w-[calc(100%-256px)] h-screen`}>{children}</div>;
};

export default Main;
