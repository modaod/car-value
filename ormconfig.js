const { DataSource } = require('typeorm');

let config = {};

switch (process.env.NODE_ENV) {
    case 'development':
      config = {
         type: 'sqlite',
         database: 'db.sqlite',
         entities: ['dist/**/*.entity.js'],
         synchronize: false,
         logging: true,
         migrations: ['src/migrations/*.ts'],
      };
      break;
    case 'test':
      config = {
         type: 'sqlite',
         database: 'test.sqlite',
         entities: ['src/**/*.entity.ts'],
         migrationsRun: true,
      };
      break;
    case 'production':
        Object.assign(config, {
          type: 'postgres',
          url: process.env.DATABASE_URL,
          migrationsRun: true,
          entities: ['dist/**/*.entity.js'],
          ssl: {
            rejectUnauthorized: false, 
          },
        });
      break;
  default:
      throw new Error('Unknown NODE_ENV: ' + process.env.NODE_ENV);
}

module.exports = new DataSource(config);