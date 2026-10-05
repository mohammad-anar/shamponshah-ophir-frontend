"use client";

import AdminLayout from "@/components/shared/layout/Layout";

import Link from "next/link";
import { ReactNode } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { getItem, MenuItem } from "../Layout";

const navItems: MenuItem[] = [
  getItem(
    <Link href="/dashboard">Dashboard</Link>,
    "/dashboard",
    <LuLayoutDashboard />
  ),
  getItem(
    <Link href="/dashboard/roofing">Roofing</Link>,
    "/dashboard/roofing",
    <LuLayoutDashboard />
  ),
  getItem(
    <Link href="/dashboard/blogs">Blogs</Link>,
    "/dashboard/blogs",
    <LuLayoutDashboard />
  ),
  getItem(
    <Link href="/dashboard/about">About</Link>,
    "/dashboard/about",
    <LuLayoutDashboard />
  ),
  getItem(
    <Link href="/dashboard/reviews">Reviews</Link>,
    "/dashboard/reviews",
    <LuLayoutDashboard />
  ),
];

const SuperAdminLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout menu={navItems}>{children}</AdminLayout>;
};

export default SuperAdminLayout;
