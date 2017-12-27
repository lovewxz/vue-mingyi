import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString
} from 'graphql'
import {
  AdminType
} from './model'
import api from '../../api'
import jwt from '../../util/jwt'

const users = {
  type: new GraphQLList(AdminType),
  args: {},
  async resolve(root, params, options) {
    return await api.admin.getAdminList()
  }
}

const login = {
  type: AdminType,
  args: {
    email: {
      name: 'email',
      type: new GraphQLNonNull(GraphQLString)
    },
    password: {
      name: 'password',
      type: new GraphQLNonNull(GraphQLString)
    }
  },
  async resolve(root, params, options) {
    let { match, admin } = await api.admin.login(params.email, params.password)
    if (match) {
      const signParams = {
        id: admin._id,
        role: admin.role
      }
      admin.token = jwt.createToken(signParams)
      admin = await api.admin.update(admin)
      admin.success = true
      return admin
    }
    return match
  }
}

export default {
  users,
  login
}
