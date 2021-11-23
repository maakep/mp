
/**
 * Test the true mettle of the RNG gods for this transaction
 * 
 * @returns whether or not the payer should feel a sense of pride and accomplishment
 */
export function isAccomplished(): boolean {

  // 0.1% chance ish to feel a great sense of pride and accomplishment
  const rand = Math.random() * 1000;
  return rand < 1;

}