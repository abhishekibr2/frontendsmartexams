import { TicketData } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Tickets = {
    tickets: TicketData[];
    currentTicket: TicketData[];
}

const initialState: Tickets = {
    tickets: [],
    currentTicket: []

}

export const ticketSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        addTicket(state, action: PayloadAction<TicketData[]>) {
            state.tickets = [...state.tickets, ...action.payload]
        },
        setCurrentTicket(state, action: PayloadAction<TicketData[]>) {
            state.currentTicket = action.payload;
        }
    }

})
export const { addTicket, setCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer
