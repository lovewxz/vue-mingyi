import { controller, post, get } from '../../lib/decorator/router'
import { graphqlKoa, graphiqlKoa } from 'graphql-server-koa'
import schema from '../../graphql/schema'

@controller('')
export class GraphqlController {
  @get('graphiql')
  async getGraphiqlKoa(ctx, next) {
    await graphiqlKoa({
      endpointURL: '/graphql'
    })(ctx, next)
  }

  @post('graphql')
  async getGraphql(ctx, next) {
    await graphqlKoa({
      schema
    })(ctx, next)
  }

  @get('graphql')
  async getGraphql(ctx, next) {
    await graphqlKoa({
      schema
    })(ctx, next)
  }
}
