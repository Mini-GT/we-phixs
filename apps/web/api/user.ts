import { type User } from "@repo/types"

export const getUsers = async (): Promise<User[]> => {
  const user = await fetch(`${process.env.API_URL}/users`)
  return user.json()
}