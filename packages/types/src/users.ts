type User = {
  id: number
  name: string
  age: number
}

type DiscordUser = {
  id: string
  username: string
  global_name: string
  email: string
  avatar: string
  verified: boolean
}

export type {
  User,
  DiscordUser
}