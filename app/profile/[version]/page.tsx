import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileSpec from "../ProfileSpec";

export const metadata: Metadata = {
  title: "Linked Open Art Profile 1.0",
  description:
    "Version 1.0 of the Metaconceptual Art Linked Open Art application profile.",
  alternates: { canonical: "/profile/1.0/" },
};

export function generateStaticParams() {
  return [{ version: "1.0" }];
}

export default async function VersionedProfilePage({
  params,
}: {
  params: Promise<{ version: string }>;
}) {
  const { version } = await params;
  if (version !== "1.0") notFound();
  return <ProfileSpec version={version} />;
}
