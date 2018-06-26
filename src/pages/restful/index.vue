<template>
  <div class="container">
    <div>
      <h3>RESTful</h3>
      <card :text="user.id"></card>
      <card :text="user.name"></card>
      <card :text="user.gender"></card>
      <card :text="user.age"></card>
      <card :text="user.created_at"></card>
      <card :text="user.updated_at"></card>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import fetch from '@/adapter/fetch'
import headers from '@/adapter/headers'

import { execute, makePromise } from 'apollo-link'
import { RestLink } from 'apollo-link-rest'
import gql from 'graphql-tag'

global.Headers = headers // FIXME: apollo-link-rest 目前依赖全局的 Headers

const uri = 'http://127.0.0.1:7001/api/'
const link = new RestLink({
  uri,
  customFetch: fetch
})

const operation = {
  query: gql`query {
    getUser(id: 1) @rest(type: "User", path: "v1/user/:id") {
      id
      name
      gender
      age
      created_at
      updated_at
    }
   }`,
  variables: {} // optional
  // operationName: {} // optional
  // context: {} // optional
  // extensions: {} // optional
}

export default {
  // data props to component
  data: () => ({
    user: Object
  }),

  components: {
    card
  },

  mounted () {
    // For single execution operations, a Promise can be used
    makePromise(execute(link, operation))
      .then(({data}) => {
        this.user = data.getUser
      })
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.button {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
