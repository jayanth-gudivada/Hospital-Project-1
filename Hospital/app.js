const express = require('express')
const app = express()
const info = require('./routes/info')

const connectDB = require('./db/connect');
require('dotenv').config();


app.use(express.static('./public'))
app.use(express.urlencoded())
app.use(express.json())



var allinformation;


const port = 8125;


// Db connection................................................
const start = async() =>{
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port , console.log('Server is running on port '+ port + '...'))
    } catch (error) {
        console.log(error);
    }
}
start();



                                            // public view
app.post("/", function (req, res) {
    const loc = req.body.xyz;
    res.redirect('/hospital/info/'+ loc);
})


                                            // Adimn view


// admin login..........................................................
app.get("/login.html", function (req, res) {
    res.sendFile(__dirname + '/login.html');
})

app.post("/login.html", function (req, res) {
    const loc = req.body.abc;
    const loc1 = req.body.def;
    res.redirect('/hospital/info/login/'+ loc+'/'+loc1);
})




// displaying all hospitals..............................................
app.post("/allHospitals.html", function (req, res) {
    allinformation = req.body.all;

    res.redirect('/hospital/info/all/'+ allinformation);

})


// adding new hospital data...............................................
app.post("/addHospital.html", function (req, res) {
    const hname = req.body.name;
    const haddress = req.body.address;
    const hlocation = req.body.location;

    if(!hname || !haddress || !hlocation){
        res.send("<h1>Fill all details</h1>");
    }
    res.redirect('/hospital/info/addhos/'+hname+'/'+hlocation+'/'+haddress);
})



// adding new admin to db..................................................
app.post("/newUser.html", function (req, res) {
    const name = req.body.ename;
    const password = req.body.epassword;
    
    if(!name || !password){
        res.send("<h1>Fill all details to add a new admin</h1>");
    }
    
    res.redirect('/hospital/info/adduser/'+name+'/'+password);
})



// update hospital details to db..................................................
app.post("/updateHospital.html", function (req, res) {
    const oname = req.body.oname;
    const oaddress = req.body.oaddress;
    const olocation = req.body.olocation;

    const nname = req.body.nname;
    const naddress = req.body.naddress;
    const nlocation = req.body.nlocation;

    res.redirect('/hospital/info/update/'+oname+'/'+oaddress +'/'+olocation+'/'+nname+'/'+naddress +'/'+nlocation);
})



// deleting hospital details from db..................................................
app.post("/deleteHospital.html", function (req, res) {
    const oname = req.body.oname;
    const oaddress = req.body.oaddress;
    const olocation = req.body.olocation;

    // console.log(name+"      "+password);
    if(!oname || !oaddress || !olocation){
        res.send("<h1>Fill all details of the existing Hospital</h1>");
    }
    
    res.redirect('/hospital/info/delete/'+oname+'/'+oaddress +'/'+olocation);
})


app.use('/hospital/info',info)