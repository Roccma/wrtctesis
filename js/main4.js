'use strict';

var isInitiator;
window.room = prompt("Ingrese nombre de la sala");

var socket = io.connect();

if(room !== ""){
	console.log("Uniéndose a la habitación: " + room);
	socket.emit('create or join', room);
}

socket.on('created', function(room, cientId){
	alert("Habitación creada!");
	isInitiator = true;
});

socket.on('full', function(room){
	alert("La habitación '" + room + "' está llena :(");
});

socket.on('ipaddr', function(ipaddr){
	alert("La dirección IP es: " + ipaddr);
});

socket.on('joined', function(room, clientId){
	alert("Te uniste a la habitación!");
	isInitiator = false;
});

socket.on('log', function(array){
	console.log.apply(console, array);
});