const fs = require('fs').promises;

class Ticket {

    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }

}

class TicketControl {

    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = [];
        this.ultimosCuatro = [];

        let data = require('../data/data.json');

        if(data.hoy === this.hoy) {
            this.ultimo = data.ultimo;
            this.tickets = data.tickets;
            this.ultimosCuatro = data.ultimosCuatro;
        } else {
            this.reiniciarConteo().catch(console.log);
        }
    }

    async siguiente() {
        this.ultimo++;

        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        try {
            await this.grabarArchivo();
        } catch(err) {
            console.log(err);
        }

        return `Ticket ${this.ultimo}`;
    }

    getUltimoTicket() {
        return `Ticket ${this.ultimo}`;
    }

    getUltimos4() {
        return this.ultimosCuatro;
    }

    async atenderTicket(escritorio) {
        if(this.tickets.length === 0) {
            return 'No hay tickets';
        }

        const numeroTicket = this.tickets[0].numero;
        this.tickets.shift();

        const atenderTicket = new Ticket(numeroTicket, escritorio);

        this.ultimosCuatro.unshift(atenderTicket);

        if(this.ultimosCuatro.length > 4) {
            this.ultimosCuatro.splice(-1, 1);
        }

        console.log('Ultimos 4: ', this.ultimosCuatro);

        try {
            await this.grabarArchivo();
        } catch(err) {
            console.log(err);
        }

        return atenderTicket;
    }

    getAtendiendo(escritorio) {
        for(let ticket of this.ultimosCuatro) {
            if(ticket.escritorio === escritorio) {
                return ticket.numero;
            } else {
                return 0;
            }
        }
    }

    async reiniciarConteo() {
        this.ultimo = 0;
        this.tickets = [];
        this.ultimosCuatro = [];

        try {
            await this.grabarArchivo();
        } catch(err) {
            console.log(err);
        }

        console.log('Se ha inicializado el sistema');
    }

    async grabarArchivo() {
        const jsonData = {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimosCuatro: this.ultimosCuatro
        }

        const jsonDataString = JSON.stringify(jsonData);

        try {
            await fs.writeFile('./server/data/data.json', jsonDataString);
        } catch(err) {
            console.log(err);
        }

    }

}

module.exports = TicketControl;