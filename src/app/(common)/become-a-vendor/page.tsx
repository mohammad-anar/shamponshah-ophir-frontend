import { redirect } from "next/navigation";

export default function BecomeVendorPage() {
  redirect("/register?role=vendor");
}
