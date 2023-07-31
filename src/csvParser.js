import csvParser from 'csv-parser';
import { createReadStream } from 'fs'
import http from 'node:http'

async function mainCsvParser() {
  const parser = createReadStream('tasks.csv')
  .pipe(csvParser())
  for await (const row of parser) {
    try {
      const chunk = JSON.stringify(row)
      const options ={
        method: 'POST',
        hostname: 'localhost',
        port: 3333,
        path: '/tasks',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(chunk)
        }
      }

      const req = http.request(options, (res) => {
        res.on('data', () => {})
        res.on('end', () => {
          console.log('Tarefa inserida com Sucesso')
        })
      })
      req.on('error', (err) => {
        console.error(`Erro ao inserir tarefa: ${err.message}`);
      });
      req.write(chunk);
      req.end();
    } catch (error) {
      console.error(`Erro ao inserir tarefa: ${error.message}`)
    }
  }

}

mainCsvParser()
  .then(() => { })
  .catch(console.error)
