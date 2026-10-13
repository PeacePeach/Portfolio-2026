import { redirect } from "next/navigation";
import { site } from "@/content/site";

/** The resume lives on Dropbox; /resume forwards there. */
export default function ResumePage() {
  redirect(site.resumeUrl);
}
