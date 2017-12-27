import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean
} from 'graphql'

export let AdminType = new GraphQLObjectType({
  name: 'Admin',
  fields: {
    _id: {
      type: GraphQLID
    },
    nickname: {
      type: GraphQLString
    },
    headimgurl: {
      type: GraphQLString
    },
    role: {
      type: GraphQLString
    },
    email: {
      type: GraphQLString
    },
    token: {
      type: GraphQLString
    },
    success: {
      type: GraphQLBoolean
    }
  }
})
