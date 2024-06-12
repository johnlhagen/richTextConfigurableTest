import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'complexPost',
  title: 'Complex Post',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'richTextCustom',
      options: {
        // Core of this PoC, setting these options enables/disables features within this custom rich text data type
        marks: true,
        styles: true,
        lists: true,
        simpleVideo: true,
        iconGrid: true,
        linkGeneric: true,
      },
    }),
  ],
})
