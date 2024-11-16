const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const csv = require('csv-parser');

const db = new sqlite3.Database('./prisma/dev.db', (err) => {
  if (err) throw err;
  db.run('PRAGMA journal_mode = WAL');
  db.run('PRAGMA synchronous = NORMAL');
  db.run('PRAGMA cache_size = -2000');
});

async function initializeDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS digital_equity_assets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          geographic_area TEXT,
          asset_name TEXT NOT NULL,
          type_of_entity TEXT,
          digital_equity_pillars TEXT,
          cp1 BOOLEAN DEFAULT 0,
          cp2 BOOLEAN DEFAULT 0,
          cp3 BOOLEAN DEFAULT 0,
          cp4 BOOLEAN DEFAULT 0,
          cp5 BOOLEAN DEFAULT 0,
          cp6 BOOLEAN DEFAULT 0,
          cp7 BOOLEAN DEFAULT 0,
          cp8 BOOLEAN DEFAULT 0,
          cp9 BOOLEAN DEFAULT 0,
          description_of_services TEXT,
          website TEXT,
          street_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

function cleanCSVLine(line) {
  // Remove line numbers and pipes at the start of lines
  return line.replace(/^\d+\|/, '');
}

function processCSVFile(filePath) {
  return new Promise((resolve, reject) => {
    const BATCH_SIZE = 1000;
    let batch = [];
    let totalRows = 0;

    // First, clean the CSV file
    const tempFilePath = path.join(__dirname, 'temp.csv');
    const fileContent = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .map(cleanCSVLine)
      .join('\n');
    
    fs.writeFileSync(tempFilePath, fileContent);

    const insertQuery = `INSERT INTO digital_equity_assets (
      geographic_area, asset_name, type_of_entity, digital_equity_pillars,
      cp1, cp2, cp3, cp4, cp5, cp6, cp7, cp8, cp9,
      description_of_services, website, street_address
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const stmt = db.prepare(insertQuery);

    const processBatch = () => {
      return new Promise((resolveBatch, rejectBatch) => {
        db.run('BEGIN TRANSACTION', (err) => {
          if (err) return rejectBatch(err);

          const batchPromises = batch.map(row => 
            new Promise((resolveInsert) => {
              const values = [
                row['Geographic Area Served'],
                row['Asset Name'],
                row['Type of Entity'],
                row['Digital Equity Pillars'],
                row['CP1'] === 'x' || row['CP1'] === '1' ? 1 : 0,
                row['CP2'] === 'x' || row['CP2'] === '1' ? 1 : 0,
                row['CP3'] === 'x' || row['CP3'] === '1' ? 1 : 0,
                row['CP4'] === 'x' || row['CP4'] === '1' ? 1 : 0,
                row['CP5'] === 'x' || row['CP5'] === '1' ? 1 : 0,
                row['CP6'] === 'x' || row['CP6'] === '1' ? 1 : 0,
                row['CP7'] === 'x' || row['CP7'] === '1' ? 1 : 0,
                row['CP8'] === 'x' || row['CP8'] === '1' ? 1 : 0,
                row['CP9'] === 'x' || row['CP9'] === '1' ? 1 : 0,
                row['Description of Services'],
                row['Website'],
                row['Street Address']
              ];
              stmt.run(values, resolveInsert);
            })
          );

          Promise.all(batchPromises)
            .then(() => {
              db.run('COMMIT', (err) => {
                if (err) {
                  db.run('ROLLBACK');
                  return rejectBatch(err);
                }
                resolveBatch();
              });
            })
            .catch((err) => {
              db.run('ROLLBACK');
              rejectBatch(err);
            });
        });
      });
    };

    fs.createReadStream(tempFilePath)
      .pipe(csv())
      .on('data', (row) => {
        if (row['Geographic Area Served'] && row['Asset Name']) {
          batch.push(row);
          totalRows++;

          if (batch.length >= BATCH_SIZE) {
            processBatch()
              .then(() => {
                console.log(`${filePath}: Processed ${totalRows} rows...`);
                batch = [];
              })
              .catch(reject);
          }
        }
      })
      .on('end', async () => {
        try {
          if (batch.length > 0) {
            await processBatch();
          }
          stmt.finalize();
          fs.unlinkSync(tempFilePath); // Clean up temp file
          console.log(`${filePath}: Successfully loaded ${totalRows} records`);
          resolve(totalRows);
        } catch (err) {
          reject(err);
        }
      })
      .on('error', (err) => {
        stmt.finalize();
        fs.unlinkSync(tempFilePath); // Clean up temp file
        reject(err);
      });
  });
}

async function processAllCSVFiles() {
  try {
    await initializeDatabase();
    
    const csvDir = path.join(__dirname, '../CSV');
    const files = fs.readdirSync(csvDir).filter(file => 
      file.endsWith('.csv') && file.includes('digital-equity-plan-asset-inventory')
    );
    
    let totalProcessed = 0;
    for (const file of files) {
      const filePath = path.join(csvDir, file);
      console.log(`Processing ${file}...`);
      try {
        const rowsProcessed = await processCSVFile(filePath);
        totalProcessed += rowsProcessed;
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }

    console.log(`Total records processed: ${totalProcessed}`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    db.close();
  }
}

processAllCSVFiles().catch(console.error);