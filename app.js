const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const UserModel = require('./config/database');  
const app = express();
const path = require('path');

// Middleware per il parsing del corpo delle richieste in JSON e x-www-form-urlencoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Imposta la directory delle viste
app.set('views', path.join(__dirname, 'views'));

// Imposta il motore di visualizzazione (esempio con EJS)
app.set('view engine', 'ejs');

app.get('/', (req, res )  =>  {
    res.send("Ciao mondo");
});
 
//GET
//creazione delle due porte principali.
app.get('/login', (req, res) => {
    res.render('login'); // Assicurati che 'login' corrisponda al nome del file della vista
});

//Entrata delle due porte registration e login//

app.get('/register', (req, res) => {res.render('register');})
app.get('/logout', (req, res) => {res.send('Logout');})

//POST
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ success: false, message: 'Username e password sono obbligatori' });
    }

    try {
        // Trova l'utente nel database
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(400).send({ success: false, message: 'Username o password errati' });
        }

        // Confronta la password inserita con quella salvata nel database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ success: false, message: 'Username o password errati' });
        }

        // Se le credenziali sono corrette, puoi gestire la sessione o generare un token JWT
        res.status(200).send({ success: true, message: 'Login effettuato con successo' });
    } catch (error) {
        console.error('Errore durante il login:', error);
        res.status(500).send({ success: false, message: 'Errore durante il login' });
    }
});



app.post('/register', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ success: false, message: 'Username e password sono obbligatori' });
    }

    try {
        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crea un nuovo utente
        const user = new UserModel({
            username,
            password: hashedPassword
        });

        // Salva l'utente
        const savedUser = await user.save();
        console.log(savedUser);

        // Invia una risposta di successo al client
        res.status(201).send({ success: true, user: savedUser });
    } catch (error) {
        console.error('Errore durante il salvataggio dell\'utente:', error);
        res.status(500).send({ success: false, message: 'Errore durante la registrazione dell\'utente' });
    }
});

app.post('/logout', (req, res) => {res.send('Logout');})
 
//protezione
app.post('/protected', (req, res) => {res.send('protezione');})   
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});