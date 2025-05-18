'use client'

import * as React from 'react'
import {useClientsControllerFindAllQuery} from "@/lib/redux/features/clients";

// export const metadata: Metadata = {
//   title: "Clients",
//   description: "Clients",
// }

export default function SignIn() {
  const { data, error, isLoading } = useClientsControllerFindAllQuery({
    take: 10,
    skip: 0
  })

  console.log('data', data, error, isLoading)

  return (
    <>Clients</>
  )
}
