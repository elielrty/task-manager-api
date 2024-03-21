const notFoundHandler = (req, res, next) => {
  // returns 403 if not found router (default is 404)
  next(new AppError('Forbidden', null, 403))
}

export { notFoundHandler }
