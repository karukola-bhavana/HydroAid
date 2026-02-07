import React, { useState, useContext, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '../context/AuthContext';
import { Droplets, Trophy, Users, Heart, TrendingUp, UserPlus, MessageCircle, Gift, MapPin, Globe, Filter, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface FetchedUser {
    _id: string;
    email: string;
    name: string;
    role: string;
}

const UserDashboard: React.FC = () => {
  const { user, adoptVillage } = useAuth();
  const [selectedTeammates, setSelectedTeammates] = useState<string[]>([]);
  const [showTeamDialog, setShowTeamDialog] = useState(false);
  const [allUsers, setAllUsers] = useState<FetchedUser[]>([]);
  const [showJoinTeamDialog, setShowJoinTeamDialog] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [showVillageDialog, setShowVillageDialog] = useState(false);
  const [mapFilter, setMapFilter] = useState('all');

  useEffect(() => {
    if (showTeamDialog) {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/auth/users');
                if (response.ok) {
                    const data = await response.json();
                    setAllUsers(data.filter((u: FetchedUser) => u.role === 'user' && u.email !== user?.email));
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
  }, [showTeamDialog, user?.email]);

  if (!user || user.role !== 'user') {
    return <div>Access denied. User dashboard only.</div>;
  }

  const nextLevelPoints = (user.level || 1) * 500;
  const progressToNextLevel = (((user.points || 0) % 500) / 500) * 100;

  // Mock data for villages worldwide that need water infrastructure
  const villagesWorldwide = [
    {
      id: 'village-1',
      name: 'Sunshine Valley',
      country: 'Kenya',
      region: 'Eastern Africa',
      population: 2500,
      waterAccess: 15,
      urgency: 'Critical',
      description: 'Village faces severe water scarcity with only 15% of population having access to clean water.',
      coordinates: { lat: -1.2921, lng: 36.8219 },
      needs: ['Hand pumps', 'Water storage tanks', 'Purification systems'],
      estimatedCost: 15000,
      impact: 'Will provide clean water to 2,500 people',
      status: 'adopted'
    },
    {
      id: 'village-2',
      name: 'Hope Springs',
      country: 'India',
      region: 'South Asia',
      population: 1800,
      waterAccess: 25,
      urgency: 'High',
      description: 'Community relies on contaminated water sources leading to waterborne diseases.',
      coordinates: { lat: 20.5937, lng: 78.9629 },
      needs: ['Solar water pumps', 'Filtration systems', 'Community training'],
      estimatedCost: 12000,
      impact: 'Will serve 1,800 people and reduce disease rates by 80%',
      status: 'adopted'
    },
    {
      id: 'village-3',
      name: 'Mountain View',
      country: 'Nepal',
      region: 'South Asia',
      population: 3200,
      waterAccess: 8,
      urgency: 'Critical',
      description: 'Remote mountain village with extremely limited water access during dry seasons.',
      coordinates: { lat: 28.3949, lng: 84.1240 },
      needs: ['Gravity-fed systems', 'Reservoirs', 'Pipelines'],
      estimatedCost: 25000,
      impact: 'Will provide year-round water access to 3,200 people',
      status: 'available'
    },
    {
      id: 'village-4',
      name: 'Desert Oasis',
      country: 'Mali',
      region: 'West Africa',
      population: 1500,
      waterAccess: 5,
      urgency: 'Critical',
      description: 'Desert community with almost no access to clean water sources.',
      coordinates: { lat: 17.5707, lng: -3.9962 },
      needs: ['Deep wells', 'Solar pumps', 'Water towers'],
      estimatedCost: 18000,
      impact: 'Will transform life for 1,500 people in desert conditions',
      status: 'available'
    },
    {
      id: 'village-5',
      name: 'River Bend',
      country: 'Bangladesh',
      region: 'South Asia',
      population: 4200,
      waterAccess: 30,
      urgency: 'Medium',
      description: 'Flood-prone area where water sources are contaminated during monsoon seasons.',
      coordinates: { lat: 23.6850, lng: 90.3563 },
      needs: ['Elevated water systems', 'Flood protection', 'Purification units'],
      estimatedCost: 22000,
      impact: 'Will provide safe water to 4,200 people year-round',
      status: 'available'
    },
    {
      id: 'village-6',
      name: 'Highland Haven',
      country: 'Ethiopia',
      region: 'Eastern Africa',
      population: 2800,
      waterAccess: 12,
      urgency: 'High',
      description: 'Highland community struggling with seasonal water shortages.',
      coordinates: { lat: 9.1450, lng: 40.4897 },
      needs: ['Spring protection', 'Storage tanks', 'Distribution networks'],
      estimatedCost: 16000,
      impact: 'Will ensure water security for 2,800 people',
      status: 'available'
    }
  ];

  const filteredVillages = villagesWorldwide.filter(village => {
    if (mapFilter === 'all') return true;
    if (mapFilter === 'available') return village.status === 'available';
    if (mapFilter === 'adopted') return village.status === 'adopted';
    if (mapFilter === 'critical') return village.urgency === 'Critical';
    return true;
  });

  const availableTeammates = [
    { id: '1', name: 'Sarah Chen', level: 4, points: 2450, online: true, status: 'available' },
    { id: '2', name: 'Mike Johnson', level: 3, points: 2120, online: false, status: 'available' },
    { id: '3', name: 'Alex Wilson', level: 2, points: 1180, online: true, status: 'in-team' },
    { id: '4', name: 'Emma Davis', level: 5, points: 3200, online: true, status: 'available' },
    { id: '5', name: 'David Lee', level: 3, points: 1850, online: false, status: 'available' },
  ];

  const handleTeammateSelect = (email: string) => {
    // Note: This logic assumes emails are unique identifiers for users.
    setSelectedTeammates(prev => 
      prev.includes(email) 
        ? prev.filter(id => id !== email)
        : [...prev, email]
    );
  };

  const handleCreateTeam = () => {
    if (selectedTeammates.length === 0) {
      toast.error("Please select at least one teammate.");
      return;
    }
    const selectedNames = selectedTeammates.join(', ');    
    toast.success(`Team created with ${selectedNames}! You can now collaborate on village projects.`);
    setShowTeamDialog(false);
    setSelectedTeammates([]);
  };

  const handleInviteTeammate = (teammateId: string) => {
    const teammate = availableTeammates.find(t => t.id === teammateId);
    toast.success(`Team invitation sent to ${teammate?.name}!`);
  };

  const handleMessageTeammate = (teammateId: string) => {
    const teammate = availableTeammates.find(t => t.id === teammateId);
    toast.info(`Opening chat with ${teammate?.name}`);
  };

  const handleVillageSelect = (village: any) => {
    setSelectedVillage(village);
    setShowVillageDialog(true);
  };

  const handleAdoptVillage = (villageId: string) => {
    adoptVillage(villageId);
    toast.success(`You've successfully adopted ${selectedVillage?.name}!`);
    setShowVillageDialog(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-blue-600">Your impact dashboard • Level {user.level} Water Guardian</p>
      </div>

      {/* User Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(user.points || 0).toLocaleString()}</div>
            <div className="flex items-center mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">+{Math.floor((user.points || 0) * 0.1)} this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Current Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Level {user.level}</div>
            <div className="flex items-center mt-1">
              <Trophy className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">Water Guardian</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Villages Adopted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(user.adoptedVillages || []).length}</div>
            <div className="flex items-center mt-1">
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">Active projects</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Team Rank</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">#7</div>
            <div className="flex items-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">Global leaderboard</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Team Collaboration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">Team Collaboration</CardTitle>
              <CardDescription>Form teams with other Water Guardians to multiply your impact</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-4">
                  <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Create Your Team!</h3>
                  <p className="text-blue-600 mb-4">Team up with other guardians to develop villages faster and earn bonus rewards</p>
                  
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    <Dialog open={showTeamDialog} onOpenChange={setShowTeamDialog}>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Form New Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white max-w-md">
                        <DialogHeader>
                          <DialogTitle>Select Teammates</DialogTitle>
                          <DialogDescription>
                            Choose other Water Guardians to form your team.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                          {allUsers.map((teammate) => (
                            <div key={teammate._id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-blue-50">
                              <Checkbox
                                id={teammate._id}
                                checked={selectedTeammates.includes(teammate.email)}
                                onCheckedChange={() => handleTeammateSelect(teammate.email)}
                              />
                              <div className="flex-1">
                                  <label htmlFor={teammate._id} className="font-medium text-blue-800 cursor-pointer">
                                    {teammate.name} ({teammate.email})
                                  </label>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button onClick={() => setShowTeamDialog(false)} variant="ghost">Cancel</Button>
                          <Button onClick={handleCreateTeam} className="ml-2 bg-blue-600 hover:bg-blue-700 text-white">
                            Create Team ({selectedTeammates.length})
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={showJoinTeamDialog} onOpenChange={setShowJoinTeamDialog}>
                      <DialogTrigger asChild>
                         <Button 
                          variant="outline"
                          onClick={() => setShowJoinTeamDialog(true)}
                        >
                          Join Existing Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-white max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-gray-800">Join an Existing Team</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <p className="text-gray-600">Enter the Team ID or name to send a request to join.</p>
                            <Input placeholder="Enter Team ID or Name..." />
                            <Button onClick={() => toast.success('Request to join team sent!')} className="w-full">Send Join Request</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Gift className="h-4 w-4 text-green-600 mx-auto mb-1" />
                      <p className="font-medium text-green-800">Team Bonuses</p>
                      <p className="text-green-600">+25% points for team projects</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <p className="font-medium text-blue-800">Shared Goals</p>
                      <p className="text-blue-600">Unlock exclusive challenges</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User's Adopted Village Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-800">My Adopted Villages</CardTitle>
              <CardDescription>Track the progress of your sponsored water projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {villagesWorldwide.filter(v => user.adoptedVillages?.includes(v.id)).map((village) => (
                  <div key={village.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-blue-800">{village.name}, {village.country}</h4>
                        <p className="text-sm text-blue-600">Population: {village.population}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-700">In Progress</Badge>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-blue-700">Project Progress</span>
                        <span className="text-sm font-bold text-blue-700">65%</span>
                      </div>
                      <Progress value={65} className="w-full" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button variant="outline" size="sm" onClick={() => handleVillageSelect(village)}>
                        View Project Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Leaderboard</CardTitle>
            <CardDescription>Top Water Guardians worldwide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableTeammates
                .sort((a, b) => b.points - a.points)
                .map((guardian, index) => (
                <div key={guardian.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50">
                  <span className="font-bold text-lg text-blue-700 w-6 text-center">{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">{guardian.name}</p>
                    <p className="text-sm text-blue-600">{guardian.points.toLocaleString()} points</p>
                  </div>
                  <Badge variant={index < 3 ? 'default' : 'secondary'} className={index < 3 ? 'bg-yellow-400 text-yellow-900' : ''}>
                    Top {index < 3 ? '3' : '10'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Browse Villages Worldwide Map */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-blue-800">Browse Villages Worldwide</CardTitle>
              <CardDescription>Discover and adopt communities in need of clean water</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500"/>
              <Select value={mapFilter} onValueChange={setMapFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter villages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Villages</SelectItem>
                  <SelectItem value="available">Available to Adopt</SelectItem>
                  <SelectItem value="adopted">Adopted by Me</SelectItem>
                  <SelectItem value="critical">Critical Urgency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVillages.map((village) => (
              <Card key={village.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-4 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-blue-800">{village.name}</h4>
                    <Badge className={getUrgencyColor(village.urgency)}>{village.urgency}</Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-1"/>
                    <span>{village.country}, {village.region}</span>
                  </div>
                  <p className="text-sm text-gray-700 h-16 overflow-hidden">{village.description}</p>
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={() => handleVillageSelect(village)}
                      disabled={user.adoptedVillages?.includes(village.id)}
                      className={user.adoptedVillages?.includes(village.id) ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-600'}
                    >
                      {user.adoptedVillages?.includes(village.id) ? 'Already Adopted' : 'View Details'}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Village Details Dialog */}
      <Dialog open={showVillageDialog} onOpenChange={setShowVillageDialog}>
        <DialogContent className="bg-white max-w-2xl">
          {selectedVillage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-blue-800">{selectedVillage.name}, {selectedVillage.country}</DialogTitle>
                <DialogDescription className="flex items-center pt-2">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500"/> {selectedVillage.region}
                  <Badge className={`ml-4 ${getUrgencyColor(selectedVillage.urgency)}`}>{selectedVillage.urgency} Urgency</Badge>
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <p className="text-gray-700">{selectedVillage.description}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700 font-semibold">Population</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedVillage.population.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-sm text-red-700 font-semibold">Current Water Access</p>
                    <p className="text-2xl font-bold text-red-900">{selectedVillage.waterAccess}%</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-blue-800 mb-2">Project Needs:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {selectedVillage.needs.map((need: string, index: number) => (
                      <li key={index}>{need}</li>
                    ))}
                  </ul>
                </div>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <Info className="h-8 w-8 text-green-600 mr-4"/>
                      <div>
                        <h4 className="font-bold text-green-800">Estimated Impact</h4>
                        <p className="text-green-700">{selectedVillage.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Estimated Project Cost</p>
                  <p className="text-2xl font-bold text-gray-800">${selectedVillage.estimatedCost.toLocaleString()}</p>
                </div>
                <Button 
                  size="lg" 
                  onClick={() => handleAdoptVillage(selectedVillage.id)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={user.adoptedVillages?.includes(selectedVillage.id)}
                >
                  {user.adoptedVillages?.includes(selectedVillage.id) ? 'Already Adopted' : 'Adopt this Village'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;
