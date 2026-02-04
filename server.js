import exp from "express";
import { userApp } from "./APIs/userApis.js";
import { productApp } from "./APIs/productApis.js";
import { connect } from  "mongoose";  
const app = exp();
//port
app.use(exp.json());
const PORT = 4000;

//connect to db 
// function connectToDB(){
// connect('mongodb://localhost:27017/userdb')
// .then(() => console.log("Connected to DB"))
// .catch((err) => console.log("Error connecting to DB", err))
// }

async function connectToDB(){ 
  try{
    await connect('mongodb://localhost:27017/anuragdata');
    console.log("Connected to DB");
    //server listening
    //assing port
    app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
  }catch(err){  
    console.log("Error connecting to DB", err); 
  } 

    
  }
//function call;
connectToDB();


app.use('/user-api', userApp);
app.use('/product-api', productApp);
//body parser

// app.use(exp.json());


