tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                mono: ['"Roboto Mono"', "sans-serif"],
                roboto: ['"Roboto"', "sans-serif"]
            },
            animation: {
                fadein: "fadein 2s ease-in-out forwards",
                fadeout: "fadeout ease-in-out forwards",
            },
            keyframes: (theme) => ({
                fadein: {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
                fadeout: {
                    "0%": { opacity: 1 },
                    "100%": { opacity: 0 },
                }
            })
        }
    }
}