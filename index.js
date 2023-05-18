const express =require('express');
const app = express();
const cors=require('cors');

//env port or 5000 port
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
//route get
app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})