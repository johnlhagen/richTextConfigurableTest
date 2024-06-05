import {defineField, defineType} from 'sanity'
import {defineRichTextCustomOptions} from './richTextCustom'

export default defineType({
  name: 'simplePost',
  title: 'Simple Post',
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'richTextCustom',
      options: defineRichTextCustomOptions({
        // Core of this PoC, setting these options enables/disables features within this custom rich text data type
        marks: false,
        styles: true,
        lists: false,
        simpleVideo: false,
        iconGrid: false,
        linkGeneric: false,
      })
    })
  ]
})