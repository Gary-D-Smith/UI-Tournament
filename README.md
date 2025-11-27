# PSY360 Survey Platform

A tournament-style survey platform for psychology studies with two rounds of UI preference testing.

## Features

### Round 1: Component Selection
- Select UI version A or B for 5 component designs:
  - Add Button
  - Background
  - Check Style
  - Checkbox Type
  - Title

### Round 2: Swiss-Style Tournament
- Tournament with 32 UI designs
- Choose between left or right design in each match
- Swiss-style pairing system that continues with winners
- Automatic progression through rounds until a favorite is selected

### Results
- Preferred component type for each component (A or B)
- Final tournament ranking with:
  - Top UI design
  - Runner-ups
  - Complete ranking of all 32 UIs
- Export results as JSON

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Project Structure

```
src/
  ├── components/
  │   ├── Round1.tsx      # Round 1 component selection
  │   ├── Round2.tsx      # Round 2 tournament
  │   └── Results.tsx     # Results display and export
  ├── types.ts            # TypeScript type definitions
  ├── App.tsx             # Main application component
  └── main.tsx            # Application entry point
```

## Survey Flow

1. **Introduction**: Welcome screen explaining the survey
2. **Round 1**: Select A or B for 5 component types
3. **Round 2**: Swiss-style tournament with 36 UI designs
4. **Results**: View and export complete results

## Results Output

The exported JSON includes:
- Round 1 selections (component type → A/B preference)
- Tournament results (wins/losses for each UI)
- Final ranking (ordered list of UI IDs)
- Summary (top UI, runner-ups, preferred components)

## Technologies

- React 18
- TypeScript
- Vite
- Tailwind CSS

