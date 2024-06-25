import React from 'react'

export default function ContentContainer({ children, styles, tailwindstyle }: { children: any, styles: any, tailwindstyle: string }) {
    return (
        <div style={styles} className={`${tailwindstyle} mt-0 bg-main-content self-center border-t-0 border-opacity-light border-white border-1 border mb-7 flex flex-col md:mb-0 px-3 md:py-1 py-4 w-full`}>
            {children}
        </div>
    )
}
