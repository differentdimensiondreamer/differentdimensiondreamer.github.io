window.UI_TEXT = {
  site: {
    menu: [
      { label: 'Combos', href: 'combos.html' },
      { label: 'Matchups', href: 'matchups.html' },
      { label: 'Articles', href: 'articles.html', match: 'articles/' },
      { label: 'Calculator', href: 'calculator.html' },
      { label: 'Videos', href: 'videos.html' }
    ],
    footer: { text: 'A personal site. Content is provided for general information only.' },
    footerLinks: [
      { label: 'About', href: 'about.html' },
      { label: 'Lore', href: 'lore.html' },
      { label: 'Privacy', href: 'privacy.html' }
    ],
    brand: { start: 'differentdimension', accent: 'dreamer' }
  },
  combos: {
    find: {
      empty: 'Your lines appear here, best end board first.',
      none: 'No line for this hand yet. Try adding a card.'
    },
    stats: {
      power: 'Power',
      powerSub: 'Ceiling',
      consistency: 'Consistency',
      resilience: 'Resilience',
      versatility: 'Versatility',
      recovery: 'Recovery',
      recoverySub: 'Grind game',
      powerNote: 'Average end board of the {lines} main lines (rounded down). Best line: {best}.'
    },
    matrix: { empty: 'No alternative lines written for this build yet.', pick: 'Pick at least one card above.' },
    yourDeck: {
      intro: 'Import a .ydk deck file to use your own deck. It is read in your browser and stays on this device.'
    }
  },
  matchups: {
    verdict: { favoured: 'Favoured', unfavoured: 'Unfavoured', even: 'Even' },
    intro: {
      pick: 'Pick the deck you are playing against: tap the right side of the banner.',
      video: '▶ Watch the matchup on YouTube'
    },
    noPlan: { text: 'No plan for {build} against this deck yet.' },
    cheat: {
      tldr: 'TL;DR',
      statSheet: 'Stat sheet',
      nonEngine: 'Non-engine for this matchup',
      nonEngineHint: 'The hand traps and board breakers that hit this deck hardest. Tap one for its targets.',
      watchOut: 'Watch out for',
      watchOutHint: 'The hand traps and board breakers this deck usually runs, so you know what to expect on your turn.',
      empty: 'No cheat sheet for this deck yet.'
    },
    first: {
      line: 'Your line',
      playAround: 'Play around it',
      playAroundHint: 'Alternative lines of this combo when they have the card.',
      worstCase: 'Worst case from the line’s “vs” blocks: you play around the card, they use it at the worst timing.'
    },
    steps: {
      stop: 'Stop their turn',
      analyze: 'Analyze their board',
      bait: 'Bait their interaction',
      breakBoard: 'Break their board'
    },
    stop: {
      hint: 'The hand traps that hit this deck hardest. Tap one for its targets.',
      empty: 'Nothing listed yet.'
    },
    board: {
      noneState: 'Lowest ceiling:',
      noneText: 'nothing on the field, a hand full of hand traps or traps set.',
      halfState: 'Interrupted:',
      halfText: 'hand traps or set traps plus 1–2 interactions on the field.',
      fullState: 'Uninterrupted:',
      fullText: 'they reached their highest ceiling.',
      empty: 'Nothing written for this board yet.'
    },
    bait: {
      hint: 'Optional, depends on your hand: standard openings that make them spend their interaction before you commit your real line.'
    },
    finish: {
      hint: 'Push for game now, or play the long game when you lack resources in hand or on the field, or when grinding favours you.',
      otkHint: 'Situational: depends on their decklist and side deck, and on what you sided in.',
      grindHint: 'Lines for the long game: the interruptions you hold on their turn, what you break their board with, and the most damage you can deal before their turn 3.'
    }
  },
  player: {
    controls: { noLines: 'No alternative lines for this combo yet.' },
    full: { tapHint: 'Tap a ⚡ to see a timing.' },
    steps: { before: 'You have not played anything yet.', ask: 'Interrupted here?' }
  }
};
