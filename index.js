const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wj0pjif.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const categoryCollection = client.db("cisecoDB").collection("categories");
        const productsCollection = client.db("cisecoDB").collection("products");
        const sortCollection = client.db("cisecoDB").collection("sorts");
        const commentCollection = client.db("cisecoDB").collection("comment");


        // category related api
        app.get('/category', async (req, res) => {
            const result = await categoryCollection.find().toArray();
            res.send(result)
        })

        // products related api
        app.get('/products', async (req, res) => {
            let query = {};
            if (req?.query?.category_name) {
                query = { category_name: req?.query?.category_name }
            }
            const result = await productsCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id : new ObjectId(id)}
            const result = await productsCollection.findOne(query);
            res.send(result)
        })


        // comment related api
        app.get('/comment', async (req, res) => {
            let query = {};
            if (req?.query?.product_id) {
                query = { product_id: req?.query?.product_id }
            }
            const result = await commentCollection.find(query).toArray();
            res.send(result)
        })
        app.post('/comment' , async (req , res)=>{
            const comment = req.body;
            const result = await commentCollection.insertOne(comment)
            res.send(result)
        })
       


        // sort related api

        app.get('/sorts', async (req, res) => {
            const result = await sortCollection.find().toArray();
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.log);



app.get('/', (req, res) => {
    res.send('Ciseco server is running')
})

app.listen(port, () => {
    console.log(`Ciseco server is running on port ${port}`)
})