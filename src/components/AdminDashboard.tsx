import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  Activity,
  Eye,
  MapPin,
  Settings,
  FileText,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users as UsersIcon,
  CreditCard,
  PieChart,
  PlusCircle,
  Search,
  FileDown,
  UserCheck,
  UserX,
  UserPlus,
  FileText as FileTextIcon,
  Mail,
  Calendar,
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { io } from 'socket.io-client';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// -----------------------------
// Mock data (demo) - replace with real API
// -----------------------------
const mockBreakdown = {
  topTeams: ['Aqua Avengers', 'Hydro Heroes'],
  topUsers: ['Sarah Chen', 'Mike Johnson'],
  sources: [
    { name: 'Google Pay', amount: 1200 },
    { name: 'PayPal', amount: 800 },
    { name: 'UPI', amount: 500 },
  ],
  allocation: [
    { name: 'Water Pumps', percent: 40 },
    { name: 'Transport', percent: 25 },
    { name: 'Maintenance', percent: 20 },
    { name: 'Other', percent: 15 },
  ],
  campaigns: ['Clean Water Drive', 'Village Pipeline Launch'],
  donations: [1200, 1500, 1800, 2500, 3200],
};

const mockUsers = [
  { id: 1, name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', joined: '2023-01-10', status: 'active', donations: 5 },
  { id: 2, name: 'Mike Johnson', email: 'mike@example.com', role: 'team lead', joined: '2023-02-15', status: 'suspended', donations: 2 },
  { id: 3, name: 'Alex Wilson', email: 'alex@example.com', role: 'user', joined: '2023-03-20', status: 'active', donations: 1 },
  { id: 4, name: 'Emma Davis', email: 'emma@example.com', role: 'NGO', joined: '2023-04-05', status: 'blocked', donations: 0 },
];

const reportTypes = [
  { value: 'user-activity', label: 'User Activity Report' },
  { value: 'fundraising', label: 'Fundraising Summary' },
  { value: 'issues', label: 'Issue Reports by Region' },
  { value: 'impact', label: 'Impact Report (Villages, Pipelines)' },
  { value: 'performance', label: 'Performance Dashboard (Monthly/Quarterly)' },
];

const mockAlerts = [
  { id: 1, type: 'Critical', title: 'Multiple Failed Logins', desc: '5 failed login attempts detected in 10 minutes.', time: '2 min ago', resolved: false },
  { id: 2, type: 'Warning', title: 'Donation Drop', desc: 'Donations fell below $500 today.', time: '1 hour ago', resolved: false },
  { id: 3, type: 'Info', title: 'API Error', desc: 'Fundraising form API returned error.', time: 'Yesterday', resolved: true },
  { id: 4, type: 'Critical', title: 'Urgent Community Need', desc: 'Village X flagged urgent water need.', time: '5 min ago', resolved: false },
];

// -----------------------------
// Admin Dashboard Component
// -----------------------------
const AdminDashboard: React.FC = () => {
  // sample historical daily funds
  const dailyFunds = [
    { date: '2024-01-15', amount: 2500, projects: 3 },
    { date: '2024-01-14', amount: 3200, projects: 5 },
    { date: '2024-01-13', amount: 1800, projects: 2 },
    { date: '2024-01-12', amount: 4100, projects: 7 },
    { date: '2024-01-11', amount: 2900, projects: 4 },
  ];

  const userActivity = [
    { user: 'Sarah Chen', role: 'user', lastActive: '2 hours ago', points: 2450, villages: 2 },
    { user: 'Mike Johnson', role: 'user', lastActive: '5 hours ago', points: 2120, villages: 1 },
    { user: 'Alex Wilson', role: 'user', lastActive: '1 day ago', points: 1180, villages: 3 },
    { user: 'Water Aid NGO', role: 'department', lastActive: '30 mins ago', points: 0, villages: 15 },
    { user: 'Clean Water Dept', role: 'department', lastActive: '4 hours ago', points: 0, villages: 8 },
  ];

  // UI state
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('user-activity');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [settings, setSettings] = useState({
    joinClassTeam: true,
    reportIssues: true,
    donationThreshold: 500,
    banner: 'Welcome to HydroAid!',
    darkMode: false,
    audioRead: false,
  });
  const [alertSeverity, setAlertSeverity] = useState('All');
  const [alerts, setAlerts] = useState(mockAlerts);
  const [donations, setDonations] = useState<any[]>([]);
  const [waterReports, setWaterReports] = useState<any[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalUsers: 0,
    dailyRevenue: 0,
    activeProjects: 0,
    systemHealth: 98,
  });

  useEffect(() => {
    // NOTE: in production replace localhost with env variable
    // const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5001', { transports: ['websocket'] });
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001', {
      transports: ['websocket'],
    });

    socket.emit('join-admin');

    // Fetch initial data (demo endpoints)
    // fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001') + '/api/stats/donations/live')
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5001') + '/api/stats/donations/live')
      .then(res => res.json())
      .then(data => setDonations(Array.isArray(data) ? data : []))
      .catch(() => setDonations([]));

    // fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001') + '/api/stats/dashboard')
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5001') + '/api/stats/dashboard')
      .then(res => res.json())
      .then(data => {
        setLiveStats({
          totalUsers: data.users?.reduce((acc: any, user: any) => acc + (user.count || 0), 0) || 0,
          dailyRevenue: data.today?.donations || 0,
          activeProjects: data.projects?.find((p: any) => p._id === 'in_progress')?.count || 0,
          systemHealth: 98,
        });
      })
      .catch(() => { });

    // Socket listeners
    socket.on('new-donation', (donation: any) => {
      setDonations(prev => [donation, ...prev].slice(0, 50));
      setLiveStats(prev => ({ ...prev, dailyRevenue: prev.dailyRevenue + (donation.amount || 0) }));
    });

    socket.on('project-status-change', (project: any) => {
      setLiveStats(prev => ({
        ...prev,
        activeProjects: project.status === 'in_progress' ? prev.activeProjects + 1 : prev.activeProjects,
      }));
    });

    // ✅ Listen to water reports from Firestore (hydro-aid project)
    const reportsQuery = query(
      collection(db, "waterReports"),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribeReports = onSnapshot(reportsQuery, (snapshot) => {
      const reports = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("📊 Water reports updated:", reports.length, "reports");
      console.log("📊 Reports data:", reports);
      setWaterReports(reports);
    }, (error) => {
      console.error("❌ Error listening to water reports:", error);
      console.error("❌ Error details:", {
        code: error.code,
        message: error.message
      });
      
      // Check for local storage reports as fallback
      try {
        const localReports = JSON.parse(localStorage.getItem('waterReports') || '[]');
        if (localReports.length > 0) {
          console.log("📱 Using local storage reports as fallback:", localReports.length);
          setWaterReports(localReports);
        } else {
          setWaterReports([]);
        }
      } catch (localErr) {
        console.error("❌ Local storage also failed:", localErr);
        setWaterReports([]);
      }
    });

    return () => {
      socket.disconnect();
      unsubscribeReports();
    };
  }, []);

  // Test function to create a donation (for testing real-time updates)
  const createTestDonation = async () => {
    try {
      // const response = await fetch((process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5001') + '/api/stats/donations', {
      const response = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5001') + '/api/stats/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.floor(Math.random() * 100) + 10,
          projectId: 'test-project-' + Date.now(),
          paymentMethod: 'credit_card',
          departmentId: 'test-dept',
          anonymous: false,
        }),
      });

      if (response.ok) {
        toast.success('Test donation created! Check the live feed.');
      } else {
        toast.error('Failed to create test donation');
      }
    } catch (error) {
      toast.error('Error creating test donation');
    }
  };

  // responsive helper classes used inline below
  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-1">Admin Control Center</h1>
        <p className="text-sm sm:text-base text-blue-600">Complete platform monitoring and management</p>
      </div>

      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-800 font-semibold">Welcome to the Admin Control Center!</AlertTitle>
        <AlertDescription className="text-blue-700">
          This is your central hub for monitoring all platform activity. The top statistic cards and live donation feed show
          real-time data. Use the "Create Test Donation" button to see live updates in action!
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex gap-2">
          <Button onClick={createTestDonation} className="bg-green-600 hover:bg-green-700 text-white">🧪 Create Test Donation</Button>
          <Button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Dashboard link copied!'); }} className="hidden sm:inline-flex">Share</Button>
        </div>
        <div className="text-sm text-gray-600">Live • {new Date().toLocaleString()}</div>
      </div>

      {/* Admin Stats - responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{liveStats.totalUsers}</div>
            <div className="flex items-center mt-1 text-sm opacity-90">
              <Users className="h-4 w-4 mr-1" /> Live count
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">${liveStats.dailyRevenue}</div>
            <div className="flex items-center mt-1 text-sm opacity-90">
              <DollarSign className="h-4 w-4 mr-1" /> Live updates
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{liveStats.activeProjects}</div>
            <div className="flex items-center mt-1 text-sm opacity-90">
              <Activity className="h-4 w-4 mr-1" /> Real-time
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">{liveStats.systemHealth}%</div>
            <div className="flex items-center mt-1 text-sm opacity-90">Live monitoring</div>
          </CardContent>
        </Card>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Revenue Analytics</CardTitle>
            <CardDescription>Daily funding collection and project metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dailyFunds.map((day, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-800">{day.date}</p>
                    <p className="text-sm text-blue-600">{day.projects} new projects</p>
                  </div>
                  <div className="mt-3 sm:mt-0 text-right">
                    <p className="font-bold text-green-600">${day.amount}</p>
                    <div className="mt-2 flex items-center gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => { setSelectedDay(day); setShowRevenueModal(true); }}>Details</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Revenue Modal (reuse Dialog) */}
            <Dialog open={showRevenueModal} onOpenChange={(o) => { setShowRevenueModal(o); if (!o) setSelectedDay(null); }}>
              <DialogContent className="bg-white max-w-3xl w-full">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-blue-800 text-2xl mb-2">💵 Daily Revenue Breakdown</DialogTitle>
                  <DialogDescription className="text-blue-700 mb-2">
                    {selectedDay ? `${selectedDay.date} ${selectedDay.amount} raised` : '—'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="mb-3">
                      <div className="font-semibold text-blue-800 flex items-center gap-2"><UsersIcon className="h-4 w-4" />Top Teams</div>
                      <ul className="text-blue-700 text-sm ml-5 list-disc">
                        {mockBreakdown.topTeams.map((team) => (
                          <li key={team}>{team}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <div className="font-semibold text-blue-800 flex items-center gap-2"><UsersIcon className="h-4 w-4" />Top Users</div>
                      <ul className="text-blue-700 text-sm ml-5 list-disc">
                        {mockBreakdown.topUsers.map((user) => (
                          <li key={user}>{user}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <div className="font-semibold text-blue-800 flex items-center gap-2"><CreditCard className="h-4 w-4" />Donation Sources</div>
                      <ul className="text-blue-700 text-sm ml-5 list-disc">
                        {mockBreakdown.sources.map((src) => (
                          <li key={src.name}>{src.name}: ${src.amount}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <div className="mb-3">
                      <div className="font-semibold text-blue-800 flex items-center gap-2"><PieChart className="h-4 w-4" />Fund Allocation</div>
                      <ul className="text-blue-700 text-sm ml-5 list-disc">
                        {mockBreakdown.allocation.map((a) => (
                          <li key={a.name}>{a.name}: {a.percent}%</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <div className="font-semibold text-blue-800 flex items-center gap-2"><PlusCircle className="h-4 w-4" />New Campaigns</div>
                      <ul className="text-blue-700 text-sm ml-5 list-disc">
                        {mockBreakdown.campaigns.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <div className="font-semibold text-blue-800 flex items-center gap-2">📈 Donation Growth</div>
                      <svg width="100%" height="60" viewBox="0 0 200 60" role="img" aria-label="Donation growth chart">
                        <polyline fill="none" stroke="#2563eb" strokeWidth="3" points="0,50 40,40 80,30 120,20 160,10 200,5" />
                        <circle cx="0" cy="50" r="3" fill="#2563eb" />
                        <circle cx="40" cy="40" r="3" fill="#2563eb" />
                        <circle cx="80" cy="30" r="3" fill="#2563eb" />
                        <circle cx="120" cy="20" r="3" fill="#2563eb" />
                        <circle cx="160" cy="10" r="3" fill="#2563eb" />
                        <circle cx="200" cy="5" r="3" fill="#2563eb" />
                      </svg>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* User Activity Monitor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">User Activity Monitor</CardTitle>
            <CardDescription>Real-time user engagement tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userActivity.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{user.user}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'user' ? 'default' : 'secondary'}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{user.lastActive}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => toast.info(`Opening detailed view for ${user.user}`)} className="h-6 px-2">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Live Donation Feed (spans full width on small) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Live Donation Feed</CardTitle>
          <CardDescription>Latest donations (real-time)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {donations.length === 0 ? (
              <div className="text-gray-500">No donations yet. Click "Create Test Donation" to see live updates!</div>
            ) : (
              donations.map((donation, idx) => (
                <div key={donation._id || idx} className="flex items-center justify-between p-2 border-b last:border-b-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-blue-700 truncate">{donation.userId?.name || 'Anonymous'}</span>
                      <span className="text-gray-500 text-xs truncate">{donation.userId?.email}</span>
                    </div>
                    <div className="text-xs text-gray-600 truncate">Project: {donation.projectId}</div>
                  </div>
                  <div className="font-bold text-green-600 ml-4 whitespace-nowrap">${donation.amount}</div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Water Issue Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Water Issue Reports
              </CardTitle>
              <CardDescription>Latest water issue reports from users (real-time)</CardDescription>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                console.log("🔄 Manually refreshing water reports...");
                // Force re-fetch by updating the query
                const reportsQuery = query(
                  collection(db, "waterReports"),
                  orderBy("createdAt", "desc")
                );
                onSnapshot(reportsQuery, (snapshot) => {
                  const reports = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                  }));
                  console.log("🔄 Manual refresh - Water reports:", reports.length, "reports");
                  setWaterReports(reports);
                });
              }}
            >
              🔄 Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {waterReports.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No water issue reports yet. Reports will appear here when users submit them.
              </div>
            ) : (
              waterReports.map((report, idx) => (
                <div key={report.id || idx} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={report.priority === 'high' ? 'destructive' : report.priority === 'medium' ? 'default' : 'secondary'}>
                          {report.priority}
                        </Badge>
                        <Badge variant="outline">{report.status}</Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-blue-800 mb-1">{report.issueType}</h4>
                      <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>
                      <strong>Reporter:</strong> {report.reporterName || report.name || 'Anonymous'}
                    </div>
                    <div>
                      <strong>Email:</strong> {report.reporterEmail || report.contact}
                    </div>
                    <div>
                      <strong>User ID:</strong> {report.reporterId || 'Guest'}
                    </div>
                    <div>
                      <strong>Role:</strong> {report.reporterRole || 'guest'}
                    </div>
                    <div>
                      <strong>Location:</strong> {report.country}, {report.stateProvince}
                    </div>
                    <div>
                      <strong>Coordinates:</strong> {report.latitude?.toFixed(4)}, {report.longitude?.toFixed(4)}
                    </div>
                    {report.fileName && (
                      <div className="sm:col-span-2">
                        <strong>Attachment:</strong> {report.fileName}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => toast.success('Marked as reviewed')}>
                      <Eye className="h-3 w-3 mr-1" />
                      Mark Reviewed
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success('Priority updated')}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Update Priority
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => toast.success('Status updated')}>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Update Status
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>

      {/* Admin tools & dialogs */ }
  <Card>
    <CardHeader>
      <CardTitle className="text-blue-800">Administrative Tools</CardTitle>
      <CardDescription>Platform management and system controls</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* User Management */}
        <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
          <DialogTrigger asChild>
            <Button className="h-24 bg-blue-500 hover:bg-blue-600 text-white flex-col">
              <UsersIcon className="h-6 w-6 mb-2" />
              <span>User Management</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white max-w-3xl w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-800">User Admin Panel</DialogTitle>
              <DialogDescription>Search, filter, and manage users</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 border rounded px-2 py-1">
                  <Search className="h-4 w-4 text-blue-500" />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full bg-transparent outline-none"
                  />
                </div>

                <select id="user-role-filter" className="border rounded px-2 py-1" value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)}>
                  <option value="">All Roles</option>
                  <option value="user">User</option>
                  <option value="team lead">Team Lead</option>
                  <option value="NGO">NGO</option>
                </select>

                <Button variant="outline" className="flex items-center gap-2" onClick={() => toast.success('Exported CSV!')}>
                  <FileDown className="h-4 w-4" /> Export CSV
                </Button>
              </div>

              <div className="overflow-x-auto max-h-72 mb-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Donations</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockUsers
                      .filter((u) =>
                        (!userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())) &&
                        (!userRoleFilter || u.role === userRoleFilter)
                      )
                      .map((user) => (
                        <tr key={user.id} className="border-b hover:bg-blue-50">
                          <td className="p-2 font-medium cursor-pointer text-blue-700 underline" onClick={() => setSelectedUser(user)}>{user.name}</td>
                          <td className="p-2">{user.email}</td>
                          <td className="p-2">{user.role}</td>
                          <td className="p-2">{user.status}</td>
                          <td className="p-2">{user.donations}</td>
                          <td className="p-2 flex gap-2 flex-wrap">
                            <Button size="sm" variant="outline" onClick={() => setSelectedUser(user)}><UsersIcon className="h-4 w-4" /> View</Button>
                            <Button size="sm" variant="outline" onClick={() => toast.success('Approved!')}><UserCheck className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" onClick={() => toast.error('Suspended!')}><UserX className="h-4 w-4" /></Button>
                            <Button size="sm" variant="outline" onClick={() => toast.success('Promoted!')}><UserPlus className="h-4 w-4" /></Button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {selectedUser && (
                <div className="bg-blue-50 rounded-lg p-4 mb-2">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                    <div>
                      <div className="font-bold text-blue-800 text-lg">{selectedUser.name}</div>
                      <div className="text-blue-600 text-sm">{selectedUser.email}</div>
                      <div className="text-blue-600 text-xs">Role: {selectedUser.role}</div>
                      <div className="text-blue-600 text-xs">Joined: {selectedUser.joined}</div>
                      <div className="text-blue-600 text-xs">Donations: {selectedUser.donations}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedUser(null)}>Close</Button>
                  </div>
                  <div className="text-xs text-blue-700">Recent Activities: ...</div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Reports */}
        <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
          <DialogTrigger asChild>
            <Button className="h-24 bg-green-500 hover:bg-green-600 text-white flex-col">
              <FileTextIcon className="h-6 w-6 mb-2" />
              <span>Generate Reports</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white max-w-lg w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl text-green-800">Generate Report</DialogTitle>
              <DialogDescription>Select report type and date range</DialogDescription>
            </DialogHeader>

            <form className="space-y-4">
              <div>
                <label htmlFor="report-type" className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
                <select id="report-type" className="border rounded px-2 py-1 w-full" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  {reportTypes.map((rt) => (
                    <option key={rt.value} value={rt.value}>{rt.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label htmlFor="date-from" className="block text-xs text-gray-600 mb-1">From</label>
                  <input id="date-from" type="date" className="border rounded px-2 py-1 w-full" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label htmlFor="date-to" className="block text-xs text-gray-600 mb-1">To</label>
                  <input id="date-to" type="date" className="border rounded px-2 py-1 w-full" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button type="button" variant="outline" className="flex-1 flex items-center gap-2" onClick={() => toast.success('Downloaded PDF')}>
                  <FileDown className="h-4 w-4" /> Download PDF
                </Button>
                <Button type="button" variant="outline" className="flex-1 flex items-center gap-2" onClick={() => toast.success('Downloaded Excel')}>
                  <FileDown className="h-4 w-4" /> Download Excel
                </Button>
              </div>

              <Button type="button" className="w-full flex items-center gap-2 mt-2" onClick={() => toast.success('Report emailed!')}>
                <Mail className="h-4 w-4" /> Email Report
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Settings (button + dialog) */}
        <div>
          <Button onClick={() => setShowSettingsModal(true)} className="h-24 bg-purple-500 hover:bg-purple-600 text-white flex-col w-full">
            <Settings className="h-6 w-6 mb-2" />
            <span>System Settings</span>
          </Button>

          <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
            <DialogContent className="bg-white max-w-lg w-full">
              <DialogHeader>
                <DialogTitle className="text-2xl text-purple-800">System Settings</DialogTitle>
                <DialogDescription>Customize platform features and experience</DialogDescription>
              </DialogHeader>

              <form className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-join-class-team" className="mb-0">Enable Join Class Team</label>
                  <Switch id="toggle-join-class-team" checked={settings.joinClassTeam} onCheckedChange={(v) => setSettings((s) => ({ ...s, joinClassTeam: v as boolean }))} />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-report-issues" className="mb-0">Enable Report Issues</label>
                  <Switch id="toggle-report-issues" checked={settings.reportIssues} onCheckedChange={(v) => setSettings((s) => ({ ...s, reportIssues: v as boolean }))} />
                </div>

                <div>
                  <label htmlFor="donation-threshold" className="block text-sm font-medium text-gray-700 mb-1">Donation Alert Threshold ($)</label>
                  <input id="donation-threshold" type="number" className="border rounded px-2 py-1 w-full" value={settings.donationThreshold} onChange={(e) => setSettings((s) => ({ ...s, donationThreshold: Number(e.target.value) }))} />
                </div>

                <div>
                  <label htmlFor="platform-banner" className="block text-sm font-medium text-gray-700 mb-1">Platform Banner Message</label>
                  <input id="platform-banner" type="text" className="border rounded px-2 py-1 w-full" value={settings.banner} onChange={(e) => setSettings((s) => ({ ...s, banner: e.target.value }))} />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-dark-mode" className="mb-0">Default Dark Mode</label>
                  <Switch id="toggle-dark-mode" checked={settings.darkMode} onCheckedChange={(v) => setSettings((s) => ({ ...s, darkMode: v as boolean }))} />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="toggle-audio-read" className="mb-0">Enable Audio Read</label>
                  <Switch id="toggle-audio-read" checked={settings.audioRead} onCheckedChange={(v) => setSettings((s) => ({ ...s, audioRead: v as boolean }))} />
                </div>

                <Button type="button" className="w-full mt-2" onClick={() => { setShowSettingsModal(false); toast.success('Settings saved (demo)!'); }}>Save Settings</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alerts */}
        <Dialog open={showAlertsModal} onOpenChange={setShowAlertsModal}>
          <DialogTrigger asChild>
            <Button className="h-24 bg-orange-500 hover:bg-orange-600 text-white flex-col">
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>System Alerts</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-white max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle className="text-2xl text-orange-800">System Alerts</DialogTitle>
              <DialogDescription>Real-time platform alerts and urgent events</DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-2 mb-4">
              <label htmlFor="alert-severity-filter" className="text-sm">Filter:</label>
              <select id="alert-severity-filter" className="border rounded px-2 py-1" value={alertSeverity} onChange={(e) => setAlertSeverity(e.target.value)}>
                <option value="All">All</option>
                <option value="Critical">Critical</option>
                <option value="Warning">Warning</option>
                <option value="Info">Info</option>
              </select>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto">
              {alerts.filter((a) => alertSeverity === 'All' || a.type === alertSeverity).map((alert) => (
                <Alert key={alert.id} variant={alert.type === 'Critical' ? 'destructive' : 'default'} className="relative">
                  <AlertTitle>{alert.title} <span className="ml-2 text-xs font-normal">[{alert.type}]</span></AlertTitle>
                  <AlertDescription>{alert.desc} <span className="block text-xs text-gray-500 mt-1">{alert.time}</span></AlertDescription>
                  <div className="absolute top-2 right-2 flex gap-1">
                    {!alert.resolved && <Button size="sm" variant="outline" onClick={() => setAlerts((prev) => prev.map((a) => a.id === alert.id ? { ...a, resolved: true } : a))}>Resolve</Button>}
                    <Button size="sm" variant="outline" onClick={() => toast.info('Marked as read (demo)')}>Mark Read</Button>
                    <Button size="sm" variant="outline" onClick={() => toast.info('Escalated (demo)')}>Escalate</Button>
                  </div>
                </Alert>
              ))}

              {alerts.filter((a) => alertSeverity === 'All' || a.type === alertSeverity).length === 0 && (
                <div className="text-center text-gray-500">No alerts of this type.</div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </CardContent>
  </Card>

  {/* Platform Performance */ }
  <Card>
    <CardHeader>
      <CardTitle className="text-blue-800">Platform Performance</CardTitle>
      <CardDescription>System-wide analytics and performance metrics</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
          <Eye className="h-8 w-8 text-blue-500" />
          <div>
            <p className="font-medium text-blue-800">Daily Active Users</p>
            <p className="text-2xl font-bold text-blue-600">3,241</p>
            <p className="text-sm text-green-600">+12% from yesterday</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
          <MapPin className="h-8 w-8 text-green-500" />
          <div>
            <p className="font-medium text-green-800">Projects Completed</p>
            <p className="text-2xl font-bold text-green-600">127</p>
            <p className="text-sm text-blue-600">This month</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
          <DollarSign className="h-8 w-8 text-purple-500" />
          <div>
            <p className="font-medium text-purple-800">Total Revenue</p>
            <p className="text-2xl font-bold text-purple-600">$284,500</p>
            <p className="text-sm text-green-600">+18% this quarter</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
    </div >
  );
};

export default AdminDashboard;