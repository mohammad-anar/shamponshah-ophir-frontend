import { redirect } from "next/navigation";

export default function BecomeVendorPage() {
  redirect("/signup?role=vendor");
}
