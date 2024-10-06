import { cn } from "../lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

export const Modal: React.FC<React.PropsWithChildren<IModalProps>> = (props) => {
  return (
    <Dialog
      open={props.isOpen}
      modal={true}
      onOpenChange={(value) => {
        if (!value) props.onClose();
      }}
    >
      <DialogContent className={cn(props.size === "md" ? "max-w-lg" : "max-w-3xl" ,props.className)}>
        <DialogHeader>
          {props.title && <DialogTitle>{props.title}</DialogTitle>}
          {props.description && (
            <DialogDescription>{props.description}</DialogDescription>
          )}
        </DialogHeader>
        {props.children}
        <DialogFooter>{props.footer}</DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export interface IModalProps {
  title?: string;
  isOpen?: boolean;
  onClose: () => void;
  footer?: React.ReactNode;
  description?: string;
  className?: string;
  size?: "lg" | "md"
}
