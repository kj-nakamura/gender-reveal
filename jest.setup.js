import '@testing-library/jest-dom'
import { act } from 'react'

// Mock React.act to avoid production mode issues
global.React = {
  ...require('react'),
  act: act || ((callback) => {
    const result = callback()
    return Promise.resolve(result)
  })
}

// Set NODE_ENV to test for React development mode
process.env.NODE_ENV = 'test'

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3001'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/test-path',
  notFound: jest.fn(),
}))

// Global console error suppression for expected errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : ''
    
    // Suppress React DOM warnings
    if (message.includes('Warning: ReactDOM.render is no longer supported')) {
      return
    }
    
    // Suppress React act() warnings in tests
    if (message.includes('An update to') && message.includes('inside a test was not wrapped in act(...)')) {
      return
    }
    
    // Suppress expected login/signup errors in tests
    if (message.includes('Password login error:') || message.includes('Signup error:')) {
      return
    }
    
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})