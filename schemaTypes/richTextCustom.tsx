import {
  BlockMarksDefinition,
  BlockOptions,
  BlockStyleDefinition,
  defineArrayMember,
  defineType,
} from 'sanity'

const RichTextCustomTypeComponents = ['iconGrid', 'linkGeneric', 'simpleVideo'] as const
type RichTextCustomTypeComponentName = (typeof RichTextCustomTypeComponents)[number]

type RichTextCustomOptions = Omit<BlockOptions, 'unstable_whitespaceOnPasteMode'> & {
  marks: boolean
  styles: boolean
  lists: boolean
} & Record<RichTextCustomTypeComponentName, boolean>

const DEFAULT_RICH_TEXT_CUSTOM_OPTIONS: RichTextCustomOptions = {
  marks: true,
  styles: true,
  lists: true,
  iconGrid: true,
  simpleVideo: true,
  spellCheck: true,
  linkGeneric: true,
}

const STYLES: BlockStyleDefinition[] = [
  {title: 'H1', value: 'h1'},
  {title: 'H2', value: 'h2'},
  {title: 'H3', value: 'h3'},
  {title: 'Normal', value: 'normal'},
]

const MARKS: BlockMarksDefinition = {
  annotations: [
    {
      name: 'link',
      type: 'object',
      title: 'Link',
      fields: [
        {
          name: 'url',
          type: 'url',
        },
      ],
    },
    {
      name: 'variant',
      type: 'object',
      title: 'Variant',
      icon: () => 'V',
      fields: [
        {
          name: 'value',
          type: 'string',
          options: {
            list: ['custom-variant-1', 'custom-variant-2'],
          },
          validation: (Rule) => Rule.required(),
        },
      ],
    },
  ],
  decorators: [
    {title: 'Strong', value: 'strong'},
    {title: 'Emphasis', value: 'em'},
    {title: 'Code', value: 'code'},
    {
      title: 'Highlight',
      value: 'highlight',
      icon: () => 'H',
      component: (props) => <span style={{backgroundColor: 'yellow'}}>{props.children}</span>,
    },
  ],
}

export const defineRichTextCustomOptions: (
  options: Partial<RichTextCustomOptions>,
) => Partial<RichTextCustomOptions> = (options) => options
const richTextCustom = defineType({
  name: 'richTextCustom',
  title: 'Custom Rich Text',
  type: 'array',
  components: {
    input: (props) => {
      const options: RichTextCustomOptions = {
        ...DEFAULT_RICH_TEXT_CUSTOM_OPTIONS,
        ...props.schemaType.options,
      }
      const schemaType = props.schemaType
      // console.log('😵‍💫 props', props, 'schemaType', schemaType, 'options', options)
      const modifiedSchemaType = {
        ...schemaType,
        of: schemaType.of
          .filter((type) => {
            // Filter away type components that aren't enabled in optiosn
            if (RichTextCustomTypeComponents.includes(type.name)) {
              return options[type.name]
            }
            return true
          })
          .map((type) => {
            // Handle disabling of marks
            if (type.name === 'block') {
              console.log('the block type', type)
              return {
                ...type,
                fields: type.fields.map((field) => {
                  if (field.name === 'style' && !options.styles) {
                    // Disable styles (h1/h2/...) based on options
                    return {
                      ...field,
                      type: {
                        ...field.type,
                        options: {list: [{value: 'normal', title: 'Normal'}]},
                      },
                    }
                  } else if (field.name === 'listItem' && !options.lists) {
                    // Disable lists (bullet & numbered) based on options
                    return {
                      ...field,
                      type: {
                        ...field.type,
                        options: {
                          ...field.type.options,
                          list: [],
                        },
                      },
                    }
                  } else if (field.name === 'markDefs' && !options.marks) {
                    // Disable markDefs based on marks property in options
                    // TODO This has no effect, is this correct?
                    return {
                      ...field,
                      type: {
                        ...field.type,
                        of: [],
                      },
                    }
                  } else if (field.name === 'children' && !options.marks) {
                    // Disable marks & annotations based on `marks` property in options
                    // TODO This is not documented anywhere and it's very very deep into the schemaType data structure
                    // TODO Is this OK? Is this sustainable? Will this break with sanity updates in the future?
                    return {
                      ...field,
                      type: {
                        ...field.type,
                        of: field.type.of.map((elementDefinition) => ({
                          ...elementDefinition,
                          annotations: [],
                          decorators: [],
                        })),
                      },
                    }
                  }
                  return field
                }),
              }
            }
            return type
          }),
      } as const
      // console.log('modified schemaType', modifiedSchemaType)
      return props.renderDefault({
        ...props,
        schemaType: modifiedSchemaType,
      })
    },
  },
  of: [
    defineArrayMember({
      type: 'block',
      styles: STYLES,
      marks: MARKS,
    }),
    defineArrayMember({
      type: 'simpleVideo',
    }),
    defineArrayMember({
      type: 'iconGrid',
    }),
    defineArrayMember({
      type: 'linkGeneric',
    }),
  ],
})

export default richTextCustom
