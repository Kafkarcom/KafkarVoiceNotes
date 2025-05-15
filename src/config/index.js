// src/config/index.js
import config from './config.json';

class Config {
  constructor() {
    this.config = {
      ...config,
      //override with environment variables if available
      baseURL: process.env.REACT_APP_API_URL || config.baseURL
    };
  }

  get(key) {
    return this.config[key];
  }

  getAll() {
    return this.config;
  }
}

export default new Config();
