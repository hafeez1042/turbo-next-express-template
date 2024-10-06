import { SaveButton } from "@repo/frontend/components/SaveButton";
import { useMemo, useState } from "react";

export const useSaveButton = (options?: IOptions) => {
  const { label = "Save", savingLabel = "Save", className } = options || {}
  const [isSaving, setIsSaving] = useState(false);

  const saveButton = useMemo(
    () => (
      <SaveButton isSaving={isSaving} className={className}>
        {isSaving ? savingLabel || label : label}
      </SaveButton>
    ),
    [isSaving]
  );

  return { setIsSaving, saveButton };
};

interface IOptions {
  label: string;
  savingLabel?: string;
  className?: string;
}
