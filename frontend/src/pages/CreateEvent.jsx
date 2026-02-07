import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Save, X } from 'lucide-react';

const CreateEvent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        start: '',
        end: '',
        status: 'published',
        enableRegistration: true,
        regLimit: 100,
        enableVoting: false,
        theme: 'retro' // Default theme
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Transform flat form data to schema structure
        const payload = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            timeline: {
                start: formData.start,
                end: formData.end
            },
            status: formData.status,
            themeConfig: { preset: formData.theme },
            modules: []
        };

        if (formData.enableRegistration) {
            payload.modules.push({
                type: 'registration',
                config: { limit: parseInt(formData.regLimit) }
            });
        }

        if (formData.enableVoting) {
            payload.modules.push({
                type: 'voting',
                config: {
                    polls: [{ id: 'poll1', question: 'Rate this event?', options: ['1', '2', '3', '4', '5'] }] // Default poll
                }
            });
        }

        try {
            await api.post('/events', payload);
            navigate('/dashboard');
        } catch (error) {
            console.error('Creation failed', error);
            alert('EVENT CREATION FAILED');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-6">
                <div>
                    <h1 className="text-3xl font-title text-retro-amber text-glow">INITIATE_EVENT</h1>
                    <p className="font-retro text-gray-500 text-xs mt-2 tracking-widest">
                        &gt; CONFIGURE_NEW_PROTOCOL
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-black/40 border border-gray-800 p-8 rounded">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">EVENT_TITLE</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 font-mono focus:border-retro-amber outline-none"
                            required
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">DESCRIPTION</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 font-mono focus:border-retro-amber outline-none"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">START_TIME</label>
                        <input
                            type="datetime-local"
                            name="start"
                            value={formData.start}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 font-mono focus:border-retro-amber outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">END_TIME</label>
                        <input
                            type="datetime-local"
                            name="end"
                            value={formData.end}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 font-mono focus:border-retro-amber outline-none"
                            required
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-gray-400 text-xs font-retro mb-2 tracking-widest">LOCATION_COORDINATES</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full bg-gray-900/50 border border-gray-700 text-gray-200 p-3 font-mono focus:border-retro-amber outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <h3 className="font-retro text-retro-cyan text-sm mb-4 tracking-widest">&gt; VISUAL_INTERFACE_CONFIG</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['retro', 'cyberpunk', 'minimal', 'corporate'].map(themeId => (
                            <label key={themeId} className={`cursor-pointer border p-4 rounded text-center transition-all ${formData.theme === themeId
                                ? 'border-retro-amber bg-retro-amber/10 text-retro-amber'
                                : 'border-gray-700 text-gray-500 hover:border-gray-500'
                                }`}>
                                <input
                                    type="radio"
                                    name="theme"
                                    value={themeId}
                                    checked={formData.theme === themeId}
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                <span className="font-retro text-xs block mb-1">{themeId.toUpperCase()}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                    <h3 className="font-retro text-retro-cyan text-sm mb-4 tracking-widest">&gt; MODULE_CONFIGURATION</h3>

                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="enableRegistration"
                                checked={formData.enableRegistration}
                                onChange={handleChange}
                                className="w-5 h-5 bg-gray-900 border-gray-700 rounded text-retro-amber focus:ring-retro-amber"
                            />
                            <span className="font-mono text-gray-300 group-hover:text-retro-amber transition-colors">ENABLE_REGISTRATION_MODULE</span>
                        </label>

                        {formData.enableRegistration && (
                            <div className="ml-8">
                                <label className="block text-gray-500 text-xs font-retro mb-1">CAPACITY_LIMIT</label>
                                <input
                                    type="number"
                                    name="regLimit"
                                    value={formData.regLimit}
                                    onChange={handleChange}
                                    className="w-32 bg-gray-900/50 border border-gray-700 text-gray-200 p-2 font-mono focus:border-retro-amber outline-none"
                                />
                            </div>
                        )}

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="enableVoting"
                                checked={formData.enableVoting}
                                onChange={handleChange}
                                className="w-5 h-5 bg-gray-900 border-gray-700 rounded text-retro-amber focus:ring-retro-amber"
                            />
                            <span className="font-mono text-gray-300 group-hover:text-retro-amber transition-colors">ENABLE_VOTING_MODULE</span>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 border border-gray-700 text-gray-400 font-retro text-xs hover:border-gray-500 hover:text-gray-200 transition-colors tracking-widest"
                    >
                        CANCEL
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-retro-amber/10 border border-retro-amber text-retro-amber font-retro text-xs hover:bg-retro-amber hover:text-black transition-all tracking-widest disabled:opacity-50"
                    >
                        {loading ? 'PROCESSING...' : 'INITIALIZE_PROTOCOL'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateEvent;
