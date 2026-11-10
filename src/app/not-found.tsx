import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="text-2xl font-semibold">Nothing here</h1>
      <p className="mt-2 text-muted">This page doesn&apos;t exist, or the list isn&apos;t shared.</p>
      <Link href="/" className="mt-6 inline-block font-medium text-accent underline-offset-4 hover:underline">
        Go to the home page
      </Link>
    </div>
  );
}
