import { SelectField } from "@repo/frontend/components/formFields/SelectField";
import { Button } from "@repo/frontend/components/ui/button";
import { Form } from "@repo/frontend/components/ui/form";
import { ProjectStatusEnum } from "@repo/types/lib/schema/project";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { z } from "zod";
import { InputField } from "@repo/frontend/components/formFields/InputField";
import { TextAreaField } from "@repo/frontend/components/formFields/TextAreaField";
import { useSaveButton } from "../../../../hooks/useSaveButton";
import { DatePickerField } from "@repo/frontend/components/formFields/DatePickerField";

export const ProjectForm: React.FC<IProps> = (props) => {
  const { saveButton } = useSaveButton();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const onSubmit = () => {};

  return (
    <div className="max-h-[calc(100vh-140px)] overflow-y-auto w-[calc(100%+40px)] pr-[32px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="">
            <div className="mb-6 space-y-4">
              <InputField
                className="w-full"
                label="Project Name *"
                placeholder="Project name"
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
                options={[]}
                label="Status *"
              />
            </div>
            <div className="mb-6 space-y-4">
              <InputField
                className="w-full"
                label="Slug *"
                placeholder="Slug"
                name="slug"
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
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  status: z.nativeEnum(ProjectStatusEnum, {
    required_error: "Status is required",
  }),
  priority: z.number().min(1, "Priority must be greater than 0").optional(),
  rms_id: z.string().optional(),
  start_date: z.date(),
  end_date: z.date().optional(),
  manager_id: z.number().min(1, "Manager ID is required"),
});
