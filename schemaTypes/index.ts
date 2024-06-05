import richTextCustom from './richTextCustom'
import simplePost from './simplePost'
import complexPost from './complexPost'
import {defineField, defineType} from 'sanity'

export const schemaTypes = [
  richTextCustom,
  simplePost,
  complexPost,
  defineType({
    name: 'iconGrid',
    type: 'object',
    fields: [defineField({name: 'hereBeActualField', type: 'boolean'})],
  }),
  defineType({
    name: 'linkGeneric',
    type: 'object',
    fields: [defineField({name: 'hereBeActualField', type: 'boolean'})],
  }),
  defineType({
    name: 'simpleVideo',
    type: 'object',
    fields: [defineField({name: 'hereBeActualField', type: 'boolean'})],
  }),
]
