import * as React from 'react'
import type {Metadata} from 'next'
import PageList from '@/components/PageList'
import columns from "@/app/(dashboard)/clients/columns";

const title = 'Clients'
const entity = 'client'

export const metadata: Metadata = {
  title,
  description: title,
}

export default function Page() {
  return (
    <PageList title={title} entity={entity} columns={columns}></PageList>
  )
}
