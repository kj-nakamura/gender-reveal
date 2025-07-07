import { render } from '@testing-library/react'
import TemplateB from '@/app/reveal/[slug]/_components/TemplateB'

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
})