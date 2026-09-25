export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3
    },
    {
      name: 'price',
      title: 'Price (₦)',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required()
    },
    {
      name: 'images',
      title: 'Product Images',
      description: 'First image is used as the main/cover photo; any additional ones appear as thumbnails on the product page.',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: Rule => Rule.required().min(1)
    },
    {
      name: 'stock',
      title: 'Stock Quantity',
      type: 'number',
      initialValue: 10
    }
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price'
    },
    prepare(selection) {
      const { title, media, price } = selection
      return {
        title: `${title} - ₦${price?.toLocaleString()}`,
        media
      }
    }
  }
}
