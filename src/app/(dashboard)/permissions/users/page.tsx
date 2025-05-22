import * as React from 'react'
import type {Metadata} from "next";
import PageList from "@/components/PageList";
import columns from "@/app/(dashboard)/permissions/users/columns";

const title = 'Users'
const entity = 'user'

export const metadata: Metadata = {
  title,
  description: title,
}

export default function Page() {
  return (
    <PageList title={title} entity={entity} columns={columns}></PageList>
  )
}
