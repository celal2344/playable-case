import LoginPage from "@/features/auth/pages/login-page"
import {Suspense} from "react";

export default function Page() {
  return(
      <Suspense fallback={<div>Loading...</div>}>
        <LoginPage />
      </Suspense>
  )
}
