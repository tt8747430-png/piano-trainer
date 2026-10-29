/** The shortest password an account takes: the server's rule, said before asking it. */
export const MIN_PASSWORD = 8

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** What is wrong with a typed email (a key of `account:invalid`), if anything. */
export const emailProblem = (email: string): 'email' | undefined =>
  EMAIL.test(email.trim()) ? undefined : 'email'

/** What is wrong with a new password, if anything. */
export const passwordProblem = (password: string): 'password' | undefined =>
  password.length >= MIN_PASSWORD ? undefined : 'password'
