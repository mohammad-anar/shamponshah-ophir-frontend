"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Select } from "antd";

const HeroSearchForm = () => {
  const serviceSelect = (value: string) => {
    console.log(`selected ${value}`);
  };
  return (
    <div className="mt-7 bg-white p-6 rounded-lg w-fit text-black flex items-center gap-5">
      <Select placeholder="Select service" onChange={serviceSelect}>
        <Select.Option value="sample">Sample</Select.Option>
      </Select>
      <Select placeholder="Select Location" onChange={serviceSelect}>
        <Select.Option value="sample">Sample</Select.Option>
      </Select>
      <Button type="primary" icon={<SearchOutlined />} iconPosition="end">
        Search
      </Button>
    </div>
  );
};

export default HeroSearchForm;
