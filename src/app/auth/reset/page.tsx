import * as React from 'react'
import type {Metadata} from "next"
import Form from "@/app/auth/reset/form"

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset password",
}

export default function SignIn() {
  return (
    <Form></Form>
  )
}
