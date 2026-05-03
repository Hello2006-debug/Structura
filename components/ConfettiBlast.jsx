'use client';
import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiBlast({ triggered }) {
    const fired = useRef(false);

    useEffect(() => {
        if (triggered && !fired.current) {
            fired.current = true;
            confetti({
                particleCount: 150,
                spread: 80,
                origin: { y: 0.8 },
                colors: ['#00F5A0', '#6C63FF', '#ffffff'],
            });
        }
    }, [triggered]);

    return null;
}
