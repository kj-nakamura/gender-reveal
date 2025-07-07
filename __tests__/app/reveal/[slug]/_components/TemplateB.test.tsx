import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import TemplateB from '@/app/reveal/[slug]/_components/TemplateB'

// Mock MobileLayout
jest.mock('@/app/_components/MobileLayout', () => {
  return function MockMobileLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="mobile-layout">{children}</div>
  }
})

// Mock CSS import
jest.mock('@/app/reveal/[slug]/_components/TemplateB.css', () => {})

describe('TemplateB', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should render without crashing for boy', () => {
    const { container } = render(<TemplateB gender="boy" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('should render without crashing for girl', () => {
    const { container } = render(<TemplateB gender="girl" />)
    expect(container.firstChild).toBeTruthy()
  })

  it('should have container element', () => {
    const { container } = render(<TemplateB gender="boy" />)
    const templateContainer = container.querySelector('.template-b-container')
    expect(templateContainer).toBeInTheDocument()
  })

  it('should render initial view with balloon button', () => {
    render(<TemplateB gender="boy" />)
    expect(screen.getByText('性別を発表するよ！')).toBeInTheDocument()
    expect(screen.getByText('風船を割る🎈')).toBeInTheDocument()
  })

  it('should show countdown when button is clicked', () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    expect(screen.getByText('カウントダウン')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('風船が割れるまで...')).toBeInTheDocument()
  })

  it('should complete countdown and show reveal', async () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Should start with 3
    expect(screen.getByText('3')).toBeInTheDocument()
    
    // Fast forward through entire countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('2')).toBeInTheDocument()
    
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    expect(screen.getByText('1')).toBeInTheDocument()
    
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText("性別は...")).toBeInTheDocument()
      expect(screen.getAllByText('🎈')).toHaveLength(8)
      expect(screen.getByText('男の子! ♂')).toBeInTheDocument()
    })
  })

  it('should return to initial view after 20 seconds', async () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Complete countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    // Should show reveal
    await waitFor(() => {
      expect(screen.getByText("性別は...")).toBeInTheDocument()
    })
    
    // After 20 seconds, should return to initial view
    act(() => {
      jest.advanceTimersByTime(20000)
    })
    
    await waitFor(() => {
      expect(screen.getByText('性別を発表するよ！')).toBeInTheDocument()
      expect(screen.getByText('風船を割る🎈')).toBeInTheDocument()
    })
  })

  it('should show correct result for girl after countdown', async () => {
    render(<TemplateB gender="girl" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Complete countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText("性別は...")).toBeInTheDocument()
      expect(screen.getByText('女の子! ♀')).toBeInTheDocument()
    })
  })

  it('should apply correct CSS classes for boy result', async () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Complete countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      const resultText = screen.getByText('男の子! ♂')
      expect(resultText).toHaveClass('result-text')
      expect(resultText).toHaveClass('boy')
    })
  })

  it('should apply correct CSS classes for girl result', async () => {
    render(<TemplateB gender="girl" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Complete countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      const resultText = screen.getByText('女の子! ♀')
      expect(resultText).toHaveClass('result-text')
      expect(resultText).toHaveClass('girl')
    })
  })

  it('should show balloon animation after revealing', async () => {
    const { container } = render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Complete countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      const balloonAnimation = container.querySelector('.balloon-animation')
      expect(balloonAnimation).toBeInTheDocument()
      
      const balloons = container.querySelectorAll('.balloon')
      expect(balloons).toHaveLength(8)
    })
  })

  it('should have mobile layout wrapper', () => {
    render(<TemplateB gender="boy" />)
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
  })

  it('should handle unknown gender gracefully', async () => {
    render(<TemplateB gender="unknown" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    // Complete countdown step by step
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    act(() => {
      jest.advanceTimersByTime(1000)
    })
    
    await waitFor(() => {
      expect(screen.getByText("性別は...")).toBeInTheDocument()
      expect(screen.getByText('女の子! ♀')).toBeInTheDocument() // Default fallback text
    })
  })

  it('should not show revealed view initially', () => {
    render(<TemplateB gender="boy" />)
    
    expect(screen.queryByText("It's a ...")).not.toBeInTheDocument()
    expect(screen.queryByText('男の子! ♂')).not.toBeInTheDocument()
  })

  it('should not show initial view during countdown', () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船を割る🎈')
    fireEvent.click(button)
    
    expect(screen.queryByText('性別を発表するよ！')).not.toBeInTheDocument()
    expect(screen.queryByText('風船を割る🎈')).not.toBeInTheDocument()
    expect(screen.getByText('カウントダウン')).toBeInTheDocument()
  })
})