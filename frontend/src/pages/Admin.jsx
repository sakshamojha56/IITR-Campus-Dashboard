import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, Plus, Calendar, Settings, Users,
    X, Check, Loader
} from 'lucide-react';
import miscService from '../services/misc';
import eventService from '../services/events';
import './Admin.css';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('events');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [locations, setLocations] = useState([]);

    // Mock clubs since backend doesn't have a list endpoint for "All Clubs" or "My Managed Clubs" yet
    // In a real scenario, this should be fetched from GET /clubs or GET /user/managed-clubs
    const clubs = [
        { id: 1, name: 'Technical Society' },
        { id: 2, name: 'Cultural Council' },
        { id: 3, name: 'Sports Council' },
        { id: 4, name: 'E-Cell' },
        { id: 5, name: 'Cinematic Section' },
        { id: 6, name: 'Debating Society' }
    ];

    const [newEvent, setNewEvent] = useState({
        name: '',
        club_id: '',
        location_id: '',
        date: '',
        time: '',
        duration_minutes: 60,
        description: ''
    });

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const data = await miscService.getAllLocations();
            setLocations(data);
        } catch (error) {
            console.error("Failed to fetch locations", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Combine date and time for tentative_start_time
            const startDateTime = new Date(`${newEvent.date}T${newEvent.time}`);

            const payload = {
                name: newEvent.name,
                club_id: parseInt(newEvent.club_id),
                location_id: parseInt(newEvent.location_id),
                tentative_start_time: startDateTime.toISOString(),
                duration_minutes: parseInt(newEvent.duration_minutes),
                description: newEvent.description
            };

            await eventService.createEvent(payload);

            alert('Event created successfully!');
            setShowCreateModal(false);
            setNewEvent({ name: '', club_id: '', location_id: '', date: '', time: '', duration_minutes: 60, description: '' });
        } catch (error) {
            console.error("Failed to create event", error);
            alert('Failed to create event. Please check your permissions or try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page" style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--bg-secondary)' }}>
            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1 className="page-title">Club Admin</h1>
                        <p className="page-subtitle">Manage your club events</p>
                    </div>
                    <button className="btn btn-yellow" onClick={() => setShowCreateModal(true)}>
                        <Plus size={18} />
                        Post New Event
                    </button>
                </div>

                {/* Stats Row (Mocked / Placeholder) */}
                <div className="stats-grid grid-4 stagger">
                    {/* Stats Removed/Reduced to keep it strict. Backend doesn't provide these counts directly yet. */}
                    <div className="stat-card card animate-fade-in">
                        <div className="stat-icon" style={{ background: '#667eea15', color: '#667eea' }}>
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3>-</h3>
                            <p>Manage Events</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="admin-tabs">
                    <button className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
                        Create / Manage
                    </button>
                </div>

                {/* Events Table Placeholder */}
                {activeTab === 'events' && (
                    <div className="events-table-container card animate-fade-in">
                        <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
                            <Calendar size={48} style={{ color: 'var(--grey-300)', marginBottom: '1rem' }} />
                            <p style={{ color: 'var(--grey-500)' }}>Use the "Post New Event" button to add events to the calendar.</p>
                            <p style={{ fontSize: '0.85rem', color: 'var(--grey-400)', marginTop: '0.5rem' }}>List view requires club-specific filtering implementation.</p>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="modal-overlay animate-fade-in">
                        <div className="modal-content card">
                            <div className="modal-header">
                                <h2>Post New Event</h2>
                                <button className="btn-icon" onClick={() => setShowCreateModal(false)}>
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="event-form">
                                <div className="form-group">
                                    <label>Event Title</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newEvent.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Intro to Machine Learning"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Club</label>
                                    <select
                                        name="club_id"
                                        value={newEvent.club_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Club</option>
                                        {clubs.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <small style={{ color: 'var(--grey-500)', fontSize: '0.75rem', marginTop: '4px' }}>
                                        * You must be an admin of the selected club to post.
                                    </small>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={newEvent.date}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Time</label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={newEvent.time}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Duration (minutes)</label>
                                    <input
                                        type="number"
                                        name="duration_minutes"
                                        value={newEvent.duration_minutes}
                                        onChange={handleInputChange}
                                        min="15"
                                        step="15"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Venue</label>
                                    <select
                                        name="location_id"
                                        value={newEvent.location_id}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Venue</option>
                                        {locations.map(loc => (
                                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        name="description"
                                        value={newEvent.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        placeholder="Event details..."
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowCreateModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-yellow" disabled={loading}>
                                        {loading ? <Loader size={16} className="animate-spin" /> : 'Create Event'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;
