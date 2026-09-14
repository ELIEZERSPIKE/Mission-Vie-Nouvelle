import { useParams } from "react-router-dom";
import { ProtectedPdfViewer } from "../../../shared/components/ProtectedPdfViewer";
import { tokenService } from "../../../auth/tokenService";

const API_URL = import.meta.env.VITE_API_URL;

export default function ContentPreviewPage() {
  const { contentItemId } = useParams<{ contentItemId: string }>();
  const token = tokenService.getAccessToken();

  if (!contentItemId || !token) {
    return <p>Accès impossible.</p>;
  }

  return (
    <ProtectedPdfViewer
      fileUrl={`${API_URL}/content/${contentItemId}/admin`}
      authToken={token}
    />
  );
}