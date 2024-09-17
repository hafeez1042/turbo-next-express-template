import React from "react";
import { PlaceholderProfileImage } from "./PlaceholderProfileImage";
import { UploadIcon } from "lucide-react";

export const ProfileImagePicker: React.FC<IProps> = (props) => {
  return (
    <label className="w-24">
      <input
        className="hidden"
        type="file"
        multiple={false}
        onChange={(e) => props.onSelect(e.target.files![0]!)}
      />
      <div className="relative w-24 h-24 rounded-full overflow-hidden mt-3">
          {!props.selectedFile && !props.url ? (
            <PlaceholderProfileImage />
          ) : (
            <RenderImage file={props.selectedFile} url={props.url} />
          )}
        

        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white">
          <UploadIcon />
          <div className="text-xs">Upload</div>
        </div>
      </div>
    </label>
  );
};

interface IProps {
  onSelect: (file: File) => void;
  selectedFile?: File;
  url?: string;
}
const RenderImage: React.FC<{ file?: File; url?: string }> = (props) => {
  if (props.file) {
    return (
      <img
        src={URL.createObjectURL(props.file)}
        alt={props.file.name}
        style={{ maxWidth: "100%", maxHeight: "400px" }}
      />
    );
  }

  if (props.url) {
    return <img src={props.url} />;
  }
};
