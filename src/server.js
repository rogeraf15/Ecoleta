const express = require("express")
const server = express()

//pegar banco de dados do db.js
const db = require("./database/db")

// configurar pasta publica
server.use(express.static("public"))

// habilta o uso do req.body
server.use(express.urlencoded({extended: true}))


//ultilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})




//configurar caminhos da minha aplicação
//pagina inicial
// req: Requisição(pedido)
//res: Resposta
server.get("/", (req, res) =>{

    
    return res.render("index.html")
})



server.get("/create-point", (req, res) =>{
    
    return res.render("create-point.html")
})

server.post("/savepoint", (req,res) => {
    
    //req.body = O corpo do nosso formulario
    // console.log(req.body)

    //inserir dados do banco de dados
    
    
    const query = `
        INSERT INTO places (
            image,
            name,
            adress,
            adress2,
            state,
            city,
            items 
        ) VALUES ( ?,?,?,?,?,?,?);         
    `
    
    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
       ]    
    
    
    function afterInsertData(err){
        if(err){
            console.log(err)
            return res.send("Erro no Cadastro")
        }

        return res.render("create-point.html", {saved: true})
    }   

     db.run(query, values, afterInsertData)     

})

server.get("/search", (req, res) =>{
    const search = req.query.search

    if(search == " "){
        return  res.render("search-results.html", {total: 0})
    }



    //pegar os dados do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows){
        if(err){
            return console.log(err)
        }

        const total = rows.length

        //mostrar a pagina html com os dados do banco de dados
        return res.render("search-results.html", {places: rows, total: total})
        
    })

    
})




//ligar o servidor
server.listen(3000)