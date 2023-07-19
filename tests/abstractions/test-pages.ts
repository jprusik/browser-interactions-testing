type LocatorWaitForOptions = {
  state?: "visible" | "attached" | "detached" | "hidden";
  timeout?: number;
};

type PageGoToOptions = {
  waitUntil: "domcontentloaded" | "load" | "networkidle" | "commit";
  timeout?: number;
  referer?: string;
};

export { LocatorWaitForOptions, PageGoToOptions };
