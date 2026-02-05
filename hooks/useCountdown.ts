import { useEffect, useState } from 'react';

export const useCountdown = (targetDateStr: string) => {
    
    const getTimeLeft = () => {
        const now = new Date().getTime();

        const [y, m, d] = targetDateStr.split('-').map(Number);
        const target = new Date(y, m - 1, d).getTime();

        const diff = Math.max(target - now, 0);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        return { days, hours, minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDateStr]);

    return timeLeft;
};
