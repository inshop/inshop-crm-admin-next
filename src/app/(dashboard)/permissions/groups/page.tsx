import * as React from 'react'
import type {Metadata} from "next";
import PageList from "@/components/PageList";
import columns from "@/app/(dashboard)/permissions/groups/columns";

const title = 'Groups'
const entity = 'group'

export const metadata: Metadata = {
  title,
  description: title,
}

export default function Page() {
  return (
    <PageList title={title} entity={entity} columns={columns}></PageList>
  )
}
