import { useState, useEffect, useRef } from 'react';
import styles from './Caller.module.css';
import brands from '@/data/brands.json';

export default function Caller({ onCall, history = [] }) {
  const [currentBrand, setCurrentBrand] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [pool, setPool] = useState([]);
  const [poolReady, setPoolReady] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const brandsWithAudioRef = useRef(new Set());

  useEffect(() => {
    // Initialize pool with audio-prioritized brands
    const initializePool = async () => {
      const historyIds = new Set(history.map(h => h.id));
      const availableBrands = brands.filter(b => !historyIds.has(b.id));
      
      // Check which brands have audio files
      const audioCheckPromises = availableBrands.map(async (brand) => {
        try {
          const response = await fetch(`/audio/${brand.id}.mp3`, { method: 'HEAD' });
          return { brand, hasAudio: response.ok };
        } catch {
          return { brand, hasAudio: false };
        }
      });
      
      const results = await Promise.all(audioCheckPromises);
      
      // Store brands with audio in ref for later use
      results.forEach(({ brand, hasAudio }) => {
        if (hasAudio) {
          brandsWithAudioRef.current.add(brand.id);
        }
      });
      
      // Separate brands with and without audio
      const brandsWithAudio = results.filter(r => r.hasAudio).map(r => r.brand);
      const brandsWithoutAudio = results.filter(r => !r.hasAudio).map(r => r.brand);
      
      // Shuffle each group separately, then concatenate (audio first)
      const shuffleArray = (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      
      const prioritizedPool = [
        ...shuffleArray(brandsWithAudio),
        ...shuffleArray(brandsWithoutAudio)
      ];
      
      setPool(prioritizedPool);
      setPoolReady(true);
    };
    
    initializePool();
  }, []); // Only runs on mount

  // Check if audio exists for current brand
  useEffect(() => {
    if (!currentBrand) {
      setHasAudio(false);
      return;
    }

    const audioPath = `/audio/${currentBrand.id}.mp3`;
    
    // Check if audio file exists
    fetch(audioPath, { method: 'HEAD' })
      .then(response => {
        setHasAudio(response.ok);
      })
      .catch(() => {
        setHasAudio(false);
      });
    
    // Cleanup: stop audio when brand changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setIsPlaying(false);
      }
    };
  }, [currentBrand]);

  const handlePlayAudio = () => {
    if (!currentBrand || !hasAudio) return;

    const audioPath = `/audio/${currentBrand.id}.mp3`;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioPath);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleCallNext = () => {
    if (pool.length === 0 || !poolReady) return;

    // Pick the first brand from the prioritized pool (audio brands come first)
    const selected = pool[0];
    const newPool = pool.slice(1);

    setPool(newPool);
    setCurrentBrand(selected);
    setRevealed(false);
    
    // Pick a random tagline for this brand
    const randomTagline = selected.taglines[Math.floor(Math.random() * selected.taglines.length)];
    const callData = { ...selected, tagline: randomTagline };
    
    if (onCall) onCall(callData);
  };

  const currentTagline = currentBrand ? (history[history.length - 1]?.tagline || currentBrand.taglines[0]) : null;

  return (
    <div className={styles.callerContainer}>
      <div className={styles.tvScreen}>
        {!currentBrand ? (
          <div className={styles.standby}>
            <h2>Ready to Air?</h2>
            <p>Press NEXT to broadcast the first ad.</p>
          </div>
        ) : (
          <div className={styles.broadcast}>
             <div className={styles.taglineContainer}>
               <h3 className={styles.tagline}>&ldquo;{currentTagline}&rdquo;</h3>
               {hasAudio && (
                 <button 
                   className={`${styles.audioBtn} ${isPlaying ? styles.playing : ''}`}
                   onClick={handlePlayAudio}
                   title={isPlaying ? 'Pause Audio' : 'Play Audio'}
                 >
                   {isPlaying ? '🔊' : '🔈'}
                 </button>
               )}
             </div>
             {revealed ? (
               <div className={styles.brandReveal}>
                 Answer: <span className={styles.brandName}>{currentBrand.name}</span>
               </div>
             ) : (
                <button className={styles.revealBtn} onClick={() => setRevealed(true)}>
                  Reveal Brand ???
                </button>
             )}
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button className="retro-btn secondary" onClick={handleCallNext} disabled={pool.length === 0 || !poolReady}>
          {!poolReady ? 'Loading...' : pool.length === 0 ? 'Show Over' : 'Next Ad >>'}
        </button>
        <div className={styles.counter}>
           Ads Remaining: {pool.length}
        </div>
      </div>
    </div>
  );
}
