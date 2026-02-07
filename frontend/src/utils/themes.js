export const THEMES = {
    RETRO: {
        id: 'retro',
        name: 'STRANGER THINGS',
        colors: {
            primary: 'text-stranger-red', // #ff0033
            secondary: 'text-retro-cyan', // #00ffff
            accent: 'text-retro-amber',   // #ffbf00
            background: 'bg-stranger-black',
            cardBg: 'bg-black/40'
        },
        fonts: {
            title: 'font-title',
            body: 'font-retro'
        },
        effects: {
            glow: 'text-glow',
            crt: true
        }
    },
    CYBERPUNK: {
        id: 'cyberpunk',
        name: 'NIGHT CITY',
        colors: {
            primary: 'text-yellow-400',
            secondary: 'text-pink-500',
            accent: 'text-cyan-400',
            background: 'bg-slate-900',
            cardBg: 'bg-slate-800/80'
        },
        fonts: {
            title: 'font-mono tracking-tighter', // distinct from retro
            body: 'font-sans'
        },
        effects: {
            glow: '',
            crt: false
        }
    },
    MINIMAL: {
        id: 'minimal',
        name: 'CLEAN SLATE',
        colors: {
            primary: 'text-white',
            secondary: 'text-gray-400',
            accent: 'text-gray-200',
            background: 'bg-neutral-900',
            cardBg: 'bg-neutral-800'
        },
        fonts: {
            title: 'font-sans font-bold tracking-wide',
            body: 'font-sans text-sm'
        },
        effects: {
            glow: '',
            crt: false
        }
    },
    CORPORATE: {
        id: 'corporate',
        name: 'PROFESSIONAL',
        colors: {
            primary: 'text-blue-400',
            secondary: 'text-slate-400',
            accent: 'text-blue-200',
            background: 'bg-slate-950',
            cardBg: 'bg-slate-900 border border-slate-700'
        },
        fonts: {
            title: 'font-sans font-semibold',
            body: 'font-sans'
        },
        effects: {
            glow: '',
            crt: false
        }
    }
};

export const getThemeStyle = (themeId) => {
    // Default to RETRO if invalid or missing
    const theme = Object.values(THEMES).find(t => t.id === themeId) || THEMES.RETRO;
    return theme;
};
