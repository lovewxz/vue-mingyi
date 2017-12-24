import {
  GraphQLObjectType,
  GraphQLSchema
} from 'graphql'

import AdminQueries from './admin/query'

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'globalQueries',
    fields: Object.assign(
      AdminQueries
    )
  })
})
