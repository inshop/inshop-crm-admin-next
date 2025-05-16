import * as React from 'react'
import Form from "@/app/auth/signin/form";
import type {Metadata} from "next";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in",
}

export default function SignIn() {
  return (
    <Form></Form>
  )
}
