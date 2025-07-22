import EmailConfirmationPage from "@/features/auth/pages/email-confirmation-page"
import {Suspense} from "react";

export default function Page() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <EmailConfirmationPage />
      </Suspense>
  );
}
