import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { CreditCard, CheckCircle, ArrowLeft } from 'lucide-react';

const PaymentPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { fundProject } = useAuth();
    const { level } = state || {};

    if (!level) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <p>No project selected for funding. Please go back and select a project.</p>
                <Button onClick={() => navigate('/fundraise')} className="mt-4">Back to Fundraise</Button>
            </div>
        );
    }

    const handleConfirmPayment = () => {
        fundProject(level.id, level.cost, level.points);
        toast.success(`Payment confirmed! You successfully funded "${level.name}".`);
        navigate('/fundraise');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Button onClick={() => navigate(-1)} variant="ghost" className="absolute top-4 left-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center">
                        <CreditCard className="mr-3 h-6 w-6 text-blue-600"/>
                        Confirm Your Donation
                    </CardTitle>
                    <CardDescription>You are funding: <span className="font-bold text-blue-700">{level.name}</span></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded-lg">
                            <div className="flex justify-between text-lg">
                                <span>Donation Amount:</span>
                                <span className="font-bold text-gray-800">${level.cost}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-600">
                                <span>Points to be Earned:</span>
                                <span className="font-semibold">{level.points}</span>
                            </div>
                        </div>
                        <div className="text-xs text-gray-500 text-center">
                            This is a simulated payment gateway for demonstration purposes.
                        </div>
                        <Button onClick={handleConfirmPayment} className="w-full text-lg py-6 bg-green-600 hover:bg-green-700">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Confirm Payment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PaymentPage; 