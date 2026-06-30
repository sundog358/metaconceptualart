import type { Metadata } from "next";
import ProfileSpec from "./ProfileSpec";

export const metadata: Metadata = {
  title: "Linked Open Art Profile",
  description:
    "The Metaconceptual Art application profile for Linked Art, IIIF, JSON-LD, SHACL, and linked open data conformance.",
  alternates: { canonical: "/profile/1.0/" },
};

export default function ProfilePage() {
  return <ProfileSpec />;
}
