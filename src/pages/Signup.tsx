import { SignUp } from '@clerk/clerk-react'
import React from 'react'

export default function signUp() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignUp />
    </div>
  )
}
