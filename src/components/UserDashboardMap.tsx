import React, { useState, useMemo } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Volume2 } from 'lucide-react';

// Mock data for villages
const VILLAGES = [
  {
    id: 'village-1',
    name: 'Sunshine Valley',
    country: 'Kenya',
    lat: -1.2921,
    lng: 36.8219,
    need: 'Clean Water',
    status: 'urgent',
    ongoing: 'Pipeline Project',
    donations: 12000,
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    description: 'Our children walk 5km for water. A new well would change our lives.'
  },
  {
    id: 'village-2',
    name: 'Hope Springs',
    country: 'India',
    lat: 20.5937,
    lng: 78.9629,
    need: 'Sanitation',
    status: 'planned',
    ongoing: 'Sanitation Drive',
    donations: 8000,
    audio: '',
    description: 'We dream of clean toilets and safe water for our school.'
  },
  {
    id: 'village-3',
    name: 'River Bend',
    country: 'Bangladesh',
    lat: 23.6850,
    lng: 90.3563,
    need: 'Pipeline',
    status: 'completed',
    ongoing: 'Pipeline Complete',
    donations: 15000,
    audio: '',
    description: 'Thanks to donors, our new pipeline brings water to every home!'
  },
  {
    id: 'village-4',
    name: 'Desert Oasis',
    country: 'Mali',
    lat: 17.5707,
    lng: -3.9962,
    need: 'Clean Water',
    status: 'urgent',
    ongoing: 'Well Drilling',
    donations: 5000,
    audio: '',
    description: 'We have only one well for 1,500 people. Help us dig another.'
  },
];

const STATUS_COLORS = {
  urgent: 'red',
  planned: 'orange',
  completed: 'green',
};

const MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
const DEFAULT_CENTER = { lat: 17.6868, lng: 83.2185 }; // Visakhapatnam
const DEFAULT_ZOOM = 11;

const UserDashboardMap: React.FC = () => {
  const [selectedVillage, setSelectedVillage] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterNeed, setFilterNeed] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  // Filtered villages
  const filteredVillages = useMemo(() => {
    return VILLAGES.filter(v =>
      (!search || v.name.toLowerCase().includes(search.toLowerCase()) || v.country.toLowerCase().includes(search.toLowerCase())) &&
      (!filterNeed || v.need === filterNeed) &&
      (!filterStatus || v.status === filterStatus)
    );
  }, [search, filterNeed, filterStatus]);

  React.useEffect(() => {
    if (!MAPS_API_KEY || MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY') {
      console.warn('Google Maps API key not configured. Please set VITE_GOOGLE_MAPS_API_KEY in your environment variables.');
      return;
    }
    
    const loader = new Loader({ apiKey: MAPS_API_KEY, version: 'weekly', libraries: ['marker'] });
    let mapInstance: google.maps.Map;
    loader.load().then(async () => {
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      mapInstance = new Map(document.getElementById('user-dashboard-map') as HTMLElement, {
        center: DEFAULT_CENTER,
        zoom: DEFAULT_ZOOM,
        mapId: 'HYDRO_AID_MAP', // Required for Advanced Markers
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      setMap(mapInstance);

      // Try to center on user's current location if permitted
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            mapInstance.setCenter(userPos);
            mapInstance.setZoom(12);
            try {
              const { AdvancedMarkerElement } = google.maps.marker;
              const dot = document.createElement('div');
              dot.style.width = '10px';
              dot.style.height = '10px';
              dot.style.borderRadius = '50%';
              dot.style.background = '#2563eb';
              dot.style.border = '2px solid white';
              new AdvancedMarkerElement({ position: userPos, map: mapInstance, content: dot });
            } catch {}
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000 }
        );
      }
    }).catch((error) => {
      console.error('Failed to load Google Maps:', error);
    });
    return () => {
      // Clean up markers
      markers.forEach(m => {
        m.map = null;
      });
    };
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    if (!map) return;
    
    // Clear existing markers from the map
    markers.forEach(marker => {
      marker.map = null;
    });
    
    const { AdvancedMarkerElement } = google.maps.marker;

    // Add new markers
    const newMarkers = filteredVillages.map(village => {
      const pinElement = document.createElement('div');
      pinElement.style.width = '24px';
      pinElement.style.height = '24px';
      pinElement.style.borderRadius = '50%';
      pinElement.style.backgroundColor = STATUS_COLORS[village.status as keyof typeof STATUS_COLORS];
      pinElement.style.border = '2px solid white';
      pinElement.style.cursor = 'pointer';
      pinElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

      const marker = new AdvancedMarkerElement({
        position: { lat: village.lat, lng: village.lng },
        map,
        title: village.name,
        content: pinElement,
      });

      marker.addListener('click', () => {
        map.panTo({ lat: village.lat, lng: village.lng });
        setSelectedVillage(village)
      });
      return marker;
    });

    setMarkers(newMarkers);

  }, [map, filteredVillages]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-6">
      {/* Sidebar for search and list */}
      <div className="w-full md:w-80 bg-white rounded-lg shadow p-4 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Browse Villages Worldwide</h2>
        <Input
          placeholder="Search by name or country..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-2"
        />
        <div className="flex gap-2 mb-2">
          <select 
            className="border rounded p-2 flex-1" 
            value={filterNeed} 
            onChange={e => setFilterNeed(e.target.value)}
            aria-label="Filter by need type"
          >
            <option value="">All Needs</option>
            <option value="Clean Water">Clean Water</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Pipeline">Pipeline</option>
          </select>
          <select 
            className="border rounded p-2 flex-1" 
            value={filterStatus} 
            onChange={e => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="urgent">Urgent</option>
            <option value="planned">Planned</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredVillages.map(v => (
            <div key={v.id} className="p-3 mb-2 rounded-lg border cursor-pointer hover:bg-blue-50" onClick={() => setSelectedVillage(v)}>
              <div className="flex items-center gap-2">
                <MapPin className={`h-5 w-5 ${v.status === 'urgent' ? 'text-red-600' : v.status === 'planned' ? 'text-orange-500' : 'text-green-600'}`} />
                <span className="font-semibold text-blue-800">{v.name}</span>
                <Badge className={`ml-auto ${v.status === 'urgent' ? 'bg-red-100 text-red-700' : v.status === 'planned' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>{v.status.charAt(0).toUpperCase() + v.status.slice(1)}</Badge>
              </div>
              <div className="text-xs text-blue-600">{v.country} • {v.need}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Map */}
      <div className="flex-1 min-h-[500px] rounded-lg overflow-hidden shadow border-2 border-blue-100">
        <div id="user-dashboard-map" style={{ width: '100%', height: '500px' }} />
      </div>
      {/* Village Modal */}
      <Dialog open={!!selectedVillage} onOpenChange={() => setSelectedVillage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {selectedVillage?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedVillage?.country}
            </DialogDescription>
          </DialogHeader>
          {selectedVillage && (
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Badge className={selectedVillage.status === 'urgent' ? 'bg-red-100 text-red-700' : selectedVillage.status === 'planned' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}>
                  {selectedVillage.status.charAt(0).toUpperCase() + selectedVillage.status.slice(1)}
                </Badge>
                <Badge className="bg-blue-100 text-blue-700">{selectedVillage.need}</Badge>
              </div>
              <div className="text-blue-800 font-semibold">Ongoing: {selectedVillage.ongoing}</div>
              <div className="text-blue-600">Donations: ${selectedVillage.donations.toLocaleString()}</div>
              <div className="text-blue-700">{selectedVillage.description}</div>
              {selectedVillage.audio && (
                <div className="flex items-center gap-2 mt-2">
                  <Volume2 className="h-5 w-5 text-green-700" />
                  <audio controls src={selectedVillage.audio} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboardMap; 