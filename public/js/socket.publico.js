const socket = io();

socket.on('connect', () => console.log('Conectado al servidor'));
socket.on('disconnect', () => console.log('Desconectado del servidor'));

socket.on('estadoActual', function estadoActual(data) {
    const ultimos4 = data.ultimos4;

    for(let [index, ticket] of ultimos4.entries()) {
        $('#lblTicket' + (index + 1)).text('Ticket ' + ticket.numero);
        $('#lblEscritorio' + (index + 1)).text('Escritorio ' + ticket.escritorio);

        const audio = new Audio('audio/new-ticket.mp3');
        audio.play();
    }
});