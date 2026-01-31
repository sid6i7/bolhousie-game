import styles from './Ticket.module.css';

export default function Ticket({ ticket, markedIds, onToggle, isPlayer = true }) {
  if (!ticket) return <div className={styles.loading}>Generating Ticket...</div>;

  return (
    <div className={styles.ticketContainer}>
      <div className={styles.ticketHeader}>
        <span>BOL</span>
        <span>HOU</span>
        <span>SIE</span>
      </div>
      <div className={styles.grid}>
        {ticket.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className={styles.row}>
            {row.map((brand) => {
              const isMarked = markedIds.has(brand.id);
              return (
                <div 
                  key={brand.id} 
                  className={`${styles.cell} ${isMarked ? styles.marked : ''} ${!isPlayer ? styles.readonly : ''}`}
                  onClick={() => isPlayer && onToggle(brand.id)}
                >
                  <span className={styles.brandName}>{brand.name}</span>
                  {isMarked && <div className={styles.stamp}>X</div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
