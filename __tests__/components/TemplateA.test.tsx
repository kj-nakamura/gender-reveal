import { render } from '@testing-library/react'
import TemplateA from '@/app/reveal/[slug]/_components/TemplateA'

describe('TemplateA', () => {
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
})