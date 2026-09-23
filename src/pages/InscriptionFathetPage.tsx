// src/pages/InscriptionFathetPage.tsx

import { useSearchParams } from "react-router-dom";
import { PublicInquiryForm } from "../shared/components/PublicInquiryForm";

export default function InscriptionFathetPage() {
  const [searchParams] = useSearchParams();
  const programme = searchParams.get("programme") ?? undefined;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <PublicInquiryForm section="FATHET" defaultProgramOfInterest={programme} />
    </div>
  );
}