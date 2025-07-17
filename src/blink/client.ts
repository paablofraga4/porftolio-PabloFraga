import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'ai-data-science-port-ewowhgm4', // Updated to match current project ID
  authRequired: false // Public portfolio - auth only needed for admin panel
})

// Create a no-op analytics object to prevent network calls
const noOpAnalytics = {
  log: () => Promise.resolve(),
  disable: () => {},
  enable: () => {},
  isEnabled: () => false,
  clearAttribution: () => {}
}

// Override analytics with no-op implementation to prevent network errors
if (blink.analytics) {
  Object.assign(blink.analytics, noOpAnalytics)
} else {
  (blink as any).analytics = noOpAnalytics
}

export { blink }