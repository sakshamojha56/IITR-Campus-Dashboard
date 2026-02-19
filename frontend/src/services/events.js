import api from './api';

const eventService = {
    // Get all events
    getAllEvents: async () => {
        const response = await api.get('/events/all');
        return response.data.events;
    },

    // Get single event by ID
    getEventById: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data.events[0]; // Backend returns array
    },

    // Create new event
    createEvent: async (eventData) => {
        const response = await api.post('/events/add', eventData);
        return response.data.event;
    },

    // Update event
    updateEvent: async (id, eventData) => {
        const response = await api.patch(`/events/${id}`, eventData);
        return response.data.event;
    },

    // Delete event
    deleteEvent: async (id) => {
        const response = await api.delete(`/events/${id}`);
        return response.data;
    },

    // Get preferred club events
    getPreferredClubEvents: async () => {
        const response = await api.get('/events/clubs/preferred');
        return response.data.events;
    },

    // Get preferred category events
    getPreferredCategoryEvents: async () => {
        const response = await api.get('/events/categories/preferred');
        return response.data.events;
    }
};

export default eventService;
