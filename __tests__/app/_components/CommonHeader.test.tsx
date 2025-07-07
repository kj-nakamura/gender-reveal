import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CommonHeader from '@/app/_components/CommonHeader'

const mockPush = jest.fn()

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock siteConfig
jest.mock('@/config/site', () => ({
  siteConfig: {
    name: 'ジェンダーリビール'
  }
}))

// Mock Supabase client
const mockGetUser = jest.fn()
const mockOnAuthStateChange = jest.fn()
const mockUnsubscribe = jest.fn()

jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: mockGetUser,
      onAuthStateChange: mockOnAuthStateChange
    }
  })
}))

describe('CommonHeader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockOnAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: mockUnsubscribe } }
    })
  })

  it('should render header with title', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<CommonHeader />)
    expect(screen.getByText('ジェンダーリビール')).toBeInTheDocument()
  })

  it('should have proper styling classes', () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const { container } = render(<CommonHeader />)
    const header = container.querySelector('header')
    expect(header).toHaveClass('bg-white/80')
    expect(header).toHaveClass('backdrop-blur-sm')
    expect(header).toHaveClass('shadow-sm')
  })

  it('should hide auth button when showAuthButton is false', () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<CommonHeader showAuthButton={false} />)
    expect(screen.queryByText('ログイン')).not.toBeInTheDocument()
  })

  it('should show login button when user is not logged in', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<CommonHeader />)
    
    await waitFor(() => {
      expect(screen.getByText('ログイン')).toBeInTheDocument()
    })
  })

  it('should show mypage button and avatar when user is logged in', async () => {
    const mockUser = { email: 'test@example.com' }
    mockGetUser.mockResolvedValue({ data: { user: mockUser } })
    
    render(<CommonHeader />)
    
    await waitFor(() => {
      expect(screen.getByText('マイページ')).toBeInTheDocument()
      expect(screen.getByText('T')).toBeInTheDocument() // First letter of email
    })
  })

  it('should navigate to login page when login button is clicked', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<CommonHeader />)
    
    await waitFor(() => {
      const loginButton = screen.getByText('ログイン')
      fireEvent.click(loginButton)
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should navigate to mypage when mypage button is clicked', async () => {
    const mockUser = { email: 'test@example.com' }
    mockGetUser.mockResolvedValue({ data: { user: mockUser } })
    
    render(<CommonHeader />)
    
    await waitFor(() => {
      const mypageButton = screen.getByText('マイページ')
      fireEvent.click(mypageButton)
      expect(mockPush).toHaveBeenCalledWith('/mypage')
    })
  })

  it('should navigate to home when logo is clicked', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    render(<CommonHeader />)
    
    const logoButton = screen.getByText('ジェンダーリビール')
    fireEvent.click(logoButton)
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('should update user state on auth state change', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    
    render(<CommonHeader />)
    
    // Wait for initial render
    await waitFor(() => {
      expect(screen.getByText('ログイン')).toBeInTheDocument()
    })
    
    // Simulate auth state change callback
    const authCallback = mockOnAuthStateChange.mock.calls[0][0]
    const mockSession = { user: { email: 'new@example.com' } }
    
    authCallback('SIGNED_IN', mockSession)
    
    await waitFor(() => {
      expect(screen.getByText('マイページ')).toBeInTheDocument()
    })
  })

  it('should generate consistent avatar color from email', async () => {
    const mockUser = { email: 'test@example.com' }
    mockGetUser.mockResolvedValue({ data: { user: mockUser } })
    
    const { container } = render(<CommonHeader />)
    
    await waitFor(() => {
      const avatar = container.querySelector('.w-10.h-10')
      expect(avatar).toBeInTheDocument()
      expect(avatar?.className).toMatch(/bg-\w+-500/)
    })
  })

  it('should handle user with no email for avatar', async () => {
    const mockUser = { email: null }
    mockGetUser.mockResolvedValue({ data: { user: mockUser } })
    
    render(<CommonHeader />)
    
    await waitFor(() => {
      expect(screen.getByText('U')).toBeInTheDocument() // Default 'U' for no email
    })
  })

  it('should unsubscribe from auth state changes on unmount', () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const { unmount } = render(<CommonHeader />)
    
    unmount()
    
    expect(mockUnsubscribe).toHaveBeenCalled()
  })
})