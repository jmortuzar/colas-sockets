const { io } = require('../server');
const TicketControl = require('../classes/ticket-control');

const ticketControl = new TicketControl();


io.on('connection', (client) => {


    client.on('siguienteTicket', async (data, callback) => {
        try {
            const siguiente = await ticketControl.siguiente();
            console.log('Siguiente Ticket: ', siguiente);
            callback(siguiente);
        } catch(err) {
            console.log('No se pudo obtener nuevo ticket');
        }
        
    });

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });

    client.on('atenderTicket', async (data, callback) => {
        if(!data.escritorio) {
            callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        let atenderTicket;
        try {
            atenderTicket = await ticketControl.atenderTicket(data.escritorio);
        } catch(err) {
            console.log(err);
        }

        if(atenderTicket) {
            callback(atenderTicket);
        }

        client.broadcast.emit('estadoActual', {
            actual: ticketControl.getUltimoTicket(),
            ultimos4: ticketControl.getUltimos4()
        });
    });

    client.on('atendiendoTicket', async (data, callback) => {
        if(!data.escritorio) {
            callback({
                err: true,
                mensaje: 'El escritorio es necesario'
            });
        }

        const atendiendo = ticketControl.getAtendiendo(data.escritorio);

        if(atendiendo) {
            callback(atendiendo);
        }
    });

});