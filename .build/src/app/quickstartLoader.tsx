import { GuidesQuickStart, ProcQuickStartParser } from "@app/procedure-parser";
import React, { useState, useEffect, FunctionComponent } from "react";
import { useAssets } from "@bf2/ui-shared";

const loadJSONQuickStartsFilesFromAssets = async (
  basePath: string
): Promise<string[]> => {
  const data = await fetch(`${basePath}/webpack-assets.json`).then((response) =>
    response.json()
  );
  const files = Array.isArray(data[""]["json"])
    ? data[""]["json"]
    : [data[""]["json"]];
  return files
    .filter((url) => url.endsWith(".quickstart.json"))
    .map((e) => (!e.startsWith("http") ? `${basePath}/${e}` : e));
};

export const loadJSONQuickStarts = async (
  basePath: string,
  showDrafts?: boolean
) => {
  const files = await loadJSONQuickStartsFilesFromAssets(basePath);
  const result = [] as GuidesQuickStart[];
  for (let i = 0; i < files.length; i++) {
    await fetch(files[i]).then((response) =>
      response.json().then((data) => result.push(data))
    );
  }
  return result
    .filter((qs) => {
      if (!showDrafts && qs.metadata.annotations?.draft) {
        return false;
      }
      return true;
    })
    .map((content) => ProcQuickStartParser(content));
};

export interface QuickStartLoaderProps {
  children: React.ReactNode;
  showDrafts?: boolean;
  onLoad?: any;
}

const QuickStartLoader: FunctionComponent = ({ children, showDrafts, onLoad }) => {
//   const [allQuickStartsLoaded, setAllQuickStartsLoaded] =
//     useState<boolean>(false);
  const [allQuickStarts, setAllQuickStarts] = useState<any[]>([]);
  const assets = useAssets();
  useEffect(() => {
    const load = async () => {
      const quickstarts = await loadJSONQuickStarts(
        assets?.getPath() || "",
        showDrafts
      );
      debugger;
      setAllQuickStarts(quickstarts);
      onLoad && onLoad(quickstarts);
    //   setAllQuickStartsLoaded(true);
    };
    load();
  }, [assets, showDrafts]);
  debugger;
  return children(allQuickStarts, allQuickStarts.length > 0);
};

export default QuickStartLoader;
