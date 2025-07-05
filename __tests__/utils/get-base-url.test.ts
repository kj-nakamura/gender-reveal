import { getBaseUrl, getClientBaseUrl } from '@/utils/get-base-url'

describe('getBaseUrl', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('should return NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com'
    expect(getBaseUrl()).toBe('https://example.com')
  })

  it('should return VERCEL_URL with https when NEXT_PUBLIC_SITE_URL is not set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    process.env.VERCEL_URL = 'example.vercel.app'
    expect(getBaseUrl()).toBe('https://example.vercel.app')
  })

  it('should return localhost default when no env vars are set', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL
    delete process.env.VERCEL_URL
    expect(getBaseUrl()).toBe('http://localhost:3001')
  })
})

describe('getClientBaseUrl', () => {
  it('should return a valid URL', () => {
    const result = getClientBaseUrl()
    expect(typeof result).toBe('string')
    expect(result.startsWith('http')).toBe(true)
  })
})