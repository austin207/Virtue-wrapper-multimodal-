export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
  preferences: {
    defaultModel: string
    theme: "light" | "dark"
    history: boolean
  }
}

export interface ChatMessage {
  id: string
  userId: string
  content: string
  role: "user" | "assistant"
  model: string
  timestamp: Date
}

// In-memory storage
const users: User[] = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    createdAt: new Date(),
    preferences: {
      defaultModel: "gpt-4o",
      theme: "dark",
      history: true,
    },
  },
]

const chatHistory: Record<string, ChatMessage[]> = {
  "1": [], // Empty chat history for demo user
}

// User methods
export const getUser = (id: string): User | undefined => {
  return users.find((user) => user.id === id)
}

export const createUser = (userData: Omit<User, "id" | "createdAt">): User => {
  const newUser: User = {
    id: Date.now().toString(),
    createdAt: new Date(),
    ...userData,
  }

  users.push(newUser)
  chatHistory[newUser.id] = []

  return newUser
}

export const updateUserPreferences = (userId: string, preferences: Partial<User["preferences"]>): User | undefined => {
  const userIndex = users.findIndex((user) => user.id === userId)
  if (userIndex === -1) return undefined

  users[userIndex] = {
    ...users[userIndex],
    preferences: {
      ...users[userIndex].preferences,
      ...preferences,
    },
  }

  return users[userIndex]
}

// Chat methods
export const getChatHistory = (userId: string): ChatMessage[] => {
  return chatHistory[userId] || []
}

export const addChatMessage = (message: Omit<ChatMessage, "id" | "timestamp">): ChatMessage => {
  const newMessage: ChatMessage = {
    id: Date.now().toString(),
    timestamp: new Date(),
    ...message,
  }

  if (!chatHistory[message.userId]) {
    chatHistory[message.userId] = []
  }

  chatHistory[message.userId].push(newMessage)
  return newMessage
}

export const clearChatHistory = (userId: string): void => {
  chatHistory[userId] = []
}

// For demo purposes, get the first user
export const getCurrentUser = (): User => {
  return users[0]
}

