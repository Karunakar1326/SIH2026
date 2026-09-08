import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LiveTimeSeriesGraph, type DataPoint } from '@/components/monitoring/LiveTimeSeriesGraph';
import { RiskMap } from '@/components/map/RiskMap';
import {
  ArrowRight, RefreshCw, ChevronDown, Activity, Clock, MapPin
} from 'lucide-react';

// Districts option list
const districtsList = [
  'All Districts', 'Ganjam', 'Kendrapara', 'Jagatsinghpur',
  'Puri', 'Koraput', 'Balasore', 'Cuttack'
];

// Hazard Monitor selector options
type HazardMonitorOption = 'overall' | 'cyclone' | 'flood' | 'landslide' | 'earthquake';

const hazardMonitorOptions: { value: HazardMonitorOption; label: string; icon: string }[] = [
  { value: 'overall', label: 'Overall Conditions', icon: '📡' },
  { value: 'cyclone', label: 'Cyclone', icon: '🌀' },
  { value: 'flood', label: 'Flood', icon: '🌊' },
  { value: 'landslide', label: 'Landslide', icon: '⛰️' },
  { value: 'earthquake', label: 'Earthquake', icon: '⚡' },
];

// Simulated initial time series helper
function generateTimeSeries(baseVal: number, variance: number, points = 20): DataPoint[] {
  const result: DataPoint[] = [];
  const now = new Date();
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 3 * 60 * 1000);
    const timeStr = time.toTimeString().substring(0, 5);
    const randomDelta = (Math.random() - 0.48) * variance;
    const value = Math.round((baseVal + randomDelta) * 10) / 10;
    result.push({ timestamp: timeStr, value });
  }
  return result;
}

// Earthquake Event Type
interface SeismicEvent {
  id: string;
  time: string;
  magnitude: number;
  depthKm: number;
  location: string;
  distanceKm: number;
  status: 'reviewed' | 'automatic';
}

const mockSeismicEvents: SeismicEvent[] = [
  { id: 'eq-001', time: '11:14 AM', magnitude: 4.8, depthKm: 12, location: 'Ganjam Rift Zone', distanceKm: 42, status: 'reviewed' },
  { id: 'eq-002', time: '08:45 AM', magnitude: 3.5, depthKm: 18, location: 'Eastern Ghats Lineament', distanceKm: 85, status: 'reviewed' },
  { id: 'eq-003', time: '04:20 AM', magnitude: 2.9, depthKm: 8, location: 'Kendrapara Offshore', distanceKm: 110, status: 'automatic' },
];

export function HazardMonitoring() {
  const navigate = useNavigate();

  // Control States
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedHazard, setSelectedHazard] = useState<HazardMonitorOption>('overall');
  const [timeWindow, setTimeWindow] = useState<'1h' | '6h' | '24h'>('6h');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastUpdatedSec, setLastUpdatedSec] = useState<number>(3);

  // Live Telemetry Datasets State
  const [windData, setWindData] = useState<DataPoint[]>(() => generateTimeSeries(118, 12));
  const [pressureData, setPressureData] = useState<DataPoint[]>(() => generateTimeSeries(982, 4));
  const [tempData, setTempData] = useState<DataPoint[]>(() => generateTimeSeries(29.4, 1.5));
  const [rainfallData, setRainfallData] = useState<DataPoint[]>(() => generateTimeSeries(86, 18));
  const [seaWaveData, setSeaWaveData] = useState<DataPoint[]>(() => generateTimeSeries(4.2, 0.8));
  const [riverLevelData, setRiverLevelData] = useState<DataPoint[]>(() => generateTimeSeries(25.95, 0.4));
  const [dischargeData, setDischargeData] = useState<DataPoint[]>(() => generateTimeSeries(8450, 400));
  const [reservoirData, setReservoirData] = useState<DataPoint[]>(() => generateTimeSeries(84.2, 1.2));
  const [soilMoistureData, setSoilMoistureData] = useState<DataPoint[]>(() => generateTimeSeries(91.4, 2.5));
  const [slopeDispData, setSlopeDispData] = useState<DataPoint[]>(() => generateTimeSeries(3.2, 0.6));

  // Live tick effect to simulate continuous left-scrolling updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdatedSec((prev) => {
        if (prev >= 10) {
          // Push new live telemetry point every 10 seconds
          const nowStr = new Date().toTimeString().substring(0, 8);

          const pushPoint = (setter: React.Dispatch<React.SetStateAction<DataPoint[]>>, deltaVal: number) => {
            setter((prevData) => {
              const lastVal = prevData[prevData.length - 1].value;
              const newVal = Math.round((lastVal + (Math.random() - 0.48) * deltaVal) * 10) / 10;
              const next = [...prevData.slice(1), { timestamp: nowStr, value: Math.max(0, newVal) }];
              return next;
            });
          };

          pushPoint(setWindData, 4);
          pushPoint(setPressureData, 1.5);
          pushPoint(setTempData, 0.3);
          pushPoint(setRainfallData, 5);
          pushPoint(setSeaWaveData, 0.2);
          pushPoint(setRiverLevelData, 0.1);
          pushPoint(setDischargeData, 150);
          pushPoint(setReservoirData, 0.3);
          pushPoint(setSoilMoistureData, 0.8);
          pushPoint(setSlopeDispData, 0.2);

          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Helper to calculate 30-minute explicit trend logic
  const compute30mTrend = (dataPoints: DataPoint[], threshold: number) => {
    if (dataPoints.length === 0) return { trend: 'stable' as const, detail: 'Baseline' };
    const current = dataPoints[dataPoints.length - 1].value;
    const history30m = dataPoints.slice(-10).map((d) => d.value);
    const avg = history30m.reduce((a, b) => a + b, 0) / history30m.length;
    const diff = current - avg;

    if (diff > threshold) {
      return { trend: 'increasing' as const, detail: `+${diff.toFixed(1)} vs 30m avg` };
    }
    if (diff < -threshold) {
      return { trend: 'decreasing' as const, detail: `${diff.toFixed(1)} vs 30m avg` };
    }
    return { trend: 'stable' as const, detail: `±${Math.abs(diff).toFixed(1)} vs 30m avg` };
  };

  const currWind = windData[windData.length - 1].value;
  const currPressure = pressureData[pressureData.length - 1].value;
  const currTemp = tempData[tempData.length - 1].value;
  const currRainfall = rainfallData[rainfallData.length - 1].value;
  const currSeaWave = seaWaveData[seaWaveData.length - 1].value;
  const currRiverLevel = riverLevelData[riverLevelData.length - 1].value;
  const currDischarge = dischargeData[dischargeData.length - 1].value;
  const currReservoir = reservoirData[reservoirData.length - 1].value;
  const currSoilMoisture = soilMoistureData[soilMoistureData.length - 1].value;
  const currSlopeDisp = slopeDispData[slopeDispData.length - 1].value;

  return (
    <div className="flex flex-col h-full bg-[#141414] text-[#F5F5F5] overflow-y-auto p-4 md:p-6 space-y-6">

      {/* ------------------------------------------------------------------- */}
      {/* 1. LIVE DATA HEADER */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#1C1C1C] rounded-2xl border border-white/10 p-5 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase">
              LIVE CONDITIONS
            </h1>
            <div className="flex items-center gap-1.5 bg-[#2ECC71]/15 text-[#2ECC71] border border-[#2ECC71]/30 px-3 py-1 rounded-full text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2ECC71] animate-pulse" />
              <span>LIVE</span>
            </div>
          </div>
          <p className="text-xs text-[#9A9A9A] mt-1 font-sans">
            Real-time environmental sensor observation telemetry and trend monitoring
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-[#9A9A9A]">
          <div className="bg-[#232323] border border-white/8 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Clock size={13} className="text-[#2ECC71]" />
            <span>Last updated: <strong className="text-white">{lastUpdatedSec} sec ago</strong></span>
          </div>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3.5 py-2 rounded-xl font-bold border transition-all flex items-center gap-2 cursor-pointer ${
              autoRefresh
                ? 'bg-[#2ECC71]/15 text-[#2ECC71] border-[#2ECC71]/40'
                : 'bg-[#232323] text-[#9A9A9A] border-white/10 hover:text-white'
            }`}
          >
            <RefreshCw size={12} className={autoRefresh ? 'animate-spin' : ''} />
            <span>Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. HAZARD / LOCATION SELECTOR & TIME WINDOW BAR */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#1C1C1C] rounded-2xl border border-white/10 p-4 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* District Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9A9A9A] font-mono font-medium">District:</span>
            <div className="relative">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="appearance-none bg-[#232323] text-white text-xs font-bold border border-white/15 rounded-xl px-3 py-2 pr-8 focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
              >
                {districtsList.map((d) => (
                  <option key={d} value={d} className="bg-[#1C1C1C] text-white">
                    {d}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] pointer-events-none" />
            </div>
          </div>

          {/* Hazard Monitor Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#9A9A9A] font-mono font-medium">Monitor:</span>
            <div className="relative">
              <select
                value={selectedHazard}
                onChange={(e) => setSelectedHazard(e.target.value as HazardMonitorOption)}
                className="appearance-none bg-[#232323] text-white text-xs font-bold border border-white/15 rounded-xl px-3.5 py-2 pr-8 focus:outline-none focus:border-[#FF5A1F] cursor-pointer"
              >
                {hazardMonitorOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#1C1C1C] text-white">
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9A9A] pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Rolling Time Window Switcher */}
        <div className="flex items-center gap-1.5 bg-[#232323] border border-white/10 rounded-xl p-1 text-xs font-mono">
          <span className="text-[10px] text-[#9A9A9A] px-2 uppercase">Window:</span>
          <button
            onClick={() => setTimeWindow('1h')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeWindow === '1h'
                ? 'bg-[#FF5A1F] text-white shadow-md'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            Last 1 hour
          </button>
          <button
            onClick={() => setTimeWindow('6h')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeWindow === '6h'
                ? 'bg-[#FF5A1F] text-white shadow-md'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            Last 6 hours
          </button>
          <button
            onClick={() => setTimeWindow('24h')}
            className={`px-3 py-1 rounded-lg font-bold transition-all ${
              timeWindow === '24h'
                ? 'bg-[#FF5A1F] text-white shadow-md'
                : 'text-[#9A9A9A] hover:text-white'
            }`}
          >
            Last 24 hours
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3 & 4. REAL-TIME GRAPH GRID / HAZARD-SPECIFIC GRAPHS */}
      {/* ------------------------------------------------------------------- */}
      {selectedHazard !== 'earthquake' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          
          {/* DEFAULT — OVERALL CONDITIONS */}
          {selectedHazard === 'overall' && (
            <>
              <LiveTimeSeriesGraph
                title="WIND SPEED"
                currentValue={currWind}
                unit="km/h"
                {...compute30mTrend(windData, 2)}
                source="IMD AWS Network"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FF5A1F"
                data={windData}
              />
              <LiveTimeSeriesGraph
                title="ATMOSPHERIC PRESSURE"
                currentValue={currPressure}
                unit="hPa"
                {...compute30mTrend(pressureData, 1)}
                source="IMD Barometric Network"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#00E5FF"
                data={pressureData}
              />
              <LiveTimeSeriesGraph
                title="TEMPERATURE"
                currentValue={currTemp}
                unit="°C"
                {...compute30mTrend(tempData, 0.3)}
                source="IMD AWS Network"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FFB020"
                data={tempData}
              />
              <LiveTimeSeriesGraph
                title="RAINFALL"
                currentValue={currRainfall}
                unit="mm"
                {...compute30mTrend(rainfallData, 3)}
                source="IMD Doppler Radar"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#34D399"
                data={rainfallData}
              />
            </>
          )}

          {/* CYCLONE SPECIFIC GRAPHS */}
          {selectedHazard === 'cyclone' && (
            <>
              <LiveTimeSeriesGraph
                title="WIND SPEED"
                currentValue={currWind}
                unit="km/h"
                {...compute30mTrend(windData, 2)}
                source="IMD • AWS Station"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FF5A1F"
                data={windData}
                prioritized={true}
              />
              <LiveTimeSeriesGraph
                title="ATMOSPHERIC PRESSURE"
                currentValue={currPressure}
                unit="hPa"
                {...compute30mTrend(pressureData, 1)}
                source="IMD • Barometer"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#00E5FF"
                data={pressureData}
                prioritized={true}
              />
              <LiveTimeSeriesGraph
                title="RAINFALL RATE"
                currentValue={currRainfall}
                unit="mm/h"
                {...compute30mTrend(rainfallData, 3)}
                source="IMD • Doppler Radar"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#34D399"
                data={rainfallData}
              />
              <LiveTimeSeriesGraph
                title="TEMPERATURE & HUMIDITY"
                currentValue={`${currTemp} / 88%`}
                unit="°C / %"
                {...compute30mTrend(tempData, 0.3)}
                source="IMD • AWS Sensor"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FFB020"
                data={tempData}
              />
              <LiveTimeSeriesGraph
                title="SEA WAVE HEIGHT"
                currentValue={currSeaWave}
                unit="m"
                {...compute30mTrend(seaWaveData, 0.1)}
                source="INCOIS • Wave Buoy"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#A78BFA"
                data={seaWaveData}
              />
            </>
          )}

          {/* FLOOD SPECIFIC GRAPHS */}
          {selectedHazard === 'flood' && (
            <>
              <LiveTimeSeriesGraph
                title="RIVER WATER LEVEL (NARAJ GAUGE)"
                currentValue={currRiverLevel}
                unit="m MSL"
                {...compute30mTrend(riverLevelData, 0.05)}
                source="CWC Telemetry"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#00E5FF"
                data={riverLevelData}
                prioritized={true}
              />
              <LiveTimeSeriesGraph
                title="ACCUMULATED RAINFALL"
                currentValue={currRainfall}
                unit="mm"
                {...compute30mTrend(rainfallData, 3)}
                source="IMD AWS Network"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#34D399"
                data={rainfallData}
                prioritized={true}
              />
              <LiveTimeSeriesGraph
                title="RIVER DISCHARGE RATE"
                currentValue={currDischarge.toLocaleString()}
                unit="m³/s"
                {...compute30mTrend(dischargeData, 50)}
                source="CWC Naraj Station"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FFB020"
                data={dischargeData}
              />
              <LiveTimeSeriesGraph
                title="RESERVOIR STORAGE CAPACITY"
                currentValue={currReservoir}
                unit="%"
                {...compute30mTrend(reservoirData, 0.2)}
                source="Hirakud Dam Operations"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#A78BFA"
                data={reservoirData}
              />
            </>
          )}

          {/* LANDSLIDE SPECIFIC GRAPHS */}
          {selectedHazard === 'landslide' && (
            <>
              <LiveTimeSeriesGraph
                title="SOIL MOISTURE SATURATION"
                currentValue={currSoilMoisture}
                unit="%"
                {...compute30mTrend(soilMoistureData, 0.5)}
                source="GSI Sensor Node"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FF5A1F"
                data={soilMoistureData}
                prioritized={true}
              />
              <LiveTimeSeriesGraph
                title="CUMULATIVE 24HR RAINFALL"
                currentValue={currRainfall}
                unit="mm"
                {...compute30mTrend(rainfallData, 3)}
                source="IMD AWS Network"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#34D399"
                data={rainfallData}
                prioritized={true}
              />
              <LiveTimeSeriesGraph
                title="SLOPE DISPLACEMENT RATE"
                currentValue={currSlopeDisp}
                unit="mm/h"
                {...compute30mTrend(slopeDispData, 0.1)}
                source="ISRO Inclinometer"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#FFB020"
                data={slopeDispData}
              />
              <LiveTimeSeriesGraph
                title="RAINFALL INTENSITY RATE"
                currentValue={currRainfall}
                unit="mm/h"
                {...compute30mTrend(rainfallData, 2)}
                source="IMD Doppler Radar"
                lastUpdatedSec={lastUpdatedSec}
                timeWindow={timeWindow}
                color="#00E5FF"
                data={rainfallData}
              />
            </>
          )}

        </div>
      ) : (
        /* ------------------------------------------------------------------- */
        /* EARTHQUAKE SPECIAL EVENT-BASED DISPLAY */
        /* ------------------------------------------------------------------- */
        <div className="space-y-6">
          
          {/* Latest Event Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#1C1C1C] border border-[#FF5A1F]/40 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-wider">
                LATEST EVENT MAGNITUDE
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-[#FF5A1F]">M 4.8</span>
                <span className="text-xs text-[#9A9A9A]">Richter Scale</span>
              </div>
              <span className="text-[10px] text-[#6B6B6B] font-mono mt-3">NCSM • Reviewed Event</span>
            </div>

            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-wider">
                FOCAL DEPTH
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-4xl font-black text-white">12</span>
                <span className="text-xs text-[#9A9A9A]">km depth</span>
              </div>
              <span className="text-[10px] text-[#6B6B6B] font-mono mt-3">Shallow Crustal Event</span>
            </div>

            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
              <span className="text-[10px] font-mono text-[#9A9A9A] uppercase tracking-wider">
                EPICENTER LOCATION
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white">Ganjam Rift Zone</span>
              </div>
              <span className="text-[10px] text-[#6B6B6B] font-mono mt-3">42 km SW of Berhampur</span>
            </div>
          </div>

          {/* Recent Seismic Activity Timeline */}
          <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/8 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[#FF5A1F]" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  RECENT SEISMIC EVENTS TIMELINE
                </h3>
              </div>
              <span className="text-[10px] text-[#9A9A9A] font-mono">
                Source: NCSM Telemetry Network
              </span>
            </div>

            {mockSeismicEvents.length > 0 ? (
              <div className="divide-y divide-white/5">
                {mockSeismicEvents.map((evt) => (
                  <div key={evt.id} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-[#232323] px-3 rounded-xl transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF5A1F]/15 border border-[#FF5A1F]/30 flex items-center justify-center font-black text-[#FF5A1F] text-sm shrink-0">
                        M{evt.magnitude}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{evt.location}</div>
                        <div className="text-[10px] text-[#9A9A9A] font-mono">
                          Depth: {evt.depthKm} km · Distance: {evt.distanceKm} km from monitor center
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-[#9A9A9A]">
                      <span>{evt.time}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#232323] border border-white/10 text-white uppercase">
                        {evt.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#232323] rounded-xl p-6 text-center text-xs text-[#9A9A9A]">
                No recent seismic activity reported in the current observation window.
              </div>
            )}
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 8. LIVE OBSERVATION MAP */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#1C1C1C] rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col min-h-[380px]">
        <div className="px-5 py-3 bg-[#232323] text-white text-xs font-bold flex items-center justify-between border-b border-white/8 z-10">
          <div className="flex items-center gap-2">
            <MapPin size={15} className="text-[#2ECC71]" />
            <span className="tracking-tight font-black uppercase text-sm">
              OBSERVATION STATIONS & LIVE SENSOR MAP
            </span>
          </div>
          <span className="text-[10px] text-[#9A9A9A] font-mono">
            IMD AWS • CWC Gauge • GSI Saturation Nodes • INCOIS Buoys
          </span>
        </div>

        <div className="flex-1 relative min-h-[320px]">
          <RiskMap
            selectedHazard={selectedHazard}
            height="100%"
            showControls={true}
            showLegend={false}
            showLayerPanel={false}
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 13. CONNECTION TO EARLY WARNING */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#FF5A1F] uppercase tracking-wider">
            LIVE CONDITIONS → EARLY WARNING
          </div>
          <p className="text-sm font-bold text-white mt-1">
            Current conditions can indicate developing hazards.
          </p>
          <p className="text-xs text-[#9A9A9A]">
            Proceed to the Early Warning module for hazard forecasting, Doppler radar tracking, and intensity projections.
          </p>
        </div>

        <button
          onClick={() => navigate('/workspace/early-warning')}
          className="flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF7A3D] to-[#FF3D1F] text-white shadow-[0_0_20px_rgba(255,90,31,0.35)] hover:shadow-[0_0_28px_rgba(255,90,31,0.55)] transition-all cursor-pointer shrink-0"
        >
          <span>View Early Warning</span>
          <ArrowRight size={15} />
        </button>
      </div>

    </div>
  );
}
