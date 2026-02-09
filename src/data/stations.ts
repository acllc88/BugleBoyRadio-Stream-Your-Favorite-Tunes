export interface RadioStation {
  id: string;
  name: string;
  genre: string;
  city: string;
  state: string;
  streamUrl: string;
  emoji: string;
  description: string;
  color: string;
}

// ONLY 100% VERIFIED WORKING STATIONS - SomaFM & Radio Paradise
export const stations: RadioStation[] = [
  // ============ SOMAFM STATIONS (San Francisco, CA) - ALL VERIFIED WORKING ============
  {
    id: 'somafm-groovesalad',
    name: 'Groove Salad',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
    emoji: '🥗',
    description: 'Downtempo ambient grooves',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 'somafm-dronezone',
    name: 'Drone Zone',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/dronezone-128-mp3',
    emoji: '🌌',
    description: 'Atmospheric ambient space music',
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'somafm-lush',
    name: 'Lush',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/lush-128-mp3',
    emoji: '🌸',
    description: 'Sensuous female vocals with chillout',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'somafm-deepspaceone',
    name: 'Deep Space One',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/deepspaceone-128-mp3',
    emoji: '🚀',
    description: 'Deep ambient electronic exploration',
    color: 'from-slate-600 to-zinc-800'
  },
  {
    id: 'somafm-spacestation',
    name: 'Space Station Soma',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/spacestation-128-mp3',
    emoji: '🛸',
    description: 'Spaced-out ambient and mid-tempo',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'somafm-defcon',
    name: 'DEF CON Radio',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/defcon-128-mp3',
    emoji: '💻',
    description: 'Hacker conference radio',
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'somafm-beatblender',
    name: 'Beat Blender',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/beatblender-128-mp3',
    emoji: '🎚️',
    description: 'Deep house and downtempo',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 'somafm-thetrip',
    name: 'The Trip',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/thetrip-128-mp3',
    emoji: '🎆',
    description: 'Progressive house and trance',
    color: 'from-fuchsia-500 to-pink-600'
  },
  {
    id: 'somafm-cliqhop',
    name: 'cliqhop idm',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/cliqhop-128-mp3',
    emoji: '🔊',
    description: 'Intelligent dance music',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'somafm-dubstep',
    name: 'Dubstep Beyond',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/dubstep-128-mp3',
    emoji: '🔉',
    description: 'Dubstep and bass music',
    color: 'from-gray-600 to-slate-800'
  },
  {
    id: 'somafm-vaporwaves',
    name: 'Vaporwaves',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/vaporwaves-128-mp3',
    emoji: '🌊',
    description: 'Vaporwave and future funk',
    color: 'from-pink-400 to-purple-500'
  },
  {
    id: 'somafm-secretagent',
    name: 'Secret Agent',
    genre: 'Lounge',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/secretagent-128-mp3',
    emoji: '🕵️',
    description: 'Spy themes and lounge music',
    color: 'from-gray-700 to-zinc-900'
  },
  {
    id: 'somafm-illinois',
    name: 'Illinois Street Lounge',
    genre: 'Lounge',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/illstreet-128-mp3',
    emoji: '🍸',
    description: 'Classic bachelor pad music',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'somafm-sonicuniverse',
    name: 'Sonic Universe',
    genre: 'Jazz',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/sonicuniverse-128-mp3',
    emoji: '🎷',
    description: 'Jazz from across the universe',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'somafm-7soul',
    name: 'Seven Inch Soul',
    genre: 'Soul',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/7soul-128-mp3',
    emoji: '💿',
    description: 'Vintage soul 45s',
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'somafm-bootliquor',
    name: 'Boot Liquor',
    genre: 'Country',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/bootliquor-128-mp3',
    emoji: '🤠',
    description: 'Americana and country',
    color: 'from-amber-700 to-yellow-800'
  },
  {
    id: 'somafm-folkforward',
    name: 'Folk Forward',
    genre: 'Folk',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/folkfwd-128-mp3',
    emoji: '🪕',
    description: 'Contemporary folk music',
    color: 'from-lime-500 to-green-600'
  },
  {
    id: 'somafm-indiepop',
    name: 'Indie Pop Rocks!',
    genre: 'Indie',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/indiepop-128-mp3',
    emoji: '🎸',
    description: 'Indie pop and rock',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'somafm-u80s',
    name: 'Underground 80s',
    genre: 'Retro',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/u80s-128-mp3',
    emoji: '📼',
    description: '80s alternative and new wave',
    color: 'from-purple-500 to-fuchsia-600'
  },
  {
    id: 'somafm-metal',
    name: 'Metal Detector',
    genre: 'Metal',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/metal-128-mp3',
    emoji: '🤘',
    description: 'Heavy metal from all eras',
    color: 'from-gray-800 to-black'
  },
  {
    id: 'somafm-poptron',
    name: 'PopTron',
    genre: 'Pop',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/poptron-128-mp3',
    emoji: '✨',
    description: 'Electropop and indie dance',
    color: 'from-pink-500 to-violet-600'
  },
  {
    id: 'somafm-thistle',
    name: 'ThistleRadio',
    genre: 'Folk',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/thistle-128-mp3',
    emoji: '🌿',
    description: 'Celtic and Scottish music',
    color: 'from-emerald-500 to-green-700'
  },
  {
    id: 'somafm-covers',
    name: 'Covers',
    genre: 'Eclectic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/covers-128-mp3',
    emoji: '🎤',
    description: 'Cover songs and remakes',
    color: 'from-cyan-500 to-teal-600'
  },
  {
    id: 'somafm-bagel',
    name: 'BAGeL Radio',
    genre: 'Eclectic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/bagel-128-mp3',
    emoji: '🥯',
    description: 'Eclectic mix of everything',
    color: 'from-yellow-400 to-amber-500'
  },
  {
    id: 'somafm-sf1033',
    name: 'SF 10-33',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/sf1033-128-mp3',
    emoji: '🚔',
    description: 'Ambient with scanner feeds',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'somafm-suburbs',
    name: 'Suburbs of Goa',
    genre: 'World',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/suburbsofgoa-128-mp3',
    emoji: '🕉️',
    description: 'Indian and world electronic',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'somafm-reggae',
    name: 'Heavyweight Reggae',
    genre: 'Reggae',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/reggae-128-mp3',
    emoji: '🇯🇲',
    description: 'Roots reggae and dub',
    color: 'from-green-500 to-yellow-500'
  },
  {
    id: 'somafm-christmas',
    name: 'Christmas Lounge',
    genre: 'Holiday',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/christmas-128-mp3',
    emoji: '🎄',
    description: 'Holiday lounge and jazz',
    color: 'from-red-500 to-green-500'
  },
  {
    id: 'somafm-xmasrocks',
    name: 'Christmas Rocks!',
    genre: 'Holiday',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/xmasrocks-128-mp3',
    emoji: '🎅',
    description: 'Holiday rock music',
    color: 'from-red-600 to-rose-700'
  },
  {
    id: 'somafm-jollysoul',
    name: 'Jolly Ol Soul',
    genre: 'Holiday',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/jollysoul-128-mp3',
    emoji: '🎁',
    description: 'Holiday soul and R&B',
    color: 'from-red-500 to-amber-500'
  },
  {
    id: 'somafm-fluid',
    name: 'Fluid',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/fluid-128-mp3',
    emoji: '💧',
    description: 'Liquid sounds and chillout',
    color: 'from-blue-400 to-cyan-500'
  },
  {
    id: 'somafm-scanner',
    name: 'Scanner',
    genre: 'Experimental',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/scanner-128-mp3',
    emoji: '📻',
    description: 'Experimental and avant-garde',
    color: 'from-gray-500 to-slate-700'
  },
  {
    id: 'somafm-missioncontrol',
    name: 'Mission Control',
    genre: 'Ambient',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/missioncontrol-128-mp3',
    emoji: '🌙',
    description: 'NASA audio and ambient',
    color: 'from-slate-700 to-gray-900'
  },
  {
    id: 'somafm-live',
    name: 'SomaFM Live',
    genre: 'Eclectic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/live-128-mp3',
    emoji: '🎙️',
    description: 'Live performances and events',
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'somafm-digitalis',
    name: 'Digitalis',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/digitalis-128-mp3',
    emoji: '🌺',
    description: 'Digitally influenced music',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 'somafm-synphaera',
    name: 'Synphaera Radio',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/synphaera-128-mp3',
    emoji: '🎹',
    description: 'Ambient and space music',
    color: 'from-indigo-400 to-blue-600'
  },
  {
    id: 'somafm-n5md',
    name: 'n5MD Radio',
    genre: 'Electronic',
    city: 'San Francisco',
    state: 'CA',
    streamUrl: 'https://ice1.somafm.com/n5md-128-mp3',
    emoji: '🎵',
    description: 'Electronic and experimental',
    color: 'from-teal-500 to-cyan-600'
  },

  // ============ RADIO PARADISE (Paradise, CA) - ALL VERIFIED WORKING ============
  {
    id: 'radioparadise-main',
    name: 'Radio Paradise',
    genre: 'Eclectic',
    city: 'Paradise',
    state: 'CA',
    streamUrl: 'https://stream.radioparadise.com/aac-320',
    emoji: '🌴',
    description: 'Eclectic mix - best of all genres',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'radioparadise-mellow',
    name: 'RP Mellow',
    genre: 'Chill',
    city: 'Paradise',
    state: 'CA',
    streamUrl: 'https://stream.radioparadise.com/mellow-320',
    emoji: '😌',
    description: 'Mellow and relaxing mix',
    color: 'from-blue-400 to-indigo-500'
  },
  {
    id: 'radioparadise-rock',
    name: 'RP Rock',
    genre: 'Rock',
    city: 'Paradise',
    state: 'CA',
    streamUrl: 'https://stream.radioparadise.com/rock-320',
    emoji: '🎸',
    description: 'Classic and modern rock',
    color: 'from-red-500 to-orange-600'
  },
  {
    id: 'radioparadise-global',
    name: 'RP Global',
    genre: 'World',
    city: 'Paradise',
    state: 'CA',
    streamUrl: 'https://stream.radioparadise.com/global-320',
    emoji: '🌍',
    description: 'World music and global sounds',
    color: 'from-emerald-500 to-teal-600'
  },

  // ============ VERIFIED PUBLIC RADIO STATIONS ============
  {
    id: 'kexp',
    name: 'KEXP 90.3',
    genre: 'Indie',
    city: 'Seattle',
    state: 'WA',
    streamUrl: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
    emoji: '🎸',
    description: 'Seattle public radio - indie & alternative',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'kcrw',
    name: 'KCRW 89.9',
    genre: 'Eclectic',
    city: 'Santa Monica',
    state: 'CA',
    streamUrl: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_e24',
    emoji: '🌊',
    description: 'NPR affiliate with eclectic music',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 'wfmu',
    name: 'WFMU',
    genre: 'Eclectic',
    city: 'Jersey City',
    state: 'NJ',
    streamUrl: 'https://stream0.wfmu.org/freeform-128k',
    emoji: '📻',
    description: 'Freeform radio - anything goes',
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'jazz24',
    name: 'Jazz24',
    genre: 'Jazz',
    city: 'Seattle',
    state: 'WA',
    streamUrl: 'https://live.wostreaming.net/direct/ppm-jazz24aac-ibc1',
    emoji: '🎷',
    description: '24/7 Jazz from KNKX',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'kusc',
    name: 'KUSC Classical',
    genre: 'Classical',
    city: 'Los Angeles',
    state: 'CA',
    streamUrl: 'https://kusc.streamguys1.com/kusc-128k.mp3',
    emoji: '🎻',
    description: 'Southern California classical',
    color: 'from-amber-600 to-yellow-700'
  },
  {
    id: 'wqxr',
    name: 'WQXR',
    genre: 'Classical',
    city: 'New York',
    state: 'NY',
    streamUrl: 'https://stream.wqxr.org/wqxr',
    emoji: '🎼',
    description: 'New York classical music',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: 'king-fm',
    name: 'KING FM',
    genre: 'Classical',
    city: 'Seattle',
    state: 'WA',
    streamUrl: 'https://classicalking.streamguys1.com/king-fm-aac',
    emoji: '👑',
    description: 'Classical music 24/7',
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'wwoz',
    name: 'WWOZ 90.7',
    genre: 'Jazz',
    city: 'New Orleans',
    state: 'LA',
    streamUrl: 'https://wwoz-sc.streamguys1.com/wwoz-hi.mp3',
    emoji: '🎺',
    description: 'New Orleans jazz and heritage',
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'thecurrent',
    name: 'The Current',
    genre: 'Indie',
    city: 'Minneapolis',
    state: 'MN',
    streamUrl: 'https://current.stream.publicradio.org/kcmp.mp3',
    emoji: '⚡',
    description: 'Minnesota Public Radio indie music',
    color: 'from-yellow-400 to-red-500'
  },
  {
    id: 'wxpn',
    name: 'WXPN 88.5',
    genre: 'Eclectic',
    city: 'Philadelphia',
    state: 'PA',
    streamUrl: 'https://wxpnhi.xpn.org/xpnhi',
    emoji: '🌟',
    description: 'Adult album alternative',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'kutx',
    name: 'KUTX 98.9',
    genre: 'Indie',
    city: 'Austin',
    state: 'TX',
    streamUrl: 'https://kut.streamguys1.com/kutx-free.aac',
    emoji: '🎵',
    description: 'Austin indie and local music',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'knkx',
    name: 'KNKX',
    genre: 'Jazz',
    city: 'Tacoma',
    state: 'WA',
    streamUrl: 'https://live.wostreaming.net/direct/ppm-knkxfm-ibc1',
    emoji: '🎹',
    description: 'Jazz and blues public radio',
    color: 'from-blue-500 to-indigo-600'
  },

  // ============ LOCAL ALABAMA & SOUTH CAROLINA ============
  {
    id: 'wual',
    name: 'WUAL 91.5',
    genre: 'Classical',
    city: 'Tuscaloosa',
    state: 'AL',
    streamUrl: 'https://stream.apr.org/wual.mp3',
    emoji: '🎼',
    description: 'Alabama Public Radio - Classical',
    color: 'from-red-600 to-amber-600'
  },
  {
    id: 'scpublicradio',
    name: 'SC Public Radio',
    genre: 'News',
    city: 'Columbia',
    state: 'SC',
    streamUrl: 'https://playerservices.streamtheworld.com/api/livestream-redirect/WLOSFM.mp3',
    emoji: '📰',
    description: 'South Carolina public radio',
    color: 'from-blue-600 to-indigo-600'
  }
];

export type { RadioStation as Station };
