import express, { response } from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/booksRoute.js';
import cors from 'cors';

// Je crée une instance de l'application Express.
const app = express();

// J'ajoute un middleware qui permet de parser les données envoyées dans les requêtes.
// Parser signifie que je vais pouvoir lire les données envoyées dans le corps de la requête.
app.use(express.json());

// J'ajoute un middleware qui permet de gérer les requêtes CORS.
// CORS signifie Cross-Origin Resource Sharing. C'est une sécurité qui permet de contrôler les requêtes qui viennent d'un autre domaine que le mien.
// Option 1 : Je peux autoriser toutes les requêtes en provenance de tous les domaines.
app.use(cors());
// Option 2 : Je peux autoriser les requête en provenance d'un domaine spécifique.
// app.use(
//     cors({
//         origin: 'http://localhost:3000',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// );

// Je crée une route qui permet d'accéder à la page d'accueil de mon application.
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To MERN Stack Tutorial');
});

app.use('/books', booksRoute);

// Je me connecte à ma base de données MongoDB.
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });