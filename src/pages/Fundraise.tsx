import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, Users, Target, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { JoinClassTeamModal } from '@/components/JoinClassTeamForm';

const Fundraise: React.FC = () => {
  const { user, updateUserProgress } = useAuth();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const fundingLevels = [
    {
      id: 1,
      name: "Basic Tap Installation",
      cost: 25,
      points: 100,
      description: "Install a basic water tap for a family",
      impact: "Provides clean water access for 1 family (5 people)",
      icon: "🚰",
      unlockLevel: 1
    },
    {
      id: 2,
      name: "Hand Pump Well",
      cost: 150,
      points: 500,
      description: "Build a hand pump well for community use",
      impact: "Serves 20-30 families with reliable water source",
      icon: "💧",
      unlockLevel: 2
    },
    {
      id: 3,
      name: "Solar Water Purification",
      cost: 500,
      points: 1500,
      description: "Install solar-powered water purification system",
      impact: "Provides clean, safe water for 100+ people",
      icon: "☀️",
      unlockLevel: 4
    },
    {
      id: 4,
      name: "Complete Water Infrastructure",
      cost: 2000,
      points: 5000,
      description: "Build comprehensive water system with storage",
      impact: "Transforms entire village water access (500+ people)",
      icon: "🏗️",
      unlockLevel: 6
    }
  ];

  const handleFunding = (level: any) => {
    if (user) {
      updateUserProgress(level.points);
      toast.success(`🎉 Thank you! You've funded ${level.name} and earned ${level.points} points!`);
      setSelectedLevel(null);
    }
  };

  const handleFundingRedirect = (level: any) => {
    navigate('/payment', { state: { level } });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
        <Navigation />
        <div className="pt-24 text-center">
          <p className="text-blue-600">Please log in to access fundraising options.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Navigation />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            💧 Fundraise for Impact
          </h1>
          <p className="text-xl text-blue-600 max-w-3xl mx-auto">
            Choose your funding level and watch villages transform in real-time. Each contribution unlocks new features and earns you Guardian points!
          </p>
        </div>

        {/* Current Progress */}
        <Card className="mb-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-6 w-6" />
              Your Impact Level: {user.level}
            </CardTitle>
            <CardDescription className="text-blue-100">
              You've contributed to {user.adoptedVillages?.length || 0} villages and earned {user.points} points
              {user.fundingHistory && user.fundingHistory.length > 0 && (
                <div className="text-sm text-blue-200 pt-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2"/>
                  Last donation: {new Date(user.fundingHistory[user.fundingHistory.length - 1].date).toLocaleDateString()}
                </div>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Funding Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {fundingLevels.map((level) => {
            const isUnlocked = (user.level || 1) >= level.unlockLevel;
            const isSelected = selectedLevel === level.id;
            
            return (
              <Card 
                key={level.id} 
                className={`transition-all duration-300 ${
                  isUnlocked 
                    ? 'hover:shadow-xl cursor-pointer border-blue-200' 
                    : 'opacity-60 border-gray-200'
                } ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''}`}
                onClick={() => isUnlocked && setSelectedLevel(isSelected ? null : level.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-blue-800 flex items-center">
                      <span className="text-2xl mr-3">{level.icon}</span>
                      {level.name}
                    </CardTitle>
                    <div className="flex flex-col items-end">
                      <Badge className={isUnlocked ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}>
                        {isUnlocked ? "Unlocked" : `Level ${level.unlockLevel}`}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-blue-600">
                    {level.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-800">${level.cost}</span>
                      <Badge variant="outline" className="text-cyan-600 border-cyan-300">
                        +{level.points} points
                      </Badge>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-700 font-medium mb-1">Impact:</p>
                      <p className="text-sm text-blue-600">{level.impact}</p>
                    </div>

                    {isSelected && (
                      <div className="border-t pt-4 space-y-4">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            This will unlock:
                          </h4>
                          <ul className="text-sm text-green-700 space-y-1">
                            <li>• Real-time village transformation updates</li>
                            <li>• Photo and video progress reports</li>
                            <li>• Direct communication with village community</li>
                            <li>• Exclusive achievement badges</li>
                          </ul>
                        </div>
                        
                        <Button 
                          onClick={() => handleFundingRedirect(level)}
                          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3"
                          disabled={!isUnlocked}
                        >
                          💸 Fund This Project
                        </Button>
                      </div>
                    )}
                    
                    {!isUnlocked && (
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">
                          Reach Level {level.unlockLevel} to unlock this option
                        </p>
                        <Progress 
                          value={((user.level || 1) / level.unlockLevel) * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Team Funding Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-800 flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Team Funding Challenge
            </CardTitle>
            <CardDescription className="text-purple-600">
              {user.role === 'user' ? 
                "Join forces with your classmates to fund bigger projects together!" :
                "Create or join a team to amplify your impact!"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">🎯 Group Challenge: Village Transformation</h4>
                <p className="text-sm text-purple-600 mb-3">
                  Team up to raise $5,000 and completely transform a village's water infrastructure
                </p>
                <div className="flex items-center space-x-4">
                  <Progress value={65} className="flex-1 h-3" />
                  <span className="text-sm font-medium text-purple-700">$3,250 / $5,000</span>
                </div>
              </div>
              
              <JoinClassTeamModal
                isUser={user.role === 'user'}
                buttonText={user.role === 'user' ? "Join Your Class Team" : "Create/Join Team"}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Fundraise;
