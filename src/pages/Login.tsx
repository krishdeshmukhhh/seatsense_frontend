import { SignIn } from '@clerk/clerk-react'
import React from 'react'

export default function login() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn />
    </div>
  )
}
