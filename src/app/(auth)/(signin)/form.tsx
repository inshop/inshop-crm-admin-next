'use client'

import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthControllerLoginMutation } from '@/lib/redux/features/auth'

export default function Form() {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('')
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
  const [submitError, setSubmitError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const router = useRouter()
  const [login] = useAuthControllerLoginMutation()

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement
    const password = document.getElementById('password') as HTMLInputElement

    let isValid = true

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Password must be at least 6 characters long.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }

    return isValid
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitError(null)

    // validate before submit
    if (!validateInputs()) {
      return
    }

    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '')
    const password = String(data.get('password') || '')

    try {
      setIsSubmitting(true)
      const res = await login({ loginAuthDto: { email, password } }).unwrap()
      // Expect token in response - try common keys
      const token =
        (res && (res as any).token) || (res && (res as any).accessToken) || null

      if (!token) {
        throw new Error('Invalid response: no token provided')
      }

      // Save token into cookie (client-side)
      // Set cookie for the whole site; adjust attributes as needed
      document.cookie = `token=${encodeURIComponent(token)}; Path=/; SameSite=Lax` // consider Secure if served over HTTPS

      // redirect to homepage
      router.replace('/clients')
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || 'Login failed'
      setSubmitError(Array.isArray(msg) ? msg.join(', ') : String(msg))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <TextField
            error={emailError}
            helperText={emailErrorMessage}
            id="email"
            type="email"
            name="email"
            placeholder="Your email"
            autoComplete="email"
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={emailError ? 'error' : 'primary'}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password">Password</FormLabel>
          <TextField
            error={passwordError}
            helperText={passwordErrorMessage}
            name="password"
            placeholder="Your password"
            type="password"
            id="password"
            autoComplete="current-password"
            required
            fullWidth
            variant="outlined"
            color={passwordError ? 'error' : 'primary'}
          />
        </FormControl>
        {submitError && (
          <Typography color="error" variant="body2">
            {submitError}
          </Typography>
        )}
        <Button type="submit" fullWidth variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <Link
          href="/reset-password"
          component={NextLink}
          type="button"
          variant="body2"
          sx={{ alignSelf: 'center' }}
        >
          Forgot your password?
        </Link>
      </Box>
    </>
  )
}
