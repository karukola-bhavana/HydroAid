import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Users } from 'lucide-react';
import { toast } from 'sonner';

interface FetchedUser {
    _id: string;
    email: string;
    name: string;
    role: string;
}

export const FormTeamModal = () => {
    const [users, setUsers] = useState<FetchedUser[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [teamName, setTeamName] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchUsers = async () => {
                try {
                    const response = await fetch('http://localhost:5001/api/auth/users');
                    if (response.ok) {
                        const data = await response.json();
                        // We only want to show 'user' role for team formation
                        setUsers(data.filter((user: FetchedUser) => user.role === 'user'));
                    } else {
                        toast.error('Failed to fetch users.');
                    }
                } catch (error) {
                    toast.error('An error occurred while fetching users.');
                    console.error(error);
                }
            };
            fetchUsers();
        }
    }, [isOpen]);

    const handleSelectUser = (email: string) => {
        setSelectedUsers(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    const handleFormTeam = () => {
        if (!teamName.trim()) {
            toast.error('Please enter a team name.');
            return;
        }
        if (selectedUsers.length < 2) {
            toast.error('Please select at least two members to form a team.');
            return;
        }
        toast.success(`Team "${teamName}" formed with ${selectedUsers.length} members!`);
        // Here you would typically call an API to save the team
        setIsOpen(false); // Close modal on success
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-24 bg-teal-500 hover:bg-teal-600 text-white flex-col">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Form Team</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-gray-800">Create a New Team</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="teamName" className="block text-sm font-medium text-gray-700">Team Name</label>
                        <input
                            type="text"
                            id="teamName"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder="e.g., Water Warriors"
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-800">Select Team Members</h3>
                        <div className="mt-2 space-y-2 max-h-60 overflow-y-auto border p-2 rounded-md">
                            {users.map(user => (
                                <div key={user._id} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                    <User className="h-5 w-5 mr-3 text-gray-500"/>
                                    <label htmlFor={`user-${user._id}`} className="flex-grow text-gray-700">{user.name} ({user.email})</label>
                                    <Checkbox
                                        id={`user-${user._id}`}
                                        checked={selectedUsers.includes(user.email)}
                                        onCheckedChange={() => handleSelectUser(user.email)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button onClick={handleFormTeam} className="w-full">
                        Form Team
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};