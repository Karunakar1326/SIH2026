import { create } from 'zustand';

interface AppState {
  sidebarCollapsed: boolean;
  selectedDistrict: string;
  selectedState: string;
  demoMode: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSelectedDistrict: (district: string) => void;
  setSelectedState: (state: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  selectedDistrict: 'All Districts',
  selectedState: 'Odisha',
  demoMode: true,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  setSelectedDistrict: (district) => set({ selectedDistrict: district }),
  setSelectedState: (state) => set({ selectedState: state }),
}));

interface MapLayer {
  id: string;
  label: string;
  active: boolean;
  color?: string;
}

interface MapState {
  layers: MapLayer[];
  basemap: 'streets' | 'satellite' | 'terrain';
  toggleLayer: (id: string) => void;
  setBasemap: (basemap: 'streets' | 'satellite' | 'terrain') => void;
}

export const useMapStore = create<MapState>((set) => ({
  layers: [
    { id: 'habitations', label: 'Habitations', active: true },
    { id: 'risk-zones', label: 'Risk Zones', active: true },
    { id: 'flood-risk', label: 'Flood Risk', active: false },
    { id: 'cyclone-risk', label: 'Cyclone Risk', active: false },
    { id: 'landslide-risk', label: 'Landslide Risk', active: false },
    { id: 'coastal-erosion', label: 'Coastal Erosion', active: false },
    { id: 'historical-events', label: 'Historical Events', active: false },
    { id: 'safe-sites', label: 'Safe Sites', active: false },
    { id: 'infrastructure', label: 'Infrastructure', active: false },
    { id: 'rivers', label: 'Rivers', active: true },
    { id: 'roads', label: 'Roads', active: true },
  ],
  basemap: 'streets',
  toggleLayer: (id) => set((s) => ({
    layers: s.layers.map((l) => l.id === id ? { ...l, active: !l.active } : l),
  })),
  setBasemap: (basemap) => set({ basemap }),
}));

interface SelectionState {
  selectedHabitationId: string | null;
  selectedEventId: string | null;
  selectedSiteId: string | null;
  setSelectedHabitation: (id: string | null) => void;
  setSelectedEvent: (id: string | null) => void;
  setSelectedSite: (id: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedHabitationId: null,
  selectedEventId: null,
  selectedSiteId: null,
  setSelectedHabitation: (id) => set({ selectedHabitationId: id }),
  setSelectedEvent: (id) => set({ selectedEventId: id }),
  setSelectedSite: (id) => set({ selectedSiteId: id }),
}));
