# Tournament Comparison Count

## Round 1: Component Selection
- 5 comparisons (one for each component type)

## Round 2: Tournament Structure

### Initial Round
- Round 1 (Winners): 32 designs → 16 matches
  - 16 winners advance
  - 16 losers go to losers bracket

### After Round 1
- Round 2 (Losers): 16 losers → 8 matches
  - 8 winners from losers advance
  - 8 losers eliminated

- Round 2 (Winners): 16 winners → 8 matches
  - 8 winners advance
  - 8 losers go to losers from winners

### After Round 2
- Round 2 (Losers of Winners): 8 losers from winners → 4 matches
  - 4 winners (for ranking)
  
- Round 3 (Winners): 8 winners → 4 matches
  - 4 winners advance
  - 4 losers go to losers from winners

- Round 3 (Losers): 8 winners from losers → 4 matches
  - 4 winners from losers advance
  - 4 losers eliminated

### After Round 3
- Round 3 (Losers of Winners): 4 losers from winners → 2 matches
  - 2 winners (for ranking)

- Round 3 (Winners of Losers): 4 winners from losers → 2 matches
  - 2 winners from losers advance
  - 2 losers eliminated

- Round 4 (Winners): 4 winners → 2 matches
  - 2 winners advance
  - 2 losers go to losers from winners

### After Round 4
- Round 4 (Losers of Winners): 2 losers from winners → 1 match
  - 1 winner (for ranking)

- Round 4 (Winners of Losers): 2 winners from losers → 1 match
  - 1 winner (for ranking)

- Final: 2 winners → 1 match
  - 1 final winner

## Total Count

### Round 1 (Component Selection)
- 5 comparisons

### Round 2 (Tournament)

#### Initial Round
- **Round 1 (Winners Bracket)**: 16 matches
  - Input: 32 designs (all designs)
  - Output: 16 winners advance to Round 2 Winners, 16 losers go to Round 2 Losers

#### After Round 1
- **Round 2 (Losers Bracket)**: 8 matches
  - Input: 16 losers from Round 1
  - Output: 8 winners from losers advance, 8 losers eliminated

- **Round 2 (Winners Bracket)**: 8 matches
  - Input: 16 winners from Round 1
  - Output: 8 winners advance to Round 3 Winners, 8 losers go to Round 2 Losers of Winners

#### After Round 2
- **Round 2 (Losers of Winners)**: 4 matches
  - Input: 8 losers from Round 2 Winners bracket
  - Output: 4 winners (for ranking purposes only, these are eliminated)

- **Round 3 (Winners Bracket)**: 4 matches
  - Input: 8 winners from Round 2 Winners
  - Output: 4 winners advance to Round 4 Winners, 4 losers go to Round 3 Losers of Winners

- **Round 3 (Losers Bracket)**: 4 matches
  - Input: 8 winners from losers (from Round 2 Losers)
  - Output: 4 winners from losers advance, 4 losers eliminated

#### After Round 3
- **Round 3 (Losers of Winners)**: 2 matches
  - Input: 4 losers from Round 3 Winners bracket
  - Output: 2 winners (for ranking purposes only)

- **Round 3 (Winners of Losers)**: 2 matches
  - Input: 4 winners from losers (from Round 3 Losers)
  - Output: 2 winners from losers advance, 2 losers eliminated

- **Round 4 (Winners Bracket)**: 2 matches
  - Input: 4 winners from Round 3 Winners
  - Output: 2 winners advance to Final, 2 losers go to Round 4 Losers of Winners

#### After Round 4
- **Round 4 (Losers of Winners)**: 1 match
  - Input: 2 losers from Round 4 Winners bracket
  - Output: 1 winner (for ranking purposes only)

- **Round 4 (Winners of Losers)**: 1 match
  - Input: 2 winners from losers (from Round 3 Winners of Losers)
  - Output: 1 winner (for ranking purposes only)

- **Final (Winners Bracket)**: 1 match
  - Input: 2 winners from Round 4 Winners
  - Output: 1 final winner (undefeated, 0 losses)

### Tournament Comparison Count
- Round 1 Winners: 16 matches
- Round 2 Losers: 8 matches
- Round 2 Winners: 8 matches
- Round 2 Losers of Winners: 4 matches
- Round 3 Winners: 4 matches
- Round 3 Losers: 4 matches
- Round 3 Losers of Winners: 2 matches
- Round 3 Winners of Losers: 2 matches
- Round 4 Winners: 2 matches
- Round 4 Losers of Winners: 1 match
- Round 4 Winners of Losers: 1 match
- Final: 1 match

**Tournament subtotal: 53 comparisons**

**Grand Total: 5 (Round 1) + 53 (Round 2) = 58 comparisons**

### Note on Actual Count
The actual number of comparisons may be slightly less (around 54) if some bracket rounds are skipped or combined based on the tournament progression logic. The exact count depends on when the tournament terminates (when only 1 design remains in the winners bracket).

## Verification
If you're seeing 54, it might be:
- 5 (Round 1) + 49 (Round 2) = 54
- Or some rounds are being skipped/combined

Let me check the actual code flow to see if all these rounds execute...

