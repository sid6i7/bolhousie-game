import brands from '@/data/brands.json';

// Game Constants
export const TICKET_ROWS = 3;
export const TICKET_COLS = 5;
export const TICKET_SIZE = TICKET_ROWS * TICKET_COLS;

export const CLAIMS = {
  TEASER: 'Teaser',         // Early Five
  PRIME_TIME: 'Prime Time', // Top Line
  INTERMISSION: 'Intermission', // Middle Line
  LATE_NIGHT: 'Late Night',     // Bottom Line
  JACKPOT: 'Jackpot'        // Full House
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a random ticket with unique brands
 */
export function generateTicket() {
  const shuffledBrands = shuffle(brands);
  const selectedBrands = shuffledBrands.slice(0, TICKET_SIZE);
  
  // Arrange into 3 rows of 5
  const ticket = [];
  for (let i = 0; i < TICKET_ROWS; i++) {
    ticket.push(selectedBrands.slice(i * TICKET_COLS, (i + 1) * TICKET_COLS));
  }
  return ticket;
}

/**
 * Validates a claim
 * @param {Array} ticket - 2D array of brands (3x5)
 * @param {Set} markedIds - Set of marked brand IDs
 * @param {String} claimType - Type of claim (from CLAIMS)
 * @returns {Boolean} - True if claim is valid
 */
export function validateClaim(ticket, markedIds, claimType) {
  if (!ticket || !markedIds) return false;

  const flatTicket = ticket.flat();
  const markedCount = flatTicket.filter(b => markedIds.has(b.id)).length;

  switch (claimType) {
    case CLAIMS.TEASER:
      // Early Five: Any 5 marked
      return markedCount >= 5;

    case CLAIMS.PRIME_TIME:
      // Top Line: All items in row 0 marked
      return ticket[0].every(b => markedIds.has(b.id));

    case CLAIMS.INTERMISSION:
      // Middle Line: All items in row 1 marked
      return ticket[1].every(b => markedIds.has(b.id));

    case CLAIMS.LATE_NIGHT:
      // Bottom Line: All items in row 2 marked
      return ticket[2].every(b => markedIds.has(b.id));

    case CLAIMS.JACKPOT:
      // Full House: All items marked
      return markedCount === TICKET_SIZE;

    default:
      return false;
  }
}
