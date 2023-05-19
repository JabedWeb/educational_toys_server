const express =require('express');
const app = express();
const cors=require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//env port or 5000 port
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

require('dotenv').config();

//mongodb connection
//const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lkb5wuy.mongodb.net/?retryWrites=true&w=majority`;
const uri ='mongodb://localhost:27017';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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


    // find all databases
    const educational_toys=client.db("educational_toys").collection("toys");

    //get all data
    app.get('/toys',async(req,res)=>{
        const result= await educational_toys.find().toArray();
        res.send(result);
    })

    //get single data
    app.get('/toys/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id);
        const ids =new ObjectId(id);
        const result= await educational_toys.findOne({_id:ids});
        res.send(result);
    })

    // show user toys
    app.get('/mytoys', async(req,res)=>{
      let query={};
      console.log(req.query);
      console.log(req.query.email);
      if(req.query.email){
        query={sellerEmail:req.query.email}
      }
     const result= await educational_toys.find(query).toArray();
     console.log(result);
    res.send(result);
    })
    
     //post data
    app.post('/toys',async(req,res)=>{
      console.log("okkkk");
      const newToy=req.body;
      console.log('adding new toy',newToy);
        const result= await educational_toys.insertOne(newToy);
        res.json(result);
    })



    // my toys delete
    app.delete('/toys/:id',async(req,res)=>{
      const id=req.params.id;
      console.log(id);
      const ids =new ObjectId(id);
      const result= await educational_toys.deleteOne({_id:ids});
      res.send(result);
    })  

    //update data
    app.put('/toys/:id',async(req,res)=>{
      const id=req.params.id;
      console.log(id);
      const ids =new ObjectId(id);
      const updatedData=req.body;
      const options={upsert:true};
      console.log(updatedData);
      const result= await educational_toys.updateOne({_id:ids},{$set:updatedData},options);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


//route get
app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})