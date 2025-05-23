'use client'

import * as React from 'react'
import PageList from "@/components/PageList";
import columns from "@/app/(dashboard)/permissions/users/columns";

interface ListType {
  title: string,
  entity: string,
}

export default function List({ title, entity }: ListType) {
  return (
    <PageList title={title} entity={entity} columns={columns}></PageList>
  )
}
