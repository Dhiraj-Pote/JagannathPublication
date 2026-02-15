import { describe, it, expect } from 'vitest'

describe('Vitest setup smoke test', () => {
  it('should run a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should resolve @ path alias', async () => {
    const utils = await import('@/lib/utils')
    expect(utils).toBeDefined()
    expect(typeof utils.cn).toBe('function')
  })

  it('should have jsdom environment available', () => {
    expect(typeof document).toBe('object')
    expect(typeof window).toBe('object')
  })

  it('should have jest-dom matchers available', () => {
    const div = document.createElement('div')
    div.textContent = 'hello'
    document.body.appendChild(div)
    expect(div).toBeInTheDocument()
    document.body.removeChild(div)
  })
})
