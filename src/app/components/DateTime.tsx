import { useState, useEffect } from 'react';

export default function DateTime() {
    const [currentTime, setCurrentTime] = useState(new Date());

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };

    useEffect(() => {
        // Update the time every second
        const intervalId = setInterval(() => {
        setCurrentTime(new Date());
        }, 1000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run the effect only once on mount

    const formattedTime = currentTime.toLocaleString('en-US', options);

    return (
        <div>
            <p>{formattedTime}</p>
        </div>
    );
}