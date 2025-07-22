import RegisterPage from "@/features/auth/pages/register-page"
import {Suspense} from "react";

export default function Page() {
  return(
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterPage />
      </Suspense>
  )
}
