import * as React from 'react'
import type {Metadata} from "next";
import PageList from "@/components/PageList";

export const metadata: Metadata = {
  title: "Clients",
  description: "Clients",
}

export default function Page() {
  return (
    <PageList></PageList>
  )
}
