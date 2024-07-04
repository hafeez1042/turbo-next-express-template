import React, { useCallback, useState } from "react";

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [resolveReject, setResolveReject] = useState([]);
  const [resolve, reject] = resolveReject;
  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [callback, setCallback] = useState<() => Promise<void>>();
  const [resolvingCallback, setResolvingCallback] = useState(false);

  const confirm = useCallback(
    (
      _title?: string,
      _description?: string,
      callbackFns?: () => Promise<void>
    ) => {
      setTitle(_title);
      setDescription(_description);
      setIsOpen(true);
      setCallback(() => callbackFns);
      return new Promise((res, rej) => {
        setResolveReject([res, rej]);
      });
    },
    []
  );

  const handleConfirm = async () => {
    if (resolve) resolve(true);
    if (callback) {
      setResolvingCallback(true);
      await callback();
    }
    onClose();
  };

  const onClose = () => {
    setIsOpen(false);
    setTitle("");
    setDescription("");
    setResolvingCallback(false);
  };

  const handleCancel = () => {
    if (reject) reject(false);
    onClose();
  };

  const confirmDialogProps: IConfirmDialogProps = {
    isOpen: isOpen,
    title: title,
    message: description,
    onConfirm: handleConfirm,
    onCancel: handleCancel,
    isResolving: resolvingCallback,
  };
  return { confirm, confirmDialogProps };
};

export interface IConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isResolving: boolean;
}
