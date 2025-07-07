import { render, screen, fireEvent } from '@testing-library/react'
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
    expect(screen.getByText('Ready to pop?')).toBeInTheDocument()
    expect(screen.getByText('風船をわる！')).toBeInTheDocument()
  })

  it('should show balloon animation when button is clicked', () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    expect(screen.getByText("It's a ...")).toBeInTheDocument()
    expect(screen.getAllByText('🎈')).toHaveLength(3)
    expect(screen.getByText('Boy! ♂')).toBeInTheDocument()
  })

  it('should show correct result for girl', () => {
    render(<TemplateB gender="girl" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    expect(screen.getByText("It's a ...")).toBeInTheDocument()
    expect(screen.getByText('Girl! ♀')).toBeInTheDocument()
  })

  it('should apply correct CSS classes for boy result', () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    const resultText = screen.getByText('Boy! ♂')
    expect(resultText).toHaveClass('result-text')
    expect(resultText).toHaveClass('boy')
  })

  it('should apply correct CSS classes for girl result', () => {
    render(<TemplateB gender="girl" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    const resultText = screen.getByText('Girl! ♀')
    expect(resultText).toHaveClass('result-text')
    expect(resultText).toHaveClass('girl')
  })

  it('should show balloon animation after revealing', () => {
    const { container } = render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    const balloonAnimation = container.querySelector('.balloon-animation')
    expect(balloonAnimation).toBeInTheDocument()
    
    const balloons = container.querySelectorAll('.balloon')
    expect(balloons).toHaveLength(3)
  })

  it('should have mobile layout wrapper', () => {
    render(<TemplateB gender="boy" />)
    expect(screen.getByTestId('mobile-layout')).toBeInTheDocument()
  })

  it('should handle unknown gender gracefully', () => {
    render(<TemplateB gender="unknown" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    expect(screen.getByText("It's a ...")).toBeInTheDocument()
    expect(screen.getByText('Girl! ♀')).toBeInTheDocument() // Default fallback text
  })

  it('should not show revealed view initially', () => {
    render(<TemplateB gender="boy" />)
    
    expect(screen.queryByText("It's a ...")).not.toBeInTheDocument()
    expect(screen.queryByText('Boy! ♂')).not.toBeInTheDocument()
  })

  it('should not show initial view after revealing', () => {
    render(<TemplateB gender="boy" />)
    
    const button = screen.getByText('風船をわる！')
    fireEvent.click(button)
    
    expect(screen.queryByText('Ready to pop?')).not.toBeInTheDocument()
    expect(screen.queryByText('風船をわる！')).not.toBeInTheDocument()
  })
})