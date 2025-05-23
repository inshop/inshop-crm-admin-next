import * as React from 'react'
import type {Metadata} from "next";
import List from "./list";

const title = 'Users'
const entity = 'user'

export const metadata: Metadata = {
  title,
  description: title,
}

export default function Page() {
  return (
    <List title={title} entity={entity}></List>
  )
}
