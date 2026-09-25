import ClientPage from "./ClientPage"

export async function generateStaticParams() {
  return [{ ref: "temp-ref" }]
}

export default function OrderPage() {
  return <ClientPage />
}