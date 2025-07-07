/**
 * @jest-environment node
 */

import { signInWithGoogle, sendOTPCode, verifyOTPCode, login, signup } from '@/app/login/actions'

// Supabaseクライアントのモック
const mockSignInWithOAuth = jest.fn()
const mockSignInWithOtp = jest.fn()
const mockVerifyOtp = jest.fn()
const mockSignInWithPassword = jest.fn()
const mockSignUp = jest.fn()

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signInWithOtp: mockSignInWithOtp,
      verifyOtp: mockVerifyOtp,
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
    // Suppress console.log and console.error for clean test output
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('signInWithGoogle', () => {
    it('should return success with URL when Google sign-in succeeds', async () => {
      const mockUrl = 'https://google.com/oauth'
      mockSignInWithOAuth.mockResolvedValue({
        data: { url: mockUrl },
        error: null
      })

      const result = await signInWithGoogle()

      expect(result).toEqual({ success: true, url: mockUrl })
      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3001/auth/callback'
        }
      })
    })

    it('should return error when Google sign-in fails', async () => {
      mockSignInWithOAuth.mockResolvedValue({
        data: null,
        error: { message: 'OAuth error' }
      })

      const result = await signInWithGoogle()

      expect(result).toEqual({
        success: false,
        error: 'Googleログインに失敗しました'
      })
    })
  })

  describe('sendOTPCode', () => {
    it('should send OTP successfully', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      mockSignInWithOtp.mockResolvedValue({
        data: { user: { email: 'test@example.com' } },
        error: null
      })

      const result = await sendOTPCode(formData)

      expect(result).toEqual({
        success: true,
        email: 'test@example.com'
      })
      expect(mockSignInWithOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        options: {
          shouldCreateUser: true
        }
      })
    })

    it('should return error when email is not provided', async () => {
      const formData = new FormData()

      const result = await sendOTPCode(formData)

      expect(result).toEqual({
        success: false,
        error: 'メールアドレスは必須です'
      })
    })

    it('should return error when OTP sending fails', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      mockSignInWithOtp.mockResolvedValue({
        data: null,
        error: { message: 'Rate limit exceeded' }
      })

      const result = await sendOTPCode(formData)

      expect(result).toEqual({
        success: false,
        error: '認証コードの送信に失敗しました: Rate limit exceeded'
      })
    })
  })

  describe('verifyOTPCode', () => {
    it('should verify OTP successfully', async () => {
      mockVerifyOtp.mockResolvedValue({ error: null })

      const result = await verifyOTPCode('test@example.com', '123456')

      expect(result).toEqual({ success: true })
      expect(mockVerifyOtp).toHaveBeenCalledWith({
        email: 'test@example.com',
        token: '123456',
        type: 'email'
      })
    })

    it('should return error when OTP verification fails', async () => {
      mockVerifyOtp.mockResolvedValue({
        error: { message: 'Invalid token' }
      })

      const result = await verifyOTPCode('test@example.com', 'invalid')

      expect(result).toEqual({
        success: false,
        error: '認証コードが正しくありません'
      })
    })
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

    it('should return error when both email and password are missing', async () => {
      const formData = new FormData()

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

    it('should return error when password is missing', async () => {
      const formData = new FormData()
      formData.append('email', 'test@example.com')

      const result = await signup(formData)

      expect(result).toEqual({
        success: false,
        error: 'メールアドレスとパスワードは必須です'
      })
    })

    it('should return error when both email and password are missing', async () => {
      const formData = new FormData()

      const result = await signup(formData)

      expect(result).toEqual({
        success: false,
        error: 'メールアドレスとパスワードは必須です'
      })
    })

    it('should return confirmation message when email is not confirmed', async () => {
      mockSignUp.mockResolvedValue({
        data: { user: { email_confirmed_at: null } },
        error: null
      })

      const formData = new FormData()
      formData.append('email', 'new@example.com')
      formData.append('password', 'password123')

      const result = await signup(formData)

      expect(result).toEqual({
        success: true,
        message: 'メールアドレスの確認を行ってください'
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

    it('should handle user already registered error with contains message', async () => {
      const mockError = { message: 'This user already registered with us' }
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

    it('should handle rate limit error', async () => {
      const mockError = { message: 'Email rate limit exceeded' }
      mockSignUp.mockResolvedValue({ error: mockError })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'password123')

      const result = await signup(formData)

      expect(result).toEqual({
        success: false,
        error: 'メール送信制限に達しています。しばらく待ってから再試行してください。'
      })
    })

    it('should handle generic signup error', async () => {
      const mockError = { message: 'Password too weak' }
      mockSignUp.mockResolvedValue({ error: mockError })

      const formData = new FormData()
      formData.append('email', 'test@example.com')
      formData.append('password', 'weak')

      const result = await signup(formData)

      expect(result).toEqual({
        success: false,
        error: '新規登録に失敗しました: Password too weak'
      })
    })
  })
})