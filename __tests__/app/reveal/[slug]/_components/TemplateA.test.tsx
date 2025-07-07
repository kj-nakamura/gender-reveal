import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import TemplateA from '@/app/reveal/[slug]/_components/TemplateA'

// Mock MobileLayout
jest.mock('@/app/_components/MobileLayout', () => {
  return function MockMobileLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="mobile-layout">{children}</div>
  }
})

// Mock CSS import
jest.mock('@/app/reveal/[slug]/_components/TemplateA.css', () => {})

describe('TemplateA', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render without crashing for boy', () => {
    const { container } = render(<TemplateA gender="boy" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('should render without crashing for girl', () => {
    const { container } = render(<TemplateA gender="girl" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('should have container element', () => {
    const { container } = render(<TemplateA gender="boy" />)
    const templateContainer = container.querySelector('.template-a-container')
    expect(templateContainer).toBeInTheDocument()
  })

  it('should render initial view for boy', () => {
    render(<TemplateA gender="boy" />)
    expect(screen.getByText('性別を発表するよ！')).toBeInTheDocument()
    expect(screen.getByText('タップしてね')).toBeInTheDocument()
  })

  it('should render initial view for girl', () => {
    render(<TemplateA gender="girl" />)
    expect(screen.getByText('性別を発表するよ！')).toBeInTheDocument()
    expect(screen.getByText('タップしてね')).toBeInTheDocument()
  })

  it('should reveal boy result when button is clicked', () => {
    render(<TemplateA gender="boy" />)
    
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    expect(screen.getByText("It's a ...")).toBeInTheDocument()
    expect(screen.getByText('Boy! ♂')).toBeInTheDocument()
  })

  it('should play girl animation when button is clicked', () => {
    render(<TemplateA gender="girl" />)
    
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    expect(screen.getByAltText('Gender Reveal Animation')).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/reveal-girl.gif')
  })

  it('should return to initial view after animation timeout for girl', async () => {
    render(<TemplateA gender="girl" />)
    
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    // Should show animation
    expect(screen.getByAltText('Gender Reveal Animation')).toBeInTheDocument()
    
    // Fast-forward time by 21 seconds
    act(() => {
      jest.advanceTimersByTime(21000)
    })
    
    // Should return to initial view
    await waitFor(() => {
      expect(screen.getByText('性別を発表するよ！')).toBeInTheDocument()
      expect(screen.getByText('タップしてね')).toBeInTheDocument()
    })
  })

  it('should handle gif loading error', () => {
    render(<TemplateA gender="girl" />)
    
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    const gif = screen.getByAltText('Gender Reveal Animation')
    fireEvent.error(gif)
    
    // Fast-forward to return to initial view
    act(() => {
      jest.advanceTimersByTime(21000)
    })
    
    expect(screen.getByText(/アニメーションの読み込みに失敗しました。/)).toBeInTheDocument()
    expect(screen.getByText(/再度お試しください。/)).toBeInTheDocument()
  })

  it('should reset gif error when button is clicked again', () => {
    render(<TemplateA gender="girl" />)
    
    // Click first time
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    // Trigger error
    const gif = screen.getByAltText('Gender Reveal Animation')
    fireEvent.error(gif)
    
    // Return to initial view
    act(() => {
      jest.advanceTimersByTime(21000)
    })
    
    // Click again - should reset error
    const newButton = screen.getByText('タップしてね')
    fireEvent.click(newButton)
    
    // Should show animation again without error message
    expect(screen.getByAltText('Gender Reveal Animation')).toBeInTheDocument()
    expect(screen.queryByText('アニメーションの読み込みに失敗しました。')).not.toBeInTheDocument()
  })

  it('should have mobile layout wrapper', () => {
    render(<TemplateA gender="boy" />)
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
  })

  it('should apply correct CSS classes for boy result', () => {
    render(<TemplateA gender="boy" />)
    
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    const resultText = screen.getByText('Boy! ♂')
    expect(resultText).toHaveClass('result-text-a')
    expect(resultText).toHaveClass('boy')
  })

  it('should handle unknown gender gracefully', () => {
    render(<TemplateA gender="unknown" />)
    
    const button = screen.getByText('タップしてね')
    fireEvent.click(button)
    
    // Should show revealed view for non-girl gender
    expect(screen.getByText("It's a ...")).toBeInTheDocument()
    expect(screen.getByText('Girl! ♀')).toBeInTheDocument() // Default fallback text
  })
})