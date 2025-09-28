require('dotenv').config();
const fs = require('fs');
const path = require('path');
const database = require('./connection');
const logger = require('../utils/logger');

async function runMigrations() {
  try {
    logger.info('Starting database migration...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Connect to database
    await database.connect();
    
    // Execute the schema
    await database.query(schema);
    
    logger.info('Database migration completed successfully');
    
    // Verify tables were created
    const tables = await database.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    logger.info('Created tables:', tables.rows.map(row => row.table_name));
    
  } catch (error) {
    logger.error('Migration failed:', error);
    throw error;
  } finally {
    await database.disconnect();
  }
}

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      logger.info('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = runMigrations;
