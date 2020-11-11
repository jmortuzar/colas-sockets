
const socket = io();

const label = $('#lblNuevoTicket');

socket.on('connect', () => console.log('Conectado al servidor'));
socket.on('disconnect', () => console.log('Desconectado del servidor'));
socket.on('estadoActual', function estadoActual(data) {
    label.text(data.actual);
});

$(function() {
    $('button').on('click', function () {
        socket.emit('siguienteTicket', null, function (siguiente) {
            console.log('Siguiente Ticket: ', siguiente);
            label.text(siguiente);
        });
    });

});
