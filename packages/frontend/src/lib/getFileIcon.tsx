import { VoiceIcon } from "../icons/VoiceIcon";
import { FilmIcon } from "../icons/FilmIcon";
import { ImageIcon } from "../icons/ImageIcon";
import { FileIcon } from "lucide-react";
import mime from "mime-types";

export const getFileIcon = (fileName: string) => {
  const mimeType = mime.lookup(fileName);
  if (!mimeType) return <FileIcon />;

  switch (mimeType.split("/")[0]?.toLowerCase()) {
    case "image":
      return <ImageIcon />;
    case "video":
      return <FilmIcon />;
    case "audio":
      return <VoiceIcon />;

    default:
      return <FileIcon />;
  }
};
