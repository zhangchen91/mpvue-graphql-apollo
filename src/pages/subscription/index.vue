<template>
  <div class="container">
    <div>
      <h3>Message: {{ message }}</h3>
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
import websocket from '@/adapter/websocket'

import { SubscriptionClient } from 'subscriptions-transport-ws'
import gql from 'graphql-tag'

const client = new SubscriptionClient('ws://127.0.0.1:5000/subscription', {
  reconnect: true
}, websocket)

const operation = {
  query: gql`subscription {
    userChanged {
      message
      data {
        id
        name
        gender
        age
        created_at
        updated_at
      }
    }
  }`
}

export default {
  components: {
    card
  },

  data: () => ({
    message: String,
    user: Object
  }),

  mounted () {
    client.request(operation).subscribe({
      next: ({data}) => {
        const { message, data: user } = data.userChanged
        this.user = user
        this.message = message
      },
      error: (error) => error,
      complete: () => {}
    })
  }
}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

.log-item {
  margin: 10rpx;
}
</style>
