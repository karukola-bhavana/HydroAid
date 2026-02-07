import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, CheckCircle, Upload, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';

const teamRoles = [
    'Donor', 'Volunteer', 'Campaign Leader', 'Creative Designer', 'Social Media Promoter', 'Other'
];

const existingTeams = [
    'Aqua Avengers', 'Water Warriors', 'Hydro Heroes', 'Stream Team'
];

const JoinClassTeamForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
        setIsSubmitting(false);
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-8 bg-white rounded-lg">
                <PartyPopper className="mx-auto h-16 w-16 text-purple-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome to the Movement!</h3>
                <p className="text-gray-600 mb-6">Your request has been sent, and the team captain will be notified.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/starter-kit.pdf" download className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">Download Starter Kit</Button>
                    </a>
                    <Button onClick={() => {
                        navigator.clipboard.writeText('https://hydroaid.app/invite/team_xyz');
                        toast.success('Invite link copied to clipboard!');
                    }}>Get Custom Invite Link</Button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" required />
                <Input type="email" placeholder="Email Address" required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Phone Number (Optional)" />
                <Input placeholder="Class / Grade" />
            </div>
            <Input placeholder="School / College Name" required />
            <Select required>
                <SelectTrigger><SelectValue placeholder="Select Team to Join" /></SelectTrigger>
                <SelectContent className="bg-white">
                    {existingTeams.map(team => <SelectItem key={team} value={team}>{team}</SelectItem>)}
                    <SelectItem value="new">Request a New Team</SelectItem>
                </SelectContent>
            </Select>
            <Select required>
                <SelectTrigger><SelectValue placeholder="Your Role or Interest" /></SelectTrigger>
                <SelectContent className="bg-white">
                    {teamRoles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
                </SelectContent>
            </Select>
            <Textarea placeholder="Why do you want to join this cause?" required />
            <label htmlFor="logo-upload" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Upload Your Team Logo (Optional)
            </label>
            <input id="logo-upload" type="file" accept="image/*" className="hidden" />
            <div className="flex items-start space-x-2">
                <Checkbox id="consent" required />
                <label htmlFor="consent" className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    I agree to participate and share updates for HydroAid's mission.
                </label>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : 'Submit Application'}
            </Button>
        </form>
    );
};

export const JoinClassTeamModal = ({ buttonText, isUser }: { buttonText: string, isUser: boolean }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                {buttonText}
            </Button>
        </DialogTrigger>
        <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
                <DialogTitle className="text-2xl text-purple-800">Join the Student Movement</DialogTitle>
            </DialogHeader>
            <JoinClassTeamForm />
        </DialogContent>
    </Dialog>
); 