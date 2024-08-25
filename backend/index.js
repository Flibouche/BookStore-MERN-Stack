import express, { response } from 'express';
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';

// Je crée une instance de l'application Express.
const app = express();

// J'ajoute un middleware qui permet de parser les données envoyées dans les requêtes.
// Parser signifie que je vais pouvoir lire les données envoyées dans le corps de la requête.
app.use(express.json());

// Je crée une route qui permet d'accéder à la page d'accueil de mon application.
app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To MERN Stack Tutorial');
});

// Je crée une route pour ajouter un livre dans ma base de données en vérifiant les champs requis.
app.post('/books', async (request, response) => {
    // J'essaie de récupérer tous les livres stockés dans ma base de données.
    try {
        if (
            // Je vérifie que les champs title, author et publishYear sont bien envoyés dans la requête.
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            // Si un des champs est manquant, je renvoie une erreur 400.
            return response.status(400).send({
                message: "Send all required fields: title, author, publishYear",
            });
        }
        // Je crée un nouvel objet Book avec les informations envoyées dans la requête.
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
        // J'ajoute ce nouveau livre dans ma base de données.
        const book = await Book.create(newBook);
        // Je renvoie le livre ajouté avec un statut 201.
        return response.status(201).send(book);
    } catch (error) {
        // Si je n'arrive pas à accéder à la requête, je renvoie une erreur 500.
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Je crée une route qui permet de récupérer tous les livres stockés dans ma base de données.
app.get('/books', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
})

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