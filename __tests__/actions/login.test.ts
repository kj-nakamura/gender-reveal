/**
 * @jest-environment node
 */

import { login, signup } from '@/app/login/actions'

// Supabaseクライアントのモック
const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: mockSignInWithPassword,
      signUp: mockSignUp,
    }
  }))
}))

// getBaseUrlのモック
jest.mock('@/utils/get-base-url', () => ({
  getBaseUrl: jest.fn(() => 'http://localhost:3001')
}))

describe('Login Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return error when email is missing', async () => {
      const formData = new FormData()
      formData.append('password', 'password123')

      const result = await login(formData)

      expect(result).toEqual({
        success: false,
        error: 'メールアドレスとパスワードは必須です'
      })
    })

    it('should return error when password is missing', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await login(formData)

      expect(result).toEqual({
        success: false,
        error: 'メールアドレスとパスワードは必須です'
      })
    })

    it('should return success when login is successful', async () => {
      mockSignInWithPassword.mockResolvedValue({ error: null })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      const result = await login(formData)

      expect(result).toEqual({ success: true })
      expect(mockSignInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    it('should return error when login fails', async () => {
      const mockError = { message: 'Invalid credentials' }
      mockSignInWithPassword.mockResolvedValue({ error: mockError })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'wrongpassword')

      const result = await login(formData)

      expect(result).toEqual({
        success: false,
        error: 'ログインに失敗しました: Invalid credentials'
      })
    })
  })

  describe('signup', () => {
    it('should return error when email is missing', async () => {
      const formData = new FormData()
      formData.append('password', 'password123')

      const result = await signup(formData)

      expect(result).toEqual({
        success: false,
        error: 'メールアドレスとパスワードは必須です'
      })
    })

    it('should return success when signup is successful', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { email_confirmed_at: new Date() } },
        error: null
      })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      const result = await signup(formData)

      expect(result).toEqual({
        success: true,
        message: '新規登録が完了しました'
      })
    })

    it('should handle user already registered error', async () => {
      const mockError = { message: 'User already registered' }
      mockSignUp.mockResolvedValue({ error: mockError })

      const formData = new FormData()
      formData.append('email', 'existing@example.com')
      formData.append('password', 'password123')

      const result = await signup(formData)

      expect(result).toEqual({
        success: false,
        error: '既に登録済みのメールアドレスです。パスワードリセットを使用してパスワードを設定してください。'
      })
    })
  })
})