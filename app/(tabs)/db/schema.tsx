import { appSchema, tableSchema } from '@nozbe/watermelondb'

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'userprofile',
      columns: [
        { name: 'firstName', type: 'string' },
        { name: 'lastName', type: 'string', isOptional: true },
        { name: 'aboutme', type: 'string' },
        { name: 'city', type: 'string' },
        { name: 'dob', type: 'string' },
        { name: 'email', type: 'string' },
        { name: 'phone', type: 'string' },
        { name: 'gender', type: 'string' },
        { name: 'profilePicture', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'category',
      columns: [
        { name: 'name', type: 'string' },
      ]
    }),
    tableSchema({
      name: 'subcategory',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'category_id', type: 'string', isIndexed: true }
      ]
    }),
    tableSchema({
      name: 'questions',
      columns: [
        { name: 'question', type: 'string' },
        { name: 'controltype', type: 'string' },
        { name: 'key', type: 'string' },
        { name: 'data', type: 'string' },
        { name: 'subcategory_id', type: 'string', isIndexed: true }
      ]
    })
  ]
})