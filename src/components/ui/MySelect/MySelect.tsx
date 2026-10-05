"use client";

import React from "react";
import { Select } from "antd";
import type { SelectProps } from "antd/es/select";

const MySelect: React.FC<SelectProps> = (props) => {
  return <Select {...props} />;
};

export default MySelect;
