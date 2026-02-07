import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { Card } from '@/components/ui/card';
import { Droplets, Heart, Users, Award, AlertTriangle, MessageCircle } from 'lucide-react';
import { ReportIssueModal } from "@/components/ReportIssue";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/10 to-blue-800/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-800 bg-clip-text text-transparent animate-pulse">
              Adopt a Thirsty Village
            </h1>
            <h2 className="text-3xl md:text-5xl font-semibold text-blue-700 animate-bounce">
              Play • Transform • Repeat
            </h2>
            <p className="text-xl md:text-2xl text-blue-600 max-w-4xl mx-auto leading-relaxed">
              Join the HydroAid and become a Water Guardian. Help transform villages one drop at a time through fundrasing missions and real-world impact.
            </p>
            <Link to="/signin">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 text-xl shadow-xl transform hover:scale-105 transition-all duration-300">
                <Droplets className="mr-2 h-6 w-6" />
                Become a Water Guardian
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 mb-4">Transform Villages Through Play</h3>
            <p className="text-lg text-blue-600">Experience the power of gamified water conservation</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Adopt Villages</h4>
              <p className="text-blue-600">Choose from real villages in need and watch them transform as you contribute</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200 shadow-lg hover:shadow-xl transition-shadow">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Team Play</h4>
              <p className="text-blue-600">Form teams with friends or classmates and compete to develop villages faster</p>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-blue-800 mb-2">Level Up</h4>
              <p className="text-blue-600">Earn points, unlock achievements, and climb the leaderboards</p>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h3>
          <p className="text-xl mb-8 opacity-90">Join thousands of Water Guardians transforming communities worldwide</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signin">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                Get Started
              </Button>
            </Link>
            <Link to="/help">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Report Water Issues Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <AlertTriangle className="h-16 w-16 text-orange-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-blue-800 mb-4">Report Water Issues in Your Area</h3>
            <p className="text-lg text-blue-600 mb-8">Help us identify communities that need water assistance</p>
            <ReportIssueModal />
          </div>
        </div>
      </section>

      {/* Community Connection Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow-lg p-8 border border-blue-200">
            <MessageCircle className="h-16 w-16 text-blue-500 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-blue-800 mb-4">Connect With Our Community</h3>
            <p className="text-lg text-blue-600 mb-8">Get in touch with water guardians and support teams</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold">
                Join Community
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
