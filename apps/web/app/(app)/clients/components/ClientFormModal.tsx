import { Modal } from "@repo/frontend/components/Modal";
import React from "react";
import { ClientForm } from "./ClientForm";

export const ClientFormModal: React.FC<IProps> = (props) => {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} title="Add Client" >
      <ClientForm />
    </Modal>
  );
};

interface IProps {
  isOpen?: boolean;
  onClose: () => void;
}
