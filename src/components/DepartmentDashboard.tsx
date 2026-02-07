import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, MapPin, Wrench, CheckCircle, Clock, Users, Camera, FileText, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const DepartmentDashboard: React.FC = () => {
  const implementations = [
    { id: 1, village: 'Sunshine Valley', type: 'Water Pump', status: 'completed', date: '2024-01-10', cost: '$1,200' },
    { id: 2, village: 'Hope Springs', type: 'Filtration System', status: 'in-progress', date: '2024-01-12', cost: '$800' },
    { id: 3, village: 'Green Hills', type: 'Well Drilling', status: 'pending', date: '2024-01-15', cost: '$2,500' },
    { id: 4, village: 'River Bend', type: 'Storage Tank', status: 'completed', date: '2024-01-08', cost: '$950' },
  ];

  const problemAreas = [
    { id: 1, location: 'Desert Oaks', issue: 'Contaminated Water Source', severity: 'critical', reported: '2 days ago' },
    { id: 2, location: 'Mountain View', issue: 'Broken Hand Pump', severity: 'high', reported: '5 days ago' },
    { id: 3, location: 'Valley Stream', issue: 'Low Water Pressure', severity: 'medium', reported: '1 week ago' },
    { id: 4, location: 'Sunset Hills', issue: 'Pipe Leakage', severity: 'high', reported: '3 days ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleFixIssue = (problem: any) => {
    toast.success(`Dispatching repair team to ${problem.location} for ${problem.issue}`);
  };

  const handleSiteSurvey = () => {
    toast.info('Opening site survey form and field team assignment');
  };

  const handleMarkComplete = () => {
    toast.success('Project marked as complete. Updating village status...');
  };

  const handleReportIssue = () => {
    toast.info('Opening incident reporting form');
  };

  const handleScheduleVisit = (village: string) => {
    toast.info(`Scheduling field visit to ${village}`);
  };

  const handleUpdateProgress = (id: number) => {
    toast.success(`Updating progress for project #${id}`);
  };

  const [showSiteSurvey, setShowSiteSurvey] = React.useState(false);
  const [showMarkComplete, setShowMarkComplete] = React.useState(false);
  const [showReportIssue, setShowReportIssue] = React.useState(false);
  const [showPhotoDocs, setShowPhotoDocs] = React.useState(false);
  const [photoGallery, setPhotoGallery] = React.useState([]);
  const [timelineProject, setTimelineProject] = React.useState(null);
  const [mapProject, setMapProject] = React.useState(null);
  const [dispatchIssue, setDispatchIssue] = React.useState(null);
  const [callIssue, setCallIssue] = React.useState(null);
  const [dispatchedIds, setDispatchedIds] = React.useState([]);
  const fieldTeams = [
    { id: 'team1', name: 'Aqua Response Team' },
    { id: 'team2', name: 'Hydro Heroes' },
    { id: 'team3', name: 'Rapid Relief Unit' },
  ];
  const [showContactLeader, setShowContactLeader] = React.useState(false);
  const [showProgressReport, setShowProgressReport] = React.useState(false);
  const [showScheduleMeeting, setShowScheduleMeeting] = React.useState(false);
  const [activityFeed, setActivityFeed] = React.useState([]);
  const mockVillages = [
    { name: 'Sunshine Valley', leader: { name: 'Asha Patel', role: 'Water Committee Lead', phone: '+1 555-123-4567', email: 'asha@village.org' } },
    { name: 'Hope Springs', leader: { name: 'Raj Kumar', role: 'Health Head', phone: '+1 555-987-6543', email: 'raj@village.org' } },
    { name: 'Green Hills', leader: { name: 'Mary Smith', role: 'Community Chair', phone: '+1 555-222-3333', email: 'mary@village.org' } },
  ];
  const mockProjects = implementations.map(impl => impl.village);

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">NGO Operations Center</h1>
        <p className="text-blue-600">Field operations, implementations, and community support</p>
      </div>

      {/* Department Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Completed Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <div className="flex items-center mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">This month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center mt-1">
              <Clock className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">In implementation</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <div className="flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">Need immediate action</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Communities Served</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <div className="flex items-center mt-1">
              <Users className="h-4 w-4 mr-1" />
              <span className="text-sm opacity-90">Total villages</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Implementation Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Project Implementation Status</CardTitle>
            <CardDescription>Track all water infrastructure projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Village</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {implementations.map((impl) => (
                  <TableRow key={impl.id}>
                    <TableCell className="font-medium">{impl.village}</TableCell>
                    <TableCell className="text-sm">{impl.type}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(impl.status)}>
                        {impl.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setTimelineProject(impl)}
                          className="h-6 px-2"
                          aria-label="View Timeline"
                        >
                          <Clock className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setMapProject(impl)}
                          className="h-6 px-2"
                          aria-label="View Map"
                        >
                          <MapPin className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Problem Areas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-800">Critical Issues Dashboard</CardTitle>
            <CardDescription>Issues requiring immediate field response</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {problemAreas.map((problem) => (
                <div key={problem.id} className="flex items-start justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-red-500" />
                      <h4 className="font-medium text-red-800">{problem.location}</h4>
                      <Badge className={getSeverityColor(problem.severity)}>
                        {problem.severity}
                      </Badge>
                      {dispatchedIds.includes(problem.id) && (
                        <Badge className="bg-green-500 text-white ml-2">Dispatched &#10003;</Badge>
                      )}
                    </div>
                    <p className="text-sm text-red-600 mb-2">{problem.issue}</p>
                    <p className="text-xs text-gray-500">Reported {problem.reported}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button 
                      size="sm" 
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => setDispatchIssue(problem)}
                    >
                      <Wrench className="h-4 w-4 mr-1" />
                      Dispatch
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCallIssue(problem)}
                    >
                      <Phone className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Field Operations Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Field Operations Tools</CardTitle>
          <CardDescription>Quick access to field management functions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => setShowSiteSurvey(true)}
              className="h-20 bg-blue-500 hover:bg-blue-600 text-white flex-col"
            >
              <MapPin className="h-6 w-6 mb-2" />
              <span>Site Survey</span>
            </Button>
            <Dialog open={showSiteSurvey} onOpenChange={setShowSiteSurvey}>
              <DialogContent className="bg-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-blue-800">Site Survey Form</DialogTitle>
                  <DialogDescription>Record site conditions before project work begins</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="survey-location">Location Name</Label>
                    <Input id="survey-location" value="(Auto-filled)" disabled />
                  </div>
                  <div>
                    <Label htmlFor="survey-date">Date of Visit</Label>
                    <Input id="survey-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="survey-officer">Field Officer Name</Label>
                    <Input id="survey-officer" placeholder="Enter name" />
                  </div>
                  <div>
                    <Label htmlFor="survey-engagement">Community Engagement Level</Label>
                    <Select>
                      <SelectTrigger id="survey-engagement">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Existing Water Sources</Label>
                    <div className="flex gap-3">
                      <Checkbox id="well" /><Label htmlFor="well">Well</Label>
                      <Checkbox id="handpump" /><Label htmlFor="handpump">Handpump</Label>
                      <Checkbox id="none" /><Label htmlFor="none">None</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="survey-photos">Photo Uploads (Before Images)</Label>
                    <Input id="survey-photos" type="file" multiple />
                  </div>
                  <div>
                    <Label htmlFor="survey-access">Accessibility Notes</Label>
                    <Textarea id="survey-access" placeholder="Road conditions, terrain, etc." />
                  </div>
                  <div>
                    <Label htmlFor="survey-risk">Risk or Urgency Level</Label>
                    <Select>
                      <SelectTrigger id="survey-risk">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="button" className="w-full mt-2" onClick={() => { setShowSiteSurvey(false); toast.success('Survey submitted (demo)!'); }}>Submit</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => setShowMarkComplete(true)}
              className="h-20 bg-green-500 hover:bg-green-600 text-white flex-col"
            >
              <CheckCircle className="h-6 w-6 mb-2" />
              <span>Mark Complete</span>
            </Button>
            <Dialog open={showMarkComplete} onOpenChange={setShowMarkComplete}>
              <DialogContent className="bg-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-green-800">Mark Project Complete</DialogTitle>
                  <DialogDescription>Update project/village completion status</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="complete-project">Project/Village Name</Label>
                    <Select>
                      <SelectTrigger id="complete-project">
                        <SelectValue placeholder="Select project/village" />
                      </SelectTrigger>
                      <SelectContent>
                        {implementations.map(impl => (
                          <SelectItem key={impl.id} value={impl.village}>{impl.village}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="complete-date">Completion Date</Label>
                    <Input id="complete-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="complete-photo">Attach Photo Evidence</Label>
                    <Input id="complete-photo" type="file" multiple />
                  </div>
                  <div>
                    <Label htmlFor="complete-notes">Completion Notes</Label>
                    <Textarea id="complete-notes" placeholder="Notes about completion" />
                  </div>
                  <div>
                    <Label>Confirm Checklist</Label>
                    <div className="flex flex-col gap-2 ml-2">
                      <Checkbox id="community-informed" /><Label htmlFor="community-informed">Community informed</Label>
                      <Checkbox id="functionality-tested" /><Label htmlFor="functionality-tested">Functionality tested</Label>
                      <Checkbox id="maintenance-shared" /><Label htmlFor="maintenance-shared">Maintenance instructions shared</Label>
                    </div>
                  </div>
                  <Button type="button" className="w-full mt-2" onClick={() => { setShowMarkComplete(false); toast.success('Marked as complete (demo)!'); }}>Submit</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => setShowReportIssue(true)}
              className="h-20 bg-orange-500 hover:bg-orange-600 text-white flex-col"
            >
              <AlertTriangle className="h-6 w-6 mb-2" />
              <span>Report Issue</span>
            </Button>
            <Dialog open={showReportIssue} onOpenChange={setShowReportIssue}>
              <DialogContent className="bg-white max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-orange-800">Report Issue</DialogTitle>
                  <DialogDescription>Report problems during or after implementation</DialogDescription>
                </DialogHeader>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="issue-project">Project/Village</Label>
                    <Select>
                      <SelectTrigger id="issue-project">
                        <SelectValue placeholder="Select project/village" />
                      </SelectTrigger>
                      <SelectContent>
                        {implementations.map(impl => (
                          <SelectItem key={impl.id} value={impl.village}>{impl.village}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nature of Issue</Label>
                    <RadioGroup className="flex flex-col gap-2">
                      <RadioGroupItem value="equipment" id="equipment" /> <Label htmlFor="equipment">Equipment damaged</Label>
                      <RadioGroupItem value="leakage" id="leakage" /> <Label htmlFor="leakage">Pipeline leakage</Label>
                      <RadioGroupItem value="access" id="access" /> <Label htmlFor="access">Site access blocked</Label>
                      <RadioGroupItem value="community" id="community" /> <Label htmlFor="community">Community unavailable</Label>
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="issue-desc">Description</Label>
                    <Textarea id="issue-desc" placeholder="Describe the issue" />
                  </div>
                  <div>
                    <Label htmlFor="issue-urgency">Urgency Level</Label>
                    <Select>
                      <SelectTrigger id="issue-urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="issue-media">Upload Photos/Video</Label>
                    <Input id="issue-media" type="file" multiple />
                  </div>
                  <div className="text-xs text-gray-500">Timestamp: {new Date().toLocaleString()}</div>
                  <Button type="button" className="w-full mt-2" onClick={() => { setShowReportIssue(false); toast.success('Issue reported (demo)!'); }}>Submit</Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button 
              onClick={() => setShowPhotoDocs(true)}
              className="h-20 bg-purple-500 hover:bg-purple-600 text-white flex-col"
            >
              <Camera className="h-6 w-6 mb-2" />
              <span>Photo Docs</span>
            </Button>
            <Dialog open={showPhotoDocs} onOpenChange={setShowPhotoDocs}>
              <DialogContent className="bg-white max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl text-purple-800">Photo Documentation</DialogTitle>
                  <DialogDescription>Upload or view field visit/completion photos</DialogDescription>
                </DialogHeader>
                <form className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="photo-project">Project/Village</Label>
                    <Select>
                      <SelectTrigger id="photo-project">
                        <SelectValue placeholder="Select project/village" />
                      </SelectTrigger>
                      <SelectContent>
                        {implementations.map(impl => (
                          <SelectItem key={impl.id} value={impl.village}>{impl.village}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="photo-tag">Tag</Label>
                    <Select>
                      <SelectTrigger id="photo-tag">
                        <SelectValue placeholder="Select tag" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="before">Before</SelectItem>
                        <SelectItem value="during">During</SelectItem>
                        <SelectItem value="after">After</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="photo-date">Date</Label>
                    <Input id="photo-date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="photo-caption">Caption</Label>
                    <Input id="photo-caption" placeholder="Enter caption" />
                  </div>
                  <div>
                    <Label htmlFor="photo-upload">Upload Photo(s)</Label>
                    <Input id="photo-upload" type="file" multiple />
                  </div>
                  <Button type="button" className="w-full mt-2" onClick={() => toast.success('Photo(s) uploaded (demo)!')}>Upload</Button>
                </form>
                <div className="border-t pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="gallery-filter-project">Filter by Project</Label>
                    <Select>
                      <SelectTrigger id="gallery-filter-project">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        {implementations.map(impl => (
                          <SelectItem key={impl.id} value={impl.village}>{impl.village}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Label htmlFor="gallery-filter-tag">Type</Label>
                    <Select>
                      <SelectTrigger id="gallery-filter-tag">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="before">Before</SelectItem>
                        <SelectItem value="during">During</SelectItem>
                        <SelectItem value="after">After</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {/* Mock gallery thumbnails */}
                    {[1,2,3,4].map(i => (
                      <div key={i} className="bg-gray-100 rounded p-2 flex flex-col items-center">
                        <div className="w-24 h-24 bg-gray-300 rounded mb-2 flex items-center justify-center text-gray-400">Img</div>
                        <div className="text-xs text-gray-700">Project {i}</div>
                        <div className="text-xs text-gray-500">After</div>
                        <Button size="sm" variant="outline" className="mt-1">Download</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Community Engagement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-800">Community Engagement</CardTitle>
          <CardDescription>Local community feedback and communication</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">Recent Community Feedback</h4>
              <div className="space-y-2">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-medium">Sunshine Valley</p>
                  <p className="text-sm text-green-600">"Water pump working great! Thank you!"</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 font-medium">Hope Springs</p>
                  <p className="text-sm text-blue-600">"Installation progressing well"</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-blue-800">Quick Actions</h4>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowContactLeader(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Community Leaders
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowProgressReport(true)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Progress Report
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowScheduleMeeting(true)}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Community Meeting
                </Button>
              </div>
            </div>
          </div>
          <Dialog open={showContactLeader} onOpenChange={setShowContactLeader}>
            <DialogContent className="bg-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl text-blue-800">Contact Community Leader</DialogTitle>
                <DialogDescription>Directly reach out to local leadership</DialogDescription>
              </DialogHeader>
              <div className="mb-2">
                <Label htmlFor="leader-village">Select Village</Label>
                <select id="leader-village" className="border rounded px-2 py-1 w-full" title="Select Village">
                  {mockVillages.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                </select>
              </div>
              <div className="mb-2 text-sm"><b>Leader:</b> Asha Patel</div>
              <div className="mb-2 text-sm"><b>Role:</b> Water Committee Lead</div>
              <div className="mb-2 text-sm"><b>Phone:</b> <a href="tel:+15551234567" className="text-blue-600 underline">+1 555-123-4567</a></div>
              <div className="mb-2 text-sm"><b>Email:</b> <a href="mailto:asha@village.org" className="text-blue-600 underline">asha@village.org</a></div>
              <div className="flex gap-2 mb-2">
                <Button size="sm" variant="outline">Call</Button>
                <Button size="sm" variant="outline">Email</Button>
              </div>
              <Button type="button" className="w-full mt-2" onClick={() => { setShowContactLeader(false); setActivityFeed(f => [{ action: 'Contacted Leader', who: 'You', when: new Date().toLocaleString() }, ...f]); toast.success('Marked as contacted!'); }}>Mark as Contacted</Button>
              <div className="text-xs text-gray-500 mt-2">Contacted at: {new Date().toLocaleString()}</div>
            </DialogContent>
          </Dialog>
          <Dialog open={showProgressReport} onOpenChange={setShowProgressReport}>
            <DialogContent className="bg-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl text-green-800">Generate Progress Report</DialogTitle>
                <DialogDescription>Compile and share project updates</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="report-project">Select Project(s)/Village(s)</Label>
                  <select id="report-project" className="border rounded px-2 py-1 w-full" multiple title="Select Project(s)/Village(s)">
                    {mockProjects.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="report-range">Report Range</Label>
                  <select id="report-range" className="border rounded px-2 py-1 w-full" title="Report Range">
                    <option value="7days">Last 7 days</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="report-type">Report Type</Label>
                  <select id="report-type" className="border rounded px-2 py-1 w-full" title="Report Type">
                    <option value="summary">Status Summary</option>
                    <option value="funding">Funding vs. Progress</option>
                    <option value="logs">Field Activity Logs</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="report-format">Format</Label>
                  <select id="report-format" className="border rounded px-2 py-1 w-full" title="Format">
                    <option value="pdf">PDF</option>
                    <option value="excel">Excel</option>
                    <option value="browser">View in-browser</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <Button type="button" variant="outline" onClick={() => toast.success('Report downloaded (demo)!')}>Download</Button>
                  <Button type="button" variant="outline" onClick={() => toast.success('Report emailed (demo)!')}>Email</Button>
                </div>
                <Button type="button" className="w-full mt-2" onClick={() => { setShowProgressReport(false); setActivityFeed(f => [{ action: 'Generated Report', who: 'You', when: new Date().toLocaleString() }, ...f]); toast.success('Report generated!'); }}>Done</Button>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={showScheduleMeeting} onOpenChange={setShowScheduleMeeting}>
            <DialogContent className="bg-white max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-2xl text-purple-800">Schedule Community Meeting</DialogTitle>
                <DialogDescription>Set up a meeting with village leaders</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="meeting-village">Select Village</Label>
                  <select id="meeting-village" className="border rounded px-2 py-1 w-full" title="Select Village">
                    {mockVillages.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div>
                  <Label htmlFor="meeting-date">Date & Time</Label>
                  <Input id="meeting-date" type="datetime-local" />
                </div>
                <div>
                  <Label htmlFor="meeting-mode">Mode</Label>
                  <select id="meeting-mode" className="border rounded px-2 py-1 w-full" title="Meeting Mode">
                    <option value="inperson">In-person</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="meeting-link">Meeting Link (if online)</Label>
                  <Input id="meeting-link" placeholder="Google Meet/Zoom link" />
                </div>
                <div>
                  <Label htmlFor="meeting-agenda">Agenda</Label>
                  <Textarea id="meeting-agenda" placeholder="Meeting agenda" />
                </div>
                <div>
                  <Label htmlFor="meeting-contacts">Community Leader Contacts</Label>
                  <Input id="meeting-contacts" value="Asha Patel, Raj Kumar" disabled />
                </div>
                <div>
                  <Label htmlFor="meeting-attachments">Attachments/Survey Links</Label>
                  <Input id="meeting-attachments" type="file" multiple />
                </div>
                <Button type="button" className="w-full mt-2" onClick={() => { setShowScheduleMeeting(false); setActivityFeed(f => [{ action: 'Scheduled Meeting', who: 'You', when: new Date().toLocaleString() }, ...f]); toast.success('Meeting scheduled & notification sent!'); }}>Schedule Meeting</Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="mt-6">
            <h4 className="font-medium text-blue-800 mb-2">Recent Quick Actions</h4>
            <ul className="space-y-1 text-sm">
              {activityFeed.slice(0, 5).map((item, idx) => (
                <li key={idx} className="text-gray-700">{item.action} by {item.who} at {item.when}</li>
              ))}
              {activityFeed.length === 0 && <li className="text-gray-400">No recent actions.</li>}
            </ul>
          </div>
        </CardContent>
      </Card>

      {timelineProject && (
        <Dialog open={!!timelineProject} onOpenChange={v => !v && setTimelineProject(null)}>
          <DialogContent className="bg-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-800">Project Timeline</DialogTitle>
              <DialogDescription>Key milestones for {timelineProject.village} ({timelineProject.type})</DialogDescription>
            </DialogHeader>
            <div className="mb-2 text-sm text-gray-700">Start Date: <b>2024-01-01</b></div>
            <div className="mb-2 text-sm text-gray-700">Expected End Date: <b>2024-02-15</b></div>
            <ul className="border-l-2 border-blue-400 pl-4 space-y-2 mt-4">
              <li><span className="font-semibold">2024-01-01:</span> Site Survey Completed</li>
              <li><span className="font-semibold">2024-01-10:</span> Materials Delivered</li>
              <li><span className="font-semibold">2024-01-15:</span> Construction Started</li>
              <li><span className="font-semibold">2024-01-25:</span> Mid-Project Inspection</li>
              <li><span className="font-semibold">2024-02-10:</span> Final Testing</li>
              <li><span className="font-semibold">2024-02-15:</span> Project Completion (expected)</li>
            </ul>
          </DialogContent>
        </Dialog>
      )}
      {mapProject && (
        <Dialog open={!!mapProject} onOpenChange={v => !v && setMapProject(null)}>
          <DialogContent className="bg-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-800">Project Location Map</DialogTitle>
              <DialogDescription>Village: {mapProject.village} ({mapProject.type})</DialogDescription>
            </DialogHeader>
            <div className="mb-2 text-sm text-gray-700">Status: <span className={`font-semibold ${getStatusColor(mapProject.status)}`}>{mapProject.status}</span></div>
            <div className="mb-4">
              {/* Embedded OpenStreetMap centered on mock coordinates */}
              <iframe
                title="Village Map"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '8px' }}
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=77.5946,12.9716,77.6046,12.9816&layer=mapnik&marker=12.9766,77.5996`}
              ></iframe>
              <div className="text-xs text-gray-500 mt-1">Map data © <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors</div>
            </div>
            <div className="mb-2">
              <Button size="sm" variant="outline" className="mr-2" onClick={() => setShowPhotoDocs(true)}>View Site Photos</Button>
              <Button size="sm" variant="outline" onClick={() => setShowReportIssue(true)}>Report Issue</Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline">Satellite View</Button>
              <Button size="sm" variant="outline">Get Directions</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      {dispatchIssue && (
        <Dialog open={!!dispatchIssue} onOpenChange={v => !v && setDispatchIssue(null)}>
          <DialogContent className="bg-white max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl text-red-700">Dispatch Field Team</DialogTitle>
              <DialogDescription>Assign a team to respond to this issue</DialogDescription>
            </DialogHeader>
            <div className="mb-2 text-sm"><b>Village:</b> {dispatchIssue.location}</div>
            <div className="mb-2 text-sm"><b>Severity:</b> <span className={getSeverityColor(dispatchIssue.severity)}>{dispatchIssue.severity}</span></div>
            <div className="mb-2 text-sm"><b>Problem:</b> {dispatchIssue.issue}</div>
            <div className="mb-2 text-sm"><b>Reported:</b> {dispatchIssue.reported}</div>
            <div className="mb-2">
              <Label htmlFor="team-select">Assign Field Team</Label>
              <select id="team-select" className="border rounded px-2 py-1 w-full" title="Assign Field Team">
                {fieldTeams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
              </select>
            </div>
            <div className="mb-2">
              <Label htmlFor="eta-select">ETA</Label>
              <select id="eta-select" className="border rounded px-2 py-1 w-full" title="Select ETA">
                <option value="1hr">1 hr</option>
                <option value="6hr">6 hrs</option>
                <option value="24hr">24 hrs</option>
              </select>
            </div>
            <div className="mb-2">
              <Label htmlFor="priority-override">Priority Override</Label>
              <select id="priority-override" className="border rounded px-2 py-1 w-full" title="Priority Override">
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <Button type="button" className="w-full mt-2" onClick={() => { setDispatchedIds(ids => [...ids, dispatchIssue.id]); setDispatchIssue(null); toast.success('Field team dispatched!'); }}>Confirm Dispatch</Button>
          </DialogContent>
        </Dialog>
      )}
      {callIssue && (
        <Dialog open={!!callIssue} onOpenChange={v => !v && setCallIssue(null)}>
          <DialogContent className="bg-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl text-blue-800">Contact Information</DialogTitle>
              <DialogDescription>Reach out to the reporting party or coordinator</DialogDescription>
            </DialogHeader>
            <div className="mb-2 text-sm"><b>Reporter Name:</b> John Doe</div>
            <div className="mb-2 text-sm"><b>Phone:</b> <a href="tel:+1234567890" className="text-blue-600 underline">+1 234-567-890</a></div>
            <div className="mb-2 text-sm"><b>Village Coordinator:</b> Jane Smith</div>
            <div className="mb-2 text-sm"><b>Alternate Contacts:</b> +1 987-654-3210</div>
            <Button type="button" className="w-full mt-2" onClick={() => { toast.success('Marked as contacted!'); setCallIssue(null); }}>Mark Contacted</Button>
            <div className="text-xs text-gray-500 mt-2">Contacted at: {new Date().toLocaleString()}</div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DepartmentDashboard;
