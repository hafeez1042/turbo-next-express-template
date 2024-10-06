import { Modal } from "@repo/frontend/components/Modal";
import React from "react";
import { ProjectForm } from "./ProjectForm";

export const ProjectFormModal: React.FC<IProps> = (props) => {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} title="Add Project" >
      <ProjectForm />
    </Modal>
  );
};

interface IProps {
  isOpen?: boolean;
  onClose: () => void;
}
