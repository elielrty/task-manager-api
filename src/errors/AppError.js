class AppError extends Error {
  name
  message
  status
  error

  constructor(message, error, status = 400, name = 'Error') {
    super(name)
    this.message = message
    this.status = status
    this.error = error
  }
}

export default AppError
