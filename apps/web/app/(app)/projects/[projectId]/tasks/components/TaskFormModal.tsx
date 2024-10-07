import { Modal } from "@repo/frontend/components/Modal";
import React from "react";
import { TaskForm } from "./TaskForm";

export const TaskFormModal: React.FC<IProps> = (props) => {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} title="Add Task">
      <TaskForm />
    </Modal>
  );
};

interface IProps {
  isOpen?: boolean;
  onClose: () => void;
}
