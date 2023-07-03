export const appConfig = {
  express: {
    mode: process.env.NODE_ENV || 'development',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 1313,
    apiRoot: 'api',
  },
};
