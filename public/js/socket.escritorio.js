const socket = io();

socket.on('connect', () => console.log('Conectado al servidor'));
socket.on('disconnect', () => console.log('Desconectado del servidor'));

const searchParams = new URLSearchParams(window.location.search);

const atendiendo = $('h4 > small');

if(!searchParams.has('escritorio')) {
    window.location = 'index.html';
    throw new Error('El escritorio es necesario');
}

const escritorio = searchParams.get('escritorio');

console.log('Escritorio:', escritorio);

$('h1').text(`Escritorio ${escritorio}`);

$('button').on('click', function click() {
    socket.emit('atenderTicket', {escritorio}, function atenderTicket(resp) {
        if(resp === 'No hay tickets') {
            alert('No hay mas tickets');
            return;
        }
        atendiendo.text(resp.numero);
    });
});

socket.emit('atendiendoTicket', {escritorio}, function atendiendoTicket(data) {
    if(data.err) {
        return console.log(data);
    }
    if(atendiendo === 0) {
        alert('No hay mas tickets');
        return;
    }
    atendiendo.text(data);
});

