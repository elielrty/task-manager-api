import { HttpStatus } from '../types/global.enums.js';
import config from '../config.js'

const { auth: { api_key } } = config;

const validateAPIKey = (req, res, next) => {
  const apiKey = req.headers['api-key'];

  if (!apiKey || apiKey !== api_key) {
    return res.status(HttpStatus.Unauthorized).json({
      error: 'Chave de API inválida'
    });
  }

  next();
};

export { validateAPIKey };
