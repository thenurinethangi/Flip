declare module "react-native-pell-rich-editor" {
  import * as React from "react";

  export const actions: Record<string, string>;

  export interface RichEditorProps {
    editorStyle?: Record<string, unknown>;
    initialContentHTML?: string;
    placeholder?: string;
    onChange?: (text: string) => void;
    editorInitializedCallback?: () => void;
    style?: any;
    [key: string]: any;
  }

  export interface RichToolbarProps {
    editor?: any;
    actions?: string[];
    onInsertLink?: () => void;
    iconTint?: string;
    selectedIconTint?: string;
    iconMap?: Record<string, (args: { tintColor?: string }) => React.ReactNode>;
    style?: any;
    [key: string]: any;
  }

  export const RichEditor: React.ComponentType<RichEditorProps>;
  export const RichToolbar: React.ComponentType<RichToolbarProps>;
}
