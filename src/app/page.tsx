import { redirect } from "next/navigation";

// Single-profile site for now: the home page is the owner's profile.
export default function Home() {
  redirect(`/${process.env.DEFAULT_USERNAME ?? "omar"}`);
}
