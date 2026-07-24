import { useState, useMemo, useEffect } from 'react';
import { ComposableMap, Geographies, Geography, Marker, Line, ZoomableGroup } from 'react-simple-maps';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { useGoogleSheetData, KARUNYA_UNI } from '../../hooks/useGoogleSheetData';
import { useAppStore } from '../../store/useAppStore';
import { MarkerPanel } from './MarkerPanel';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldMap = () => {
  const { data: universities = [] } = useGoogleSheetData();
  const { hoveredUniversity, setHoveredUniversity, selectedUniversity, setSelectedUniversity, searchTerm } = useAppStore();
  const [position, setPosition] = useState({ coordinates: [20, 20] as [number, number], zoom: 1 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const filteredUniversities = useMemo(() => {
    if (!searchTerm) return universities;
    const lower = searchTerm.toLowerCase();
    return universities.filter(u => u.name.toLowerCase().includes(lower) || u.country.toLowerCase().includes(lower));
  }, [universities, searchTerm]);

  const jitteredUniversities = useMemo(() => {
    const processed: typeof filteredUniversities = [];
    const threshold = 4.0; 
    const radiusStep = 3.0;
    const angleStep = Math.PI / 3;

    for (const uni of filteredUniversities) {
      let lon = uni.longitude;
      let lat = uni.latitude;
      let angle = 0;

      while (processed.some(p => Math.sqrt(Math.pow(p.longitude - lon, 2) + Math.pow(p.latitude - lat, 2)) < threshold)) {
        angle += angleStep;
        const r = (angle / (Math.PI * 2)) * radiusStep;
        lon = uni.longitude + Math.cos(angle) * r;
        lat = uni.latitude + Math.sin(angle) * r;
      }
      processed.push({ ...uni, longitude: lon, latitude: lat });
    }
    return processed;
  }, [filteredUniversities]);

  const handleZoomIn = () => {
    if (position.zoom >= 8) return;
    animate(position.zoom, position.zoom * 1.5, {
      duration: 0.4,
      onUpdate: (v) => setPosition(pos => ({ ...pos, zoom: v }))
    });
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    animate(position.zoom, position.zoom / 1.5, {
      duration: 0.4,
      onUpdate: (v) => setPosition(pos => ({ ...pos, zoom: v }))
    });
  };

  const handleReset = () => {
    setSelectedUniversity(null);
    const startCoords = [...position.coordinates];
    const startZoom = position.zoom;
    
    animate(0, 1, {
      duration: 0.8,
      onUpdate: (progress) => {
        setPosition({
          coordinates: [
            startCoords[0] + (20 - startCoords[0]) * progress,
            startCoords[1] + (20 - startCoords[1]) * progress
          ],
          zoom: startZoom + (1 - startZoom) * progress
        });
      }
    });
  };

  useEffect(() => {
    if (selectedUniversity) {
      const startCoords = [...position.coordinates];
      const startZoom = position.zoom;
      
      animate(0, 1, {
        duration: 0.8,
        ease: "easeInOut",
        onUpdate: (progress) => {
          setPosition({
            coordinates: [
              startCoords[0] + (selectedUniversity.longitude - startCoords[0]) * progress,
              startCoords[1] + (selectedUniversity.latitude - startCoords[1]) * progress
            ],
            zoom: startZoom + (3 - startZoom) * progress
          });
        }
      });
    }
  }, [selectedUniversity]);

  return (
    <div className="relative w-full h-full bg-transparent overflow-hidden">
      <div className="absolute top-6 right-6 z-10 flex flex-col gap-3">
        <button onClick={handleZoomIn} className="w-10 h-10 glass-card flex items-center justify-center text-slate-900 dark:text-white text-xl font-bold shadow-lg hover:shadow-brand-cyan/20">+</button>
        <button onClick={handleZoomOut} className="w-10 h-10 glass-card flex items-center justify-center text-slate-900 dark:text-white text-2xl font-bold shadow-lg hover:shadow-brand-cyan/20">-</button>
        <button onClick={handleReset} className="w-10 h-10 glass-card flex items-center justify-center text-brand-cyan text-sm font-bold shadow-lg hover:shadow-brand-cyan/20">R</button>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="w-full h-full"
      >
        <ComposableMap
          projection="geoMercator"
        projectionConfig={{ scale: 130 }}
        width={1000}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(pos) => setPosition(pos)}
          maxZoom={10}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#112240"
                  stroke="#233554"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "#1e3a8a", outline: "none", transition: "all 250ms" },
                    pressed: { fill: "#1e3a8a", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {/* Connection Lines */}
          {jitteredUniversities.map((uni) => (
            <g key={`lines-${uni.sNo}`}>
              {(uni.outboundStudents > 0 || uni.inboundStudents > 0 || uni.inboundFaculty > 0 || uni.outboundFaculty > 0) && (
                <Line
                  from={[KARUNYA_UNI.longitude, KARUNYA_UNI.latitude]}
                  to={[uni.longitude, uni.latitude]}
                  stroke="#9C1C22"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  style={{ strokeDasharray: "4 6", opacity: 0.6 }}
                />
              )}
            </g>
          ))}

          {/* Karunya Marker */}
          <Marker coordinates={[KARUNYA_UNI.longitude, KARUNYA_UNI.latitude]}>
            <circle r={4} fill="#9C1C22" />
            <circle r={12} fill="#9C1C22" opacity={0.3} className="animate-ping" />
            <text textAnchor="middle" y={-15} style={{ fill: "#9C1C22", fontSize: 10, fontWeight: "bold" }}>
              Karunya
            </text>
          </Marker>

          {/* Partner Markers */}
          {jitteredUniversities.map((uni) => (
            <Marker
              key={uni.sNo}
              coordinates={[uni.longitude, uni.latitude]}
              onMouseEnter={() => setHoveredUniversity(uni)}
              onMouseLeave={() => setHoveredUniversity(null)}
              onClick={() => setSelectedUniversity(uni)}
              style={{ zIndex: hoveredUniversity?.sNo === uni.sNo ? 100 : 1 }}
            >
              <circle r={15} fill="rgba(0,0,0,0)" style={{ cursor: 'pointer', pointerEvents: 'all' }} />
              <g style={{ pointerEvents: 'none' }}>
                <circle 
                  r={hoveredUniversity?.sNo === uni.sNo ? 4.5 : 3} 
                  fill="#ffffff" 
                  style={{ transition: "r 0.3s ease" }} 
                />
                <circle 
                  r={hoveredUniversity?.sNo === uni.sNo ? 10.5 : 7} 
                  fill="#ffffff" 
                  opacity={0.2} 
                  style={{ transition: "r 0.3s ease" }} 
                />
                {selectedUniversity?.sNo === uni.sNo && (
                  <circle r={12} stroke="#9C1C22" strokeWidth={1.5} fill="none" className="animate-pulse" />
                )}
              </g>

              {/* Anchored Tooltip */}
              <AnimatePresence>
                {hoveredUniversity?.sNo === uni.sNo && !selectedUniversity && (
                  <foreignObject 
                    x={12} 
                    y={-25} 
                    width={200} 
                    height={100} 
                    style={{ pointerEvents: 'none', overflow: 'visible' }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      style={{ transform: `scale(${1 / position.zoom})`, transformOrigin: 'left center' }}
                      className="glass-panel p-2 flex items-center gap-3 shadow-2xl border border-slate-200 dark:border-white/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-xl w-max max-w-[200px]"
                    >
                      <div className="w-8 h-8 bg-slate-50 dark:bg-white rounded flex items-center justify-center p-1 shrink-0">
                        <img src={uni.logoUrl} alt={uni.name} className="max-w-full max-h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-slate-900 dark:text-white font-bold text-[10px] leading-tight truncate">{uni.name}</h3>
                        <p className="text-brand-cyan text-[9px] mt-0.5 truncate">{uni.country}</p>
                      </div>
                    </motion.div>
                  </foreignObject>
                )}
              </AnimatePresence>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      </motion.div>



      {/* Side Panel */}
      {selectedUniversity && <MarkerPanel />}
    </div>
  );
};
