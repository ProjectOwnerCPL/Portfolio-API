/**
 * Contrôleur pour la gestion des contacts
 */

// Stockage temporaire des messages (en production, utiliser une base de données)
let contacts = [];
let messageIdCounter = 1;

/**
 * Recevoir un nouveau message de contact
 */
const sendMessage = (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        // Validation des champs requis
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Les champs nom, email et message sont requis"
            });
        }

        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Format d'email invalide"
            });
        }

        // Création du nouveau message
        const newContact = {
            id: messageIdCounter++,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            subject: subject ? subject.trim() : "Nouveau message",
            message: message.trim(),
            timestamp: new Date().toISOString(),
            status: "nouveau",
            ip: req.ip || req.connection.remoteAddress
        };

        contacts.push(newContact);

        // Simulation d'envoi d'email de notification
        console.log(`📧 Nouveau message reçu de ${newContact.name} (${newContact.email})`);
        console.log(`Sujet: ${newContact.subject}`);
        console.log(`Message: ${newContact.message}`);

        res.status(201).json({
            success: true,
            message: "Votre message a été envoyé avec succès. Je vous répondrai dans les plus brefs délais.",
            data: {
                id: newContact.id,
                timestamp: newContact.timestamp
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de l'envoi du message",
            error: error.message
        });
    }
};

/**
 * Récupérer tous les messages (endpoint admin)
 */
const getAllMessages = (req, res) => {
    try {
        const { status, limit = 50 } = req.query;
        let filteredContacts = [...contacts];

        // Filtrage par statut
        if (status) {
            filteredContacts = filteredContacts.filter(
                contact => contact.status.toLowerCase() === status.toLowerCase()
            );
        }

        // Tri par date (plus récent en premier)
        filteredContacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limitation du nombre de résultats
        if (limit) {
            filteredContacts = filteredContacts.slice(0, parseInt(limit));
        }

        res.json({
            success: true,
            count: filteredContacts.length,
            total: contacts.length,
            data: filteredContacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des messages",
            error: error.message
        });
    }
};

/**
 * Récupérer un message par ID
 */
const getMessageById = (req, res) => {
    try {
        const { id } = req.params;
        const contact = contacts.find(c => c.id === parseInt(id));

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Message non trouvé"
            });
        }

        res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du message",
            error: error.message
        });
    }
};

/**
 * Marquer un message comme lu
 */
const markAsRead = (req, res) => {
    try {
        const { id } = req.params;
        const contactIndex = contacts.findIndex(c => c.id === parseInt(id));

        if (contactIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Message non trouvé"
            });
        }

        contacts[contactIndex].status = "lu";
        contacts[contactIndex].readAt = new Date().toISOString();

        res.json({
            success: true,
            message: "Message marqué comme lu",
            data: contacts[contactIndex]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la mise à jour du statut",
            error: error.message
        });
    }
};

/**
 * Supprimer un message
 */
const deleteMessage = (req, res) => {
    try {
        const { id } = req.params;
        const contactIndex = contacts.findIndex(c => c.id === parseInt(id));

        if (contactIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Message non trouvé"
            });
        }

        const deletedContact = contacts.splice(contactIndex, 1)[0];

        res.json({
            success: true,
            message: "Message supprimé avec succès",
            data: deletedContact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du message",
            error: error.message
        });
    }
};

/**
 * Obtenir les statistiques des messages
 */
const getContactStats = (req, res) => {
    try {
        const stats = {
            total: contacts.length,
            nouveaux: contacts.filter(c => c.status === "nouveau").length,
            lus: contacts.filter(c => c.status === "lu").length,
            dernierMessage: contacts.length > 0 
                ? contacts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0].timestamp
                : null
        };

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des statistiques",
            error: error.message
        });
    }
};

module.exports = {
    sendMessage,
    getAllMessages,
    getMessageById,
    markAsRead,
    deleteMessage,
    getContactStats
};
