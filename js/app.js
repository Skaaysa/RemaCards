let cartas = [];


// =========================
// CARGAR CARTAS
// =========================


fetch("data/cartas.json")

.then(res => res.json())

.then(data => {


cartas = data;


aplicarFiltroURL();


actualizarStats(cartas);


mostrarDestacadas();


});




// =========================
// MOSTRAR CARTAS
// =========================


function mostrarCartas(lista){


const contenedor = document.getElementById("resultados");


if(!contenedor) return;



contenedor.innerHTML="";



lista.forEach(carta=>{


let botonCompra="";

let claseEstado="";



if(carta.estado==="Disponible"){


claseEstado="estado-disponible";


botonCompra=`

<a class="comprar"

href="https://wa.me/?text=${encodeURIComponent(
"Hola RemaCards, estoy interesado en la carta de "+carta.jugador
)}">

💬 Comprar

</a>

`;



}

else if(carta.estado==="Reservada"){


claseEstado="estado-reservada";


botonCompra=`

<span class="reservada">

🟡 Reservada

</span>

`;



}

else{


claseEstado="estado-vendida";


botonCompra=`

<span class="vendida">

🔴 Vendida

</span>

`;



}





contenedor.innerHTML += `


<div class="carta">


<img src="img/cartas/${carta.imagen}">



<h3>

${carta.jugador}

</h3>



<p>

⚽ ${carta.equipo}

</p>



<p>

🏆 ${carta.coleccion}

</p>



<p>

📅 ${carta.temporada}

</p>



<h2>

${carta.precio} €

</h2>




<span class="estado ${claseEstado}">

${carta.estado}

</span>



<br><br>



<a class="detalle"

href="carta.html?id=${carta.id}">

👁 Ver carta

</a>



<br><br>


${botonCompra}



</div>



`;



});



}





// =========================
// FILTROS
// =========================


function filtrarCartas(tipo){


let resultado;



if(tipo==="Todas"){


resultado=cartas;


}

else{


resultado=cartas.filter(carta=>


carta.coleccion

.toLowerCase()

.includes(

tipo.toLowerCase()

)


);



}



mostrarCartas(resultado);


actualizarStats(resultado);



}





// =========================
// FILTRO DESDE COLECCIONES
// =========================


function aplicarFiltroURL(){


const parametros =
new URLSearchParams(window.location.search);



const coleccion =
parametros.get("coleccion");



if(coleccion){



let resultado = cartas.filter(carta=>


carta.coleccion

.toLowerCase()

.includes(

coleccion.toLowerCase()

)


);



mostrarCartas(resultado);



}

else{


mostrarCartas(cartas);


}



}







// =========================
// BUSCADOR
// =========================


const inputBusqueda =
document.getElementById("busqueda");



if(inputBusqueda){



inputBusqueda.addEventListener("input",function(){



let texto =
this.value.toLowerCase();



let resultado =
cartas.filter(carta=>



carta.jugador

.toLowerCase()

.includes(texto)



||

carta.equipo

.toLowerCase()

.includes(texto)



||

carta.coleccion

.toLowerCase()

.includes(texto)



);



mostrarCartas(resultado);



actualizarStats(resultado);



});



}







// =========================
// ESTADISTICAS
// =========================


function actualizarStats(lista){



let total =
document.getElementById("totalCartas");

let disponibles =
document.getElementById("disponibles");

let vendidas =
document.getElementById("vendidas");





if(total)

total.innerHTML =
lista.length;





if(disponibles)

disponibles.innerHTML =

lista.filter(c=>

c.estado==="Disponible"

).length;





if(vendidas)

vendidas.innerHTML =

lista.filter(c=>

c.estado==="Vendida"

).length;



}







// =========================
// CARTAS DESTACADAS
// =========================


function mostrarDestacadas(){


const zona =
document.getElementById("destacadas");



if(!zona) return;





let destacadas = cartas

.filter(c=>

c.estado==="Disponible"

)

.sort((a,b)=>

b.precio-a.precio

)

.slice(0,4);





zona.innerHTML="";





destacadas.forEach(carta=>{



zona.innerHTML += `


<div class="destacada">



<img src="img/cartas/${carta.imagen}">



<h3>

${carta.jugador}

</h3>



<p>

${carta.coleccion}

</p>



<h2>

${carta.precio} €

</h2>



<a href="carta.html?id=${carta.id}">

👁 Ver carta

</a>



</div>



`;



});



}