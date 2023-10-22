const dynamoDB = require('../database');
const fs = require('fs');
const csv = require('csv-parser');

class moviesController {
  constructor() { }

  async loadMoviesData(req, res) {
    try {
      const tableName = 'peliculas';
      const items = [];
      var cont = 1;

      fs.createReadStream('./data/Peliculas.csv')
        .pipe(csv())
        .on('data', (row) => {
          items.push({
            Id: Number(cont),
            Titulo: row.Titulo,
            Director: row.Director,
            FechaDeEstreno: row.FechaDeEstreno,
            IdiomaOriginal: row.IdiomaOriginal,
            Distribuidora: row.Distribuidora,
            Descripcion: row.Descripcion,
            Precio: Number(row.Precio),
            Genero: row.Genero,
            Clasificacion: row.Clasificacion,
            Calificacion: Number(row.Calificacion),
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

  async getMovies(req, res) {
    try {
      const params = {
        TableName: 'peliculas',
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener datos de películas' });
        } else {
          res.json(data.Items);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createMovie(req, res) {
    try {
      const { Id, Titulo, Director, FechaDeEstreno, IdiomaOriginal, Distribuidora, Descripcion, Precio, Genero, Clasificacion, Calificacion } = req.body;

      const params = {
        TableName: 'peliculas',
        Item: {
          Id,
          Titulo,
          Director,
          FechaDeEstreno,
          IdiomaOriginal,
          Distribuidora,
          Descripcion,
          Precio,
          Genero,
          Clasificacion,
          Calificacion,
        },
      };

      dynamoDB.put(params, (error, data) => {
        if (error) {
          console.error('Error al crear la película:', error);
          res.status(500).json({ error: 'Error al crear la película' });
        } else {
          res.status(201).json({ message: 'Película creada con éxito' });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async updateMovie(req, res) {
    try {
      const { Id, ...updatedData } = req.body;
      const tableName = 'peliculas';

      const params = {
        TableName: tableName,
        Key: { Id: Number(Id) },
        UpdateExpression: 'set #Titulo = :Titulo, #Director = :Director, #FechaDeEstreno = :FechaDeEstreno, #IdiomaOriginal = :IdiomaOriginal, #Distribuidora = :Distribuidora, #Descripcion = :Descripcion, #Precio = :Precio, #Genero = :Genero, #Clasificacion = :Clasificacion, #Calificacion = :Calificacion',
        ExpressionAttributeNames: {
          '#Titulo': 'Titulo',
          '#Director': 'Director',
          '#FechaDeEstreno': 'FechaDeEstreno',
          '#IdiomaOriginal': 'IdiomaOriginal',
          '#Distribuidora': 'Distribuidora',
          '#Descripcion': 'Descripcion',
          '#Precio': 'Precio',
          '#Genero': 'Genero',
          '#Clasificacion': 'Clasificacion',
          '#Calificacion': 'Calificacion',
        },
        ExpressionAttributeValues: {
          ':Titulo': updatedData.Titulo,
          ':Director': updatedData.Director,
          ':FechaDeEstreno': updatedData.FechaDeEstreno,
          ':IdiomaOriginal': updatedData.IdiomaOriginal,
          ':Distribuidora': updatedData.Distribuidora,
          ':Descripcion': updatedData.Descripcion,
          ':Precio': updatedData.Precio,
          ':Genero': updatedData.Genero,
          ':Clasificacion': updatedData.Clasificacion,
          ':Calificacion': updatedData.Calificacion,
        },
        ReturnValues: 'ALL_NEW',
      };

      dynamoDB.update(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: `Error al actualizar la película con ID ${Id}` });
        } else {
          res.status(200).json({ message: `La película con Id ${Id} ha sido actualizada` });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async deleteMovie(req, res) {
    try {
      const { id } = req.params;
      const tableName = 'peliculas';

      const params = {
        TableName: tableName,
        Key: { Id: Number(id) },
      };

      dynamoDB.delete(params, (error) => {
        if (error) {
          res.status(500).json({ error: `Error al eliminar la película con ID ${id}` });
        } else {
          res.json({ message: `La película con Id ${id} ha sido eliminada` });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async findByGenre(req, res) {
    try {
      const { genero } = req.params;

      const params = {
        TableName: 'peliculas',
        FilterExpression: '#Genero = :genero',
        ExpressionAttributeNames: { '#Genero': 'Genero' },
        ExpressionAttributeValues: { ':genero': genero },
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas por género' });
        } else {
          res.json(data.Items);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async findByClasification(req, res) {
    try {
      const { clasificacion } = req.params;

      const params = {
        TableName: 'peliculas',
        FilterExpression: '#Clasificacion = :clasificacion',
        ExpressionAttributeNames: { '#Clasificacion': 'Clasificacion' },
        ExpressionAttributeValues: { ':clasificacion': clasificacion },
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas por clasificación' });
        } else {
          res.json(data.Items);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async findByDirector(req, res) {
    try {
      const { director } = req.params;

      const params = {
        TableName: 'peliculas',
        FilterExpression: '#Director = :director',
        ExpressionAttributeNames: { '#Director': 'Director' },
        ExpressionAttributeValues: { ':director': director },
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas por director' });
        } else {
          res.json(data.Items);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async findByPrice(req, res) {
    try {
      const { precio } = req.params;

      const params = {
        TableName: 'peliculas',
        FilterExpression: '#Precio <= :precio',
        ExpressionAttributeNames: { '#Precio': 'Precio' },
        ExpressionAttributeValues: { ':precio': Number(precio) },
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas por precio' });
        } else {
          res.json(data.Items);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async findByYear(req, res) {
    try {
      const { year } = req.params;

      const params = {
        TableName: 'peliculas',
      };

      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas por año' });
        } else {
          const filteredData = data.Items.filter(movie => new Date(movie.FechaDeEstreno).getFullYear() === parseInt(year));

          res.json(filteredData);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async topDirectors(req, res) {
    try {
      const params = {
        TableName: 'peliculas',
      };
  
      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas' });
        } else {
          // Agrupar películas por director
          const moviesByDirector = data.Items.reduce((acc, movie) => {
            if (!acc[movie.Director]) {
              acc[movie.Director] = [];
            }
            acc[movie.Director].push(movie);
            return acc;
          }, {});
  
          // Calcular el promedio de calificación por director
          const directorsWithAverage = Object.keys(moviesByDirector).map(director => {
            const movies = moviesByDirector[director];
            const averageRating =
              movies.reduce((sum, movie) => sum + movie.Calificacion, 0) / movies.length;
            return {
              Director: director,
              PromedioCalificacion: averageRating,
              Peliculas: movies.map(movie => ({
                Titulo: movie.Titulo,
                Calificacion: movie.Calificacion,
              })),
            };
          });
  
          // Ordenar por promedio de calificación de forma descendente
          const topDirectors = directorsWithAverage
            .sort((a, b) => b.PromedioCalificacion - a.PromedioCalificacion)
            .slice(0, 10);
  
          res.json(topDirectors);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async searchMovies(req, res) {
    try {
      const { keyword } = req.params;
  
      const params = {
        TableName: 'peliculas',
      };
  
      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas' });
        } else {
          const filteredData = data.Items.filter(
            movie =>
              movie.Titulo.toLowerCase().includes(keyword.toLowerCase()) ||
              movie.Descripcion.toLowerCase().includes(keyword.toLowerCase())
          );
  
          res.json(filteredData);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  async averageMoviePrice(req, res) {
    try {
      const params = {
        TableName: 'peliculas',
      };
  
      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas' });
        } else {
          const totalMovies = data.Items.length;
          const totalPrice = data.Items.reduce((sum, movie) => sum + movie.Precio, 0);
          const averagePrice = totalMovies > 0 ? totalPrice / totalMovies : 0;
  
          res.json({ PrecioPromedio: averagePrice });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
  async topRatedMovies(req, res) {
    try {
      const params = {
        TableName: 'peliculas',
      };
  
      dynamoDB.scan(params, (error, data) => {
        if (error) {
          res.status(500).json({ error: 'Error al buscar películas' });
        } else {
          // Agrupar películas por título
          const moviesByTitle = data.Items.reduce((acc, movie) => {
            if (!acc[movie.Titulo]) {
              acc[movie.Titulo] = [];
            }
            acc[movie.Titulo].push(movie.Calificacion);
            return acc;
          }, {});
  
          // Calcular el promedio de calificación por película
          const moviesWithAverage = Object.keys(moviesByTitle).map(title => {
            const ratings = moviesByTitle[title];
            const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
            return {
              Titulo: title,
              PromedioCalificacion: averageRating,
            };
          });
  
          // Ordenar por calificación promedio de forma descendente
          const topRatedMovies = moviesWithAverage
            .sort((a, b) => b.PromedioCalificacion - a.PromedioCalificacion);
  
          res.json(topRatedMovies);
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  
}

module.exports = new moviesController();
