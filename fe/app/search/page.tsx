"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import SearchResults from "@/components/search/search-results"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  return <SearchResults initialQuery={query} />
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}
