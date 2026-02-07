import React from 'react';
import Navigation from '../components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Droplets, Users, Trophy, Heart, Star, Target } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Navigation />
      
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-4">
            📚 HydroAid Guide
          </h1>
          <p className="text-xl text-blue-600">
            Learn how to become an effective Water Guardian and maximize your impact
          </p>
        </div>

        {/* Getting Started */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Droplets className="mr-2 h-6 w-6" />
              Getting Started
            </CardTitle>
            <CardDescription>Your journey to becoming a Water Guardian</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-800">1. Create Your Account</h4>
                <p className="text-blue-600 text-sm">Choose between Individual or Student Guardian to unlock different features and team capabilities.</p>
                
                <h4 className="font-semibold text-blue-800">2. Explore the HydroMap</h4>
                <p className="text-blue-600 text-sm">Browse villages worldwide that need water infrastructure support.</p>
                
                <h4 className="font-semibold text-blue-800">3. Adopt Your First Village</h4>
                <p className="text-blue-600 text-sm">Start with an "Easy" difficulty village to learn the system.</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-blue-800">4. Fund Projects</h4>
                <p className="text-blue-600 text-sm">Choose from different funding levels based on your Guardian level.</p>
                
                <h4 className="font-semibold text-blue-800">5. Track Progress</h4>
                <p className="text-blue-600 text-sm">Watch your villages transform and earn points for your contributions.</p>
                
                <h4 className="font-semibold text-blue-800">6. Level Up</h4>
                <p className="text-blue-600 text-sm">Unlock new features, funding options, and village access.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed FAQ */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="points">
                <AccordionTrigger className="text-blue-800">How do I earn points?</AccordionTrigger>
                <AccordionContent className="text-blue-600">
                  <ul className="space-y-2">
                    <li>• <strong>Funding Projects:</strong> 100-5000 points based on funding level</li>
                    <li>• <strong>Adopting Villages:</strong> 200 points per village</li>
                    <li>• <strong>Team Participation:</strong> Bonus points for group achievements</li>
                    <li>• <strong>Milestones:</strong> Achievement badges award extra points</li>
                    <li>• <strong>Sharing:</strong> Social media sharing earns community points</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="levels">
                <AccordionTrigger className="text-blue-800">What do Guardian levels unlock?</AccordionTrigger>
                <AccordionContent className="text-blue-600">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-700">Level 1-2</Badge>
                      <span>Basic taps and hand pumps</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-700">Level 3-4</Badge>
                      <span>Solar purification systems</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-purple-100 text-purple-700">Level 5-6</Badge>
                      <span>Complete infrastructure projects</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-700">Level 7+</Badge>
                      <span>Advanced team leadership and special villages</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="teams">
                <AccordionTrigger className="text-blue-800">How do teams work?</AccordionTrigger>
                <AccordionContent className="text-blue-600">
                  <p className="mb-3">Teams are perfect for students, classes, or groups of friends:</p>
                  <ul className="space-y-2">
                    <li>• <strong>Create/Join Teams:</strong> Students can form teams automatically</li>
                    <li>• <strong>Shared Goals:</strong> Pool resources for bigger projects</li>
                    <li>• <strong>Leaderboards:</strong> Compete with other teams globally</li>
                    <li>• <strong>Group Achievements:</strong> Unlock exclusive team badges</li>
                    <li>• <strong>Progress Sharing:</strong> See everyone's contributions in real-time</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="villages">
                <AccordionTrigger className="text-blue-800">How are villages selected?</AccordionTrigger>
                <AccordionContent className="text-blue-600">
                  <p className="mb-3">Villages are carefully chosen based on real need:</p>
                  <ul className="space-y-2">
                    <li>• <strong>Partnership:</strong> We work with local NGOs and communities</li>
                    <li>• <strong>Assessment:</strong> Each village undergoes needs assessment</li>
                    <li>• <strong>Transparency:</strong> Regular updates with photos and progress reports</li>
                    <li>• <strong>Sustainability:</strong> Focus on long-term solutions and maintenance</li>
                    <li>• <strong>Community Input:</strong> Local voices guide all development decisions</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="impact">
                <AccordionTrigger className="text-blue-800">How can I track my real-world impact?</AccordionTrigger>
                <AccordionContent className="text-blue-600">
                  <ul className="space-y-2">
                    <li>• <strong>Progress Photos:</strong> Before, during, and after project images</li>
                    <li>• <strong>Video Updates:</strong> Monthly reports from village communities</li>
                    <li>• <strong>Impact Metrics:</strong> People served, water quality improvements</li>
                    <li>• <strong>Community Stories:</strong> Personal messages from beneficiaries</li>
                    <li>• <strong>GPS Tracking:</strong> Exact location and status of your projects</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Game Mechanics */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Trophy className="mr-2 h-6 w-6" />
              Game Mechanics & Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 mb-2">Team Play</h4>
                <p className="text-sm text-blue-600">Form teams with friends or classmates to tackle bigger challenges together.</p>
              </div>
              
              <div className="text-center">
                <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 mb-2">Achievements</h4>
                <p className="text-sm text-blue-600">Unlock badges and special recognition for your water conservation efforts.</p>
              </div>
              
              <div className="text-center">
                <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold text-blue-800 mb-2">Missions</h4>
                <p className="text-sm text-blue-600">Complete daily and weekly challenges to boost your Guardian level.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center">
              <Users className="mr-2 h-6 w-6" />
              Special Features for Students
            </CardTitle>
            <CardDescription>Enhanced collaboration tools for educational settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🏫 Classroom Integration</h4>
                <p className="text-blue-600 text-sm">Teachers can create class teams and track student engagement with water conservation projects.</p>
              </div>
              
              <div className="bg-cyan-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🤝 Peer Learning</h4>
                <p className="text-blue-600 text-sm">Students learn about global water issues while developing teamwork and leadership skills.</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Progress Tracking</h4>
                <p className="text-blue-600 text-sm">Detailed analytics help educators measure student engagement and learning outcomes.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Help;
