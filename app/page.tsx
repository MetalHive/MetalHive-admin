import { redirect } from "next/navigation";

// The admin app lives under /dashboard; the root simply sends you there.
export default function Page() {
  redirect("/dashboard");
}
