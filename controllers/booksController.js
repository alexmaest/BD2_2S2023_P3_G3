const { MongoClient, ObjectId } = require('mongodb')
const fs = require('fs');
const csv = require('csv-parser');

const uri = 'mongodb+srv://user-practica-3:gAxNX07uoh8IdXl1@cluster0.smqaw64.mongodb.net/?retryWrites=true&w=majority'
class booksController {
  constructor() { }

  async loadBooksData(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const filePath = './data/Libros.csv';

      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async row => {
          await books.insertOne(row);
        })
        .on('end', () => {
          console.log('CSV file successfully processed');
          res.send('CSV file successfully processed');
        });

    } catch (error) {
      console.error('Error de conexión a MongoDB:', error);
      res.status(500).send(error)
    } finally {      
      //await client.close();
    }
  }

  async getBooks(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const query = {};

      const booksList = await books.find(query).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async createBook(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const book = req.body;

      await books.insertOne(book);

      res.status(200).send('Book created successfully');
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async updateBook(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect()

      const database = client.db('practica3');
      const books = database.collection('books');
      
      const { _id, 
        Calificacion,
        Stock,
        Titulo,
        Autor,
        Descripcion,
        FechaDePublicacion,
        Categoria } = req.body;

      const query = { _id: new ObjectId(_id) };

      const newBook = {
        Calificacion,
        Stock,
        Titulo,
        Autor,
        Descripcion,
        FechaDePublicacion,
        Categoria
      };

      await books.updateOne(query, { $set: newBook });

      res.status(200).send('Book updated successfully');
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async deleteBook(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect()

      const database = client.db('practica3');
      const books = database.collection('books');
      
      const { _id } = req.params;

      const query = { _id: new ObjectId(_id) };

      await books.deleteOne(query);

      res.status(200).send('Book deleted successfully');
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async getAvailableBooks(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const query = { Stock: { $gt: "0" } };

      const booksList = await books.find(query).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async findByCategory(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const { category } = req.params;

      const query = { Categoria: category };

      const booksList = await books.find(query).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async findByAuthor(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const { author } = req.params;

      const query = { Autor: author };

      const booksList = await books.find(query).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async averageRatingSort(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const query = {};

      const booksList = await books.find(query).sort({ Calificacion: -1 }).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async priceLowerThan20(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const query = { Precio: { $lt: "20" } };

      const booksList = await books.find(query).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }

  async titleAndDescriptionKeyword(req, res) {
    try {
      const client = new MongoClient(uri);
      await client.connect();
      console.log('Conexión a MongoDB establecida correctamente');
      
      const database = client.db('practica3');

      const books = database.collection('books');

      const { keyword } = req.params;

      const query = { $or: [
        { Titulo: { $regex: keyword, $options: 'i' } },
        { Descripcion: { $regex: keyword, $options: 'i' } }
      ] };

      const booksList = await books.find(query).toArray();
      res.status(200).send(booksList);
    } catch (err) {
      console.error('Error de conexión a MongoDB:', err);
      res.status(500).send(err)
    }
  }
}

module.exports = new booksController();
