import { Form, Select } from "antd";
import { Controller } from "react-hook-form";
import { SelectProps } from "antd";
import "./MyFormSelect.css";
import { cn } from "@/lib/utils";

interface MyFormSelectProps {
  label: string;
  labelClassName?: string;
  name: string;
  options?: SelectProps["options"];
  disabled?: boolean;
  mode?: "multiple" | "tags"; // these are the two modes supported by Ant Design's Select
  placeHolder: string;
  className?: string;
}

const MyFormSelect = ({
  label,
  labelClassName,
  name,
  options,
  disabled,
  mode,
  placeHolder,
  className,
}: MyFormSelectProps) => {
  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col justify-center gap-1">
          {/* Label */}
          <p
            className={cn(
              "ps-1 mb-2 text-[#101828] text-base font-normal leading-6",
              labelClassName
            )}
          >
            {label}
          </p>

          {/* Ant Design Select */}
          <Form.Item style={{ marginBottom: "0px" }}>
            <Select
              mode={mode}
              style={{ width: "100%" }}
              className={cn(className)}
              {...field} // Spread react-hook-form's field props
              ref={null} // React 19 requires explicit handling of refs; set to null here
              value={field.value} // Pass the value explicitly
              onChange={(value) => field.onChange(value)} // Handle onChange
              options={options} // Options for the select
              size="large"
              disabled={disabled}
              placeholder={placeHolder}
            />

            {/* Error Message */}
            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </Form.Item>
        </div>
      )}
    />
  );
};

export default MyFormSelect;
