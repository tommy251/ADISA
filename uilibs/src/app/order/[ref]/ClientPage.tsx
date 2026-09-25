"use client"

import { useParams, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import OrderConfirmationClient from "@/components/site/OrderConfirmationClient"

// We move the logic that uses useSearchParams into its own component
function OrderContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  
  const ref = params.ref as string
  const demo = searchParams.get("demo") === "1" || searchParams.get("demo") === "true"

  return <OrderConfirmationClient refPromise={Promise.resolve({ ref, demo })} />
}

// The main component wraps it in a Suspense boundary
export default function ClientPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading order details...</div>}>
      <OrderContent />
    </Suspense>
  )
}