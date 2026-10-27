/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"; 
import { FormProvider, useForm } from "react-hook-form";

import { ConfigProvider } from "antd";
import { cn } from "@/lib/utils";

const MyFormWrapper = ({
  onSubmit,
  className,
  children,
  defaultValues,
  resolver,
}: {
  onSubmit: (data: any, reset: () => void) => void;
  className?: string;
  children: React.ReactNode;
  defaultValues?: any;
  resolver?: import("react-hook-form").Resolver<any, any>;
}) => {
  const formConfig: Record<string, any> = {};

  if (defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }

  if (resolver) {
    formConfig["resolver"] = resolver;
  }

  const methods = useForm(formConfig);
  const { handleSubmit, reset } = methods;

  const submit = (data: any) => {
    onSubmit(data, reset); // Pass reset function to onSubmit
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            hoverBorderColor: "#DFB76C",
            activeBorderColor: "#DFB76C",
            colorBorder: "#26282E",
          },
          Input: {
            hoverBorderColor: "#DFB76C",
            activeBorderColor: "#DFB76C",
            colorBorder: "#26282E",
          },
          Checkbox: {
            colorBorder: "#26282E",
            colorPrimary: "#DFB76C",
            colorPrimaryHover: "#ECC870",
          },
          DatePicker: {
            colorPrimary: "#DFB76C",
            colorPrimaryHover: "#ECC870",
            colorBorder: "#26282E",
            colorText: "#F3F4F6",
          },
        },
      }}
    >
      <FormProvider {...methods}>
        <form className={cn("", className)} onSubmit={handleSubmit(submit)}>
          {children}
        </form>
      </FormProvider>
    </ConfigProvider>
  );
};

export default MyFormWrapper;
