import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID || '96k29yu8'
const dataset = 'production'
const apiVersion = '2024-01-01'

let client
let builder

if (!projectId) {
  console.warn('VITE_SANITY_PROJECT_ID is not set. Sanity data will be unavailable.')
  client = {
    fetch: async () => [],
  }
} else {
  console.log('Connecting to Sanity with project ID:', projectId)
  client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
  })
  builder = imageUrlBuilder(client)
  console.log('Sanity client created successfully')
}

export const urlFor = (source) => {
  if (!builder) {
    console.warn('Image builder not initialized, source:', source)
    return {
      url: () => null,
      width: () => ({ url: () => null }),
      height: () => ({ url: () => null })
    }
  }
  if (!source) {
    console.warn('No source provided to urlFor')
    return {
      url: () => null,
      width: () => ({ url: () => null }),
      height: () => ({ url: () => null })
    }
  }
  try {
    const imageBuilder = builder.image(source)
    console.log('Image builder created for source:', source)
    return imageBuilder
  } catch (error) {
    console.error('Error creating image builder:', error, 'source:', source)
    return {
      url: () => null,
      width: () => ({ url: () => null }),
      height: () => ({ url: () => null })
    }
  }
}

export default client
