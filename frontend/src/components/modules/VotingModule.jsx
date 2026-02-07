import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { BarChart2 } from 'lucide-react';

const VotingModule = ({ eventId, config }) => {
    const { user } = useAuth();
    const [votes, setVotes] = useState([]); // Aggregated votes
    const [myVote, setMyVote] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchVotes();
        if (user) fetchMyVote();
    }, [eventId, user]);

    const fetchVotes = async () => {
        try {
            const res = await api.get(`/votes/event/${eventId}`);
            setVotes(res.data);
        } catch (err) {
            console.error('Failed to fetch votes', err);
        }
    };

    const fetchMyVote = async () => {
        try {
            const res = await api.get(`/votes/my/${eventId}`);
            if (res.data.length > 0) {
                setMyVote(res.data[0]); // Assuming one vote per module for now, but usually per poll
            }
        } catch (err) {
            console.error('Failed to fetch my vote', err);
        }
    };

    const handleVote = async (pollId, value) => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await api.post(`/votes/${eventId}`, { targetId: pollId, value });
            setMyVote(res.data);
            fetchVotes(); // Refresh stats
        } catch (err) {
            console.error('Vote failed', err);
        } finally {
            setLoading(false);
        }
    };

    const getCount = (pollId, optionValue) => {
        const voteAgg = votes.find(v => v._id.targetId === pollId && v._id.value === optionValue);
        return voteAgg ? voteAgg.count : 0;
    };

    return (
        <div className="p-6 border border-retro-amber/30 bg-black/40 rounded mt-6">
            <div className="flex items-center gap-2 mb-4">
                <BarChart2 className="text-retro-amber" />
                <h3 className="text-xl font-title text-retro-amber text-glow">
                    COMMUNITY_POLLS
                </h3>
            </div>

            <div className="space-y-6">
                {config.polls && config.polls.map(poll => (
                    <div key={poll.id} className="border-t border-gray-800 pt-4 first:border-0 first:pt-0">
                        <p className="font-retro text-sm text-gray-300 mb-4 tracking-wider">{poll.question}</p>

                        <div className="grid grid-cols-1 gap-3">
                            {['yes', 'no'].map(opt => ( // Assuming yes/no for simplicity, or use poll.options
                                <button
                                    key={opt}
                                    disabled={!user || loading}
                                    onClick={() => handleVote(poll.id, opt)}
                                    className={`relative text-left px-4 py-3 border transition-all overflow-hidden group ${myVote?.targetId === poll.id && myVote?.value === opt
                                            ? 'border-retro-cyan bg-retro-cyan/10 text-retro-cyan'
                                            : 'border-gray-700 hover:border-retro-amber text-gray-400'
                                        }`}
                                >
                                    <div className="relative z-10 flex justify-between font-mono text-sm uppercase">
                                        <span>{opt}</span>
                                        <span>{getCount(poll.id, opt)}</span>
                                    </div>
                                    {/* Progress Bar Background (Simulated) */}
                                    <div
                                        className={`absolute top-0 left-0 h-full opacity-20 transition-all duration-500 ${myVote?.targetId === poll.id && myVote?.value === opt ? 'bg-retro-cyan' : 'bg-retro-amber'
                                            }`}
                                        style={{ width: `${(getCount(poll.id, opt) / (votes.reduce((acc, v) => v._id.targetId === poll.id ? acc + v.count : acc, 0) || 1)) * 100}%` }}
                                    ></div>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VotingModule;
