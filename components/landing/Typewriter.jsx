'use client'
import  { useState, useEffect } from 'react';
export default function Typewriter() {
    const [displayText, setDisplayText] = useState('')
    const [wordIndex, setWordIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const words = ['Rebuilt', 'Redesigned', 'Reimagined'];
    useEffect(() => {
        const currentWord = words[wordIndex];
        if (isDeleting && displayText === '') {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
        } else if( !isDeleting && displayText === currentWord) {
            const pause = setTimeout(() => {
                setIsDeleting(true);
            }, 1500)
            return () => clearTimeout(pause);
        }else {
            setTimeout(() => {
                setDisplayText((prev) => {
                    if (isDeleting) {
                        return prev.slice(0, -1);
                    } else {
                        return currentWord.slice(0,prev.length + 1);
                    }
                })
            }, isDeleting ? 80 : 120)
        }
    }, [displayText, isDeleting, wordIndex])
    return (
        <span className="text-primary font-mono">
        {displayText}
        <span className="animate-pulse">|</span>
        </span>
    )}