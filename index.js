const express = require('express');
const app = express();
app.use(express.json());

const moviesRoute = require('./routes/moviesRoute');
const booksRoute = require('./routes/booksRoute');

app.use('/movies', moviesRoute);
app.use('/books', booksRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
