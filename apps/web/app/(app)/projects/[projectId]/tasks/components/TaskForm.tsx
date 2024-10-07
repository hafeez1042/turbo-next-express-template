import { SelectField } from "@repo/frontend/components/formFields/SelectField";
import { Form } from "@repo/frontend/components/ui/form";
import { TaskStatusEnum } from "@repo/types/lib/schema/task"; // Adjust this import based on your path
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { z } from "zod";
import { InputField } from "@repo/frontend/components/formFields/InputField";
import { TextAreaField } from "@repo/frontend/components/formFields/TextAreaField";
import { DatePickerField } from "@repo/frontend/components/formFields/DatePickerField";
import { useSaveButton } from "../../../../../../hooks/useSaveButton";

export const TaskForm: React.FC<IProps> = (props) => {
  const { saveButton } = useSaveButton();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Implement save logic here
  };

  return (
    <div className="max-h-[calc(100vh-140px)] overflow-y-auto w-[calc(100%+40px)] pr-[32px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="">
            <div className="mb-6 space-y-4">
              <InputField
                className="w-full"
                label="Task Name *"
                placeholder="Task name"
                name="name"
                form={form}
              />
            </div>
            <div className="mb-6 space-y-4">
              <TextAreaField
                name={"description"}
                form={form}
                placeholder="Description"
                label="Description *"
              />
            </div>

            <div className="flex w-full justify-between gap-2 mb-6">
              <DatePickerField
                name={"start_date"}
                form={form}
                placeholder="Start date"
                label="Start Date *"
              />
              <DatePickerField
                name={"end_date"}
                form={form}
                placeholder="End date"
                label="End Date *"
              />
            </div>
            <div className="mb-6 space-y-4">
              <SelectField
                name={"status"}
                form={form}
                placeholder="Status"
                options={taskSTatusAsOptions}
                label="Status *"
              />
            </div>
            <div className="mb-6 space-y-4">
              <InputField
                className="w-full"
                label="Priority *"
                placeholder="Priority (1-10)"
                name="priority"
                form={form}
              />
            </div>
            <div className="mb-6 space-y-4">
              <InputField
                className="w-full"
                label="Assigned To ID *"
                placeholder="Assigned to user ID"
                name="assigned_to_id"
                form={form}
              />
            </div>
            <div className="mb-6 space-y-4">
              <InputField
                className="w-full"
                label="Tech Stack ID *"
                placeholder="Tech Stack ID"
                name="tech_stack_id"
                form={form}
              />
            </div>
          </div>

          <div className="w-full mt-9">{saveButton}</div>
        </form>
      </Form>
    </div>
  );
};

interface IProps {}

const FormSchema = z.object({
  name: z.string().min(1, "Task Name is required"),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatusEnum, {
    required_error: "Status is required",
  }),
  priority: z.number().min(1, "Priority must be greater than 0"),
  assigned_to_id: z.number().min(1, "Assigned To ID is required"),
  tech_stack_id: z.number().min(1, "Tech Stack ID is required"),
  start_date: z.date().optional(),
  end_date: z.date().optional(),
});

const taskSTatusAsOptions = [
  { label: "Not Started", value: TaskStatusEnum.NOT_STARTED },
  { label: "In Progress", value: TaskStatusEnum.IN_PROGRESS },
  { label: "Completed", value: TaskStatusEnum.COMPLETED },
  { label: "On Hold", value: TaskStatusEnum.ON_HOLD },
  { label: "Cancelled", value: TaskStatusEnum.CANCELLED },
  { label: "Blocked", value: TaskStatusEnum.BLOCKED },
];
