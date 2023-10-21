const dynamoDB = require('../database');
const fs = require('fs');
const csv = require('csv-parser');

class booksController {
  constructor() { }

  async loadBooksData(req, res) {
    try {
      const tableName = 'libros';
      const items = [];
      var cont = 1;

      fs.createReadStream('./data/Libros.csv')
        .pipe(csv())
        .on('data', (row) => {
          console.log(row)
          items.push({
            Id: Number(cont),
            Titulo: row.Titulo,
            Autor: row.Autor,
            Descripcion: row.Descripcion,
            FechaDePublicacion: row.FechaDePublicacion,
            Calificacion: row.Calificacion,
            Stock: Number(row.Stock),
            Categoria: row.Categoria,
          });
          cont++;
        })
        .on('end', () => {
          const putRequests = items.map((item) => ({
            PutRequest: {
              Item: item,
            },
          }));

          const params = {
            RequestItems: {
              [tableName]: putRequests,
            },
          };

          dynamoDB.batchWrite(params, (error, data) => {
            if (error) {
              console.error(`Error al cargar datos en la tabla ${tableName}:`, error);
              res.status(500).json({ error: `Error al cargar datos en la tabla ${tableName}` });
            } else {
              console.log(`Datos de ${tableName} cargados con éxito`);
              res.status(200).json({ message: `Datos de ${tableName} cargados con éxito` });
            }
          });
        });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getBooks(req, res) {
    try {
      const params = {
        TableName: 'libros',
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener datos de libros' });
        } else {
          res.json(data.Items);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new booksController();
