"use client";

import React from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import { useTheme } from "next-themes";

interface DiffViewerProps {
  oldValue: string;
  newValue: string;
  showLineNumbers?: boolean;
}

export const DiffViewer = ({
  oldValue,
  newValue,
  showLineNumbers = true,
}: DiffViewerProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="w-full h-full overflow-auto">
      <ReactDiffViewer
        oldValue={oldValue}
        newValue={newValue}
        splitView={true}
        showDiffOnly={false}
        useDarkTheme={isDark}
        hideLineNumbers={!showLineNumbers}
        styles={{
          variables: {
            light: {
              diffViewerBackground: "transparent",
              diffViewerColor: "var(--foreground)",
              addedBackground: "rgba(0, 255, 0, 0.1)",
              addedColor: "var(--foreground)",
              removedBackground: "rgba(255, 0, 0, 0.1)",
              removedColor: "var(--foreground)",
              wordAddedBackground: "rgba(0, 255, 0, 0.2)",
              wordRemovedBackground: "rgba(255, 0, 0, 0.2)",
              addedGutterBackground: "rgba(0, 255, 0, 0.2)",
              removedGutterBackground: "rgba(255, 0, 0, 0.2)",
              gutterBackground: "var(--background)",
              gutterColor: "var(--muted-foreground)",
              codeFoldGutterBackground: "var(--background)",
              codeFoldBackground: "var(--muted)",
              emptyLineBackground: "var(--background)",
            },
            dark: {
              diffViewerBackground: "transparent",
              diffViewerColor: "var(--foreground)",
              addedBackground: "rgba(0, 255, 0, 0.1)",
              addedColor: "var(--foreground)",
              removedBackground: "rgba(255, 0, 0, 0.1)",
              removedColor: "var(--foreground)",
              wordAddedBackground: "rgba(0, 255, 0, 0.2)",
              wordRemovedBackground: "rgba(255, 0, 0, 0.2)",
              addedGutterBackground: "rgba(0, 255, 0, 0.2)",
              removedGutterBackground: "rgba(255, 0, 0, 0.2)",
              gutterBackground: "var(--background)",
              gutterColor: "var(--muted-foreground)",
              codeFoldGutterBackground: "var(--background)",
              codeFoldBackground: "var(--muted)",
              emptyLineBackground: "var(--background)",
            },
          },
        }}
      />
    </div>
  );
}; 