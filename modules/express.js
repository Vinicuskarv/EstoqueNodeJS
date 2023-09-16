const express = require('express');
const UserModel = require('../src/models/user.model');
const EstoqueModel = require('../src/models/estoque.model');
const app = express();
const bodyParser = require('body-parser'); // Importe o body-parser


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', 'src/views');

app.use((req, res, next) => {
    console.log(`Request Type: ${req.method}`);
    console.log(`Content Type: ${req.headers["content-type"]}`);
    console.log(`Date: ${new Date()}`);

    next();
})

// Função para verificar se o usuário está autenticado
function isAuthenticated(req, res, next) {
    // Verifique aqui se o usuário está autenticado, por exemplo, verificando se ele fez login.
    // Se o usuário estiver autenticado, chame next() para permitir o acesso à rota protegida.
    // Caso contrário, redirecione-o para a página de login ou execute alguma outra ação apropriada.
    
    // Exemplo simples: aqui, estamos considerando que o usuário está autenticado se uma variável de usuárioAutenticado estiver definida como verdadeira.
    const usuarioAutenticado = true;

    if (usuarioAutenticado) {
        return next(); // O usuário está autenticado, permita o acesso à rota protegida
    } else {
        res.redirect("/login"); // Redirecione o usuário para a página de login se não estiver autenticado
    }
}

app.get("/", async (req, res) => {
    res.render("login");
});

app.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`Tentativa de login: Email=${email}, Senha=${password}`);

        // Verifique se o usuário existe no banco de dados e se as credenciais estão corretas
        const user = await UserModel.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).render("login", { message: 'Credenciais inválidas' });
        }

        // Se as credenciais estiverem corretas, redirecione para a página de índice
        res.redirect("/estoque");

    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/users', isAuthenticated, async (req, res) => {
    // Esta rota agora está protegida e só será acessível por usuários autenticados
    try {
        const users = await UserModel.find({});
        res.render("index", { users });
    } catch (error) {
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
});

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
});

app.get("/estoque", async (req, res) => {
    // Agora estamos buscando dados de EstoqueModel em vez de UserModel
    const estoque = await EstoqueModel.find({});

    // Renderize a página de estoque com os dados de estoque
    res.render("estoque", { estoque }); // Certifique-se de passar 'estoque' para o modelo
});


app.post('/estoque', async (req, res) => {
    try {
        const { codigo, descricao, preco, quantidade, localizacao } = req.body;

        // Crie um novo item usando o modelo EstoqueModel
        const novoItem = new EstoqueModel({
            codigo,
            descricao,
            preco,
            quantidade,
            localizacao,
        });
        console.log(`codigo=${codigo}, descricao=${descricao}, preco=${preco}, quantidade=${quantidade}`);

        // Salve o novo item no banco de dados
        await novoItem.save();

        res.redirect('/estoque'); // Redirecione para a página de estoque após a adição bem-sucedida
    } catch (error) {
        
        res.status(500).send(error.message);
    }
});

app.post('/estoque/excluir', async (req, res) => {
    const codigoItemExcluir = req.body.codigo; // Obter o código do formulário
  
    try {
      // Procurar o item no banco de dados com base no código e excluí-lo
      const result = await EstoqueModel.deleteOne({ codigo: codigoItemExcluir });
  
      if (result.deletedCount === 0) {
        return res.status(404).send('Item não encontrado');
      }
  
      // Redirecione o usuário para a página de estoque ou uma página de confirmação
      res.redirect('/estoque');
  
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  

const port = 8080;

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));
