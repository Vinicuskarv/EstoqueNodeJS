const express = require('express');

const EstoqueModel = require('../src/models/estoque.model');
const app = express();
const bodyParser = require('body-parser');


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


app.get("/" , async (req, res) => {

    const estoque = await EstoqueModel.find({});
    res.render("estoque", { estoque }); 
});


app.post('/', async (req, res) => {
    try {
        const { codigo, descricao, preco, quantidade, localizacao } = req.body;

        const novoItem = new EstoqueModel({
            codigo,
            descricao,
            preco,
            quantidade,
            localizacao,
        });
        console.log(`codigo=${codigo}, descricao=${descricao}, preco=${preco}, quantidade=${quantidade}`);

        await novoItem.save();

        res.redirect('/');
    } catch (error) {
        
        res.status(500).send(error.message);
    }
});

app.get("/excluir", async (req, res) => {

    const estoque = await EstoqueModel.find({});

    res.render("excluir", { estoque }); 
});


app.get("/excluir", async (req, res) => {

    const editar = await EstoqueModel.find({});

    res.render("excluir", { editar }); 
});


app.post('/excluir', async (req, res) => {
    const codigoItemExcluir = req.body.codigo;
    try {
      const result = await EstoqueModel.deleteOne({ codigo: codigoItemExcluir });
  
      if (result.deletedCount === 0) {
        return res.status(404).send('Item não encontrado');
      }
      res.redirect('/excluir');
  
    } catch (error) {
      res.status(500).send(error.message);
    }
});

app.get("/editar", async (req, res) => {

    const estoque = await EstoqueModel.find({});

    res.render("editar", { estoque }); 
});

app.get("/editar", async (req, res) => {

    const editar = await EstoqueModel.find({});

    res.render("editar", { editar }); 
});


app.get("/editar", async (req, res) => {
    const codigoItemEditar = req.query.codigoEditar;
    console.log(`codigo=${codigoItemEditar}`);
  
    try {
      // Procurar o item no banco de dados com base no código
      const itemParaEditar = await EstoqueModel.findOne({ codigo: codigoItemEditar });
      console.log(`codigo=${itemParaEditar}`);
  
      if (!itemParaEditar) {
        return res.status(404).send('Item não encontrado');
      }
  
      // Preencha os campos de edição com os valores do item encontrado
      res.render("editar", { itemParaEditar });
  
    } catch (error) {
      res.status(500).send(error.message);
    }
});
  

app.post("/editar", async (req, res) => {
  const { codigo, descricao, preco, quantidade, localizacao } = req.body;

  try {
    await EstoqueModel.updateOne({ codigo }, { descricao, preco, quantidade, localizacao });

    res.redirect('/editar');

  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = 8080;

app.listen(port, () => console.log(`Rodando com Express na porta ${port}!`));
