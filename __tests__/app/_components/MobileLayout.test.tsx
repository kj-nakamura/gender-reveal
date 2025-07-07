import { render } from '@testing-library/react'
import MobileLayout from '@/app/_components/MobileLayout'

describe('MobileLayout', () => {
  it('should render children inside mobile layout container', () => {
    const { container } = render(
      <MobileLayout>
        <div data-testid="test-content">Test Content</div>
      </MobileLayout>
    )
    
    expect(container.querySelector('[data-testid="test-content"]')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <MobileLayout className="custom-class">
        <div>Content</div>
      </MobileLayout>
    )
    
    const mobileContainer = container.querySelector('.w-full.max-w-sm')
    expect(mobileContainer).toHaveClass('custom-class')
  })

  it('should have mobile layout styling', () => {
    const { container } = render(
      <MobileLayout>
        <div>Content</div>
      </MobileLayout>
    )
    
    const outerContainer = container.firstChild
    expect(outerContainer).toHaveClass('flex', 'justify-center', 'items-center', 'min-h-screen')
    
    const innerContainer = container.querySelector('.w-full.max-w-sm')
    expect(innerContainer).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg')
  })
})