import { db } from './db.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
    console.log('🌱 Starting database seed...');

    try {
        const seedSqlPath = path.join(__dirname, 'seed.sql');
        const seedSql = fs.readFileSync(seedSqlPath, 'utf-8');

        console.log(`📖 Reading SQL from ${seedSqlPath}...`);

        console.log('🧹 Cleaning existing data...');
        await db.execute(`
      TRUNCATE TABLE 
        priorita, 
        psicologo, 
        amministratore, 
        tipologia_questionario, 
        badge, 
        paziente, 
        notifica, 
        domanda_forum, 
        stato_animo, 
        pagina_diario, 
        acquisizione_badge, 
        ticket, 
        alert_clinico, 
        report, 
        risposta_forum, 
        questionario 
      RESTART IDENTITY CASCADE;
    `);

        // Execute the raw SQL
        // drizzle-orm with node-postgres supports execute(sql)
        await db.execute(seedSql);

        console.log('✅ Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

seed();
