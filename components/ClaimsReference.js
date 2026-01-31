import { useState } from 'react';
import styles from './ClaimsReference.module.css';

/**
 * Hidable panel showing all claim types and their patterns
 * Positioned on the left side of the screen
 */
export default function ClaimsReference() {
  const [isOpen, setIsOpen] = useState(false);

  const claims = [
    {
      name: 'Teaser',
      pattern: 'Any 5 brands marked',
      icon: '🎬',
      visual: '⬛⬛⬛⬛⬛'
    },
    {
      name: 'Prime Time',
      pattern: 'Top row complete',
      icon: '📺',
      visual: '🟨🟨🟨🟨🟨\n⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜'
    },
    {
      name: 'Intermission',
      pattern: 'Middle row complete',
      icon: '🍿',
      visual: '⬜⬜⬜⬜⬜\n🟨🟨🟨🟨🟨\n⬜⬜⬜⬜⬜'
    },
    {
      name: 'Late Night',
      pattern: 'Bottom row complete',
      icon: '🌙',
      visual: '⬜⬜⬜⬜⬜\n⬜⬜⬜⬜⬜\n🟨🟨🟨🟨🟨'
    },
    {
      name: 'Jackpot',
      pattern: 'Full house - all 15!',
      icon: '🎰',
      visual: '🟨🟨🟨🟨🟨\n🟨🟨🟨🟨🟨\n🟨🟨🟨🟨🟨'
    }
  ];

  return (
    <>
      {/* Toggle Button */}
      <button 
        className={styles.toggleBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Hide claims guide' : 'Show claims guide'}
      >
        {isOpen ? '◀' : '📋'}
      </button>

      {/* Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <h3 className={styles.title}>Claims Guide</h3>
        
        <div className={styles.claimsList}>
          {claims.map((claim) => (
            <div key={claim.name} className={styles.claimItem}>
              <div className={styles.claimHeader}>
                <span className={styles.claimIcon}>{claim.icon}</span>
                <span className={styles.claimName}>{claim.name}</span>
              </div>
              <p className={styles.claimPattern}>{claim.pattern}</p>
              <pre className={styles.claimVisual}>{claim.visual}</pre>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
