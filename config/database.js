const mongoose = require('mongoose');

// Connessione a MongoDB senza opzioni deprecate
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/passport')
    .then(() => console.log('Connesso a MongoDB'))
    .catch(err => console.error('Errore di connessione:', err));

// Creazione dello schema
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});

// Creazione del modello
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
