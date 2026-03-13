import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'

/*
  JetBrains Mono — used for headings, code blocks, and node values.
  "variable" creates a CSS custom property called --font-jetbrains
  that we reference in globals.css.
  "subsets: ['latin']" means only load the characters we need (English).
*/
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

/*
  Inter — used for body text and descriptions.
  Same pattern as above, creates --font-inter.
*/
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Structura',
  description: 'Making Data Structures Beautiful — and Critical.',
}

/*
  RootLayout wraps every page in the app.
  We attach both font variables to the <html> element via className.
  This makes --font-jetbrains and --font-inter available everywhere
  in your CSS and Tailwind classes.
*/
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  )
}
