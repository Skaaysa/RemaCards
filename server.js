const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");


const app = express();



app.use(express.static(__dirname));

app.use(express.json());

app.use(express.urlencoded({
    extended:true
}));





// SUBIDA IMAGENES

const storage = multer.diskStorage({


destination:(req,file,cb)=>{

cb(null,"img/cartas");

},



filename:(req,file,cb)=>{

cb(null,Date.now()+"-"+file.originalname);

}


});


const upload = multer({
storage
});








// LEER CARTAS

function leerCartas(){

return JSON.parse(

fs.readFileSync(
"./data/cartas.json",
"utf8"
)

);

}




// GUARDAR CARTAS

function guardarCartas(cartas){

fs.writeFileSync(

"./data/cartas.json",

JSON.stringify(
cartas,
null,
2
)

);

}









// HOME

app.get("/",(req,res)=>{


res.sendFile(

path.join(
__dirname,
"index.html"
)

);


});








// API CARTAS

app.get("/api/cartas",(req,res)=>{


res.json(
leerCartas()
);


});









// CREAR CARTA

app.post(
"/api/cartas",
upload.single("imagen"),
(req,res)=>{


const cartas=leerCartas();



const fecha=new Date()
.toLocaleDateString("es-ES");



const nuevaCarta={


id:Date.now(),


jugador:req.body.jugador,


equipo:req.body.equipo,


coleccion:req.body.coleccion,


temporada:req.body.temporada,


precio:Number(req.body.precio),


estado:"Disponible",


fecha:fecha,


imagen:req.file
? req.file.filename
: ""



};



cartas.push(nuevaCarta);



guardarCartas(cartas);



res.json({

mensaje:"Carta creada"

});


});









// BORRAR

app.delete(
"/api/cartas/:id",
(req,res)=>{


let cartas=leerCartas();



cartas=cartas.filter(

c=>c.id!=req.params.id

);



guardarCartas(cartas);



res.json({

mensaje:"Eliminada"

});


});









// CAMBIAR ESTADO


app.put(
"/api/cartas/:id",
(req,res)=>{


let cartas=leerCartas();



let carta=cartas.find(

c=>c.id==req.params.id

);




if(carta){


if(carta.estado==="Disponible"){


carta.estado="Reservada";


}

else if(carta.estado==="Reservada"){


carta.estado="Vendida";


}

else{


carta.estado="Disponible";


}


}



guardarCartas(cartas);



res.json({

mensaje:"Estado actualizado"

});


});









// EDITAR

app.put(
"/api/cartas/editar/:id",
(req,res)=>{


let cartas=leerCartas();



let carta=cartas.find(

c=>c.id==req.params.id

);




if(carta){



carta.jugador=req.body.jugador;


carta.equipo=req.body.equipo;


carta.coleccion=req.body.coleccion;


carta.temporada=req.body.temporada;


carta.precio=Number(req.body.precio);


carta.imagen=req.body.imagen;



}



guardarCartas(cartas);



res.json({

mensaje:"Editada"

});


});









// SERVIDOR


app.listen(
3000,
()=>{


console.log(

"Servidor iniciado en http://localhost:3000"

);


});