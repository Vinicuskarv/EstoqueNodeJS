const express = require('express');
const UserModel = require('../src/models/user.model')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use((req, res, next) => {
    console.log(`Request Type: ${req.method}`);
    console.log(`Content Type: ${req.headers["content-type"]}`);
    console.log(`Date: ${new Date()}`);

    next();
})

app.get("/login", async (req, res) => {
    res.render("login");
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Tentativa de login: Email=${email}, Senha=${password}`);

        // Verifique se o usuário existe no banco de dados e se as credenciais estão corretas
        const user = await UserModel.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).render("login", { message: 'Credenciais inválidas' });
        }

        // Se as credenciais estiverem corretas, redirecione para a página de índice
        res.redirect("/");

    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get("/", async (req, res) =>{
    const users = await UserModel.find({})

    res.render("index", { users });
})

app.get("/users", async (req, res) => {
    try {
        const user = await UserModel.find({});
        res.status(201).json(user);
    }catch (error){
        res.status(500).send(error.message);
    }
});

app.get('/users/:id', async (req, res) =>{
    try {
        const id = req.params.id;

        const user = await UserModel.findById(id);

        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).send(error.message)
    }
})



app.patch("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;

        const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.delete("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await UserModel.findByIdAndRemove(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send(error.message);
    }
})

const port = 8080;

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));