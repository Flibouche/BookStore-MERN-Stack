import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Route pour ajouter un livre dans ma base de données en vérifiant les champs requis.
router.post('/', async (request, response) => {
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

// Route qui permet de récupérer tous les livres stockés dans ma base de données.
router.get('/', async (request, response) => {
    try {
        // J'essaie de récupérer tous les livres stockés dans ma base de données.
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        // Si je n'arrive pas à accéder à la requête, je renvoie une erreur 500.
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route qui permet de récupérer un seul livre stocké dans ma base de données.
router.get('/:id', async (request, response) => {
    try {
        // J'essaie de récupérer le livre stocké dans ma base de données avec l'id envoyé dans la requête.
        const { id } = request.params;
        const book = await Book.findById(id);
        return response.status(200).json({ book });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route qui permet de mettre à jour un livre stocké dans ma base de données.
router.put('/:id', async (request, response) => {
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
        // Je récupère l'id du livre à mettre à jour.
        const { id } = request.params;
        // J'essaie de mettre à jour le livre stocké dans ma base de données avec l'id envoyé dans la requête.
        const result = await Book.findByIdAndUpdate(id, request.body);
        // Si le livre n'est pas trouvé, je renvoie une erreur 404.
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        // Je renvoie un message de succès si le livre est mis à jour.
        return response.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route qui permet de supprimer un livre stocké dans ma base de données.
router.delete('/:id', async (request, response) => {
    try {
        // Je récupère l'id du livre à supprimer.
        const { id } = request.params;
        // J'essaie de supprimer le livre stocké dans ma base de données avec l'id envoyé dans la requête.
        const result = await Book.findByIdAndDelete(id);
        // Si le livre n'est pas trouvé, je renvoie une erreur 404.
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }
        // Je renvoie un message de succès si le livre est supprimé.
        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

export default router;