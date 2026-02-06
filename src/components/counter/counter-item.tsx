import { useEffect, useRef, useState } from "react";

type CounterProps = {
    min: number;
    max: number;
}

export default function CounterItem({ min, max }: CounterProps) {
    const [counted, setCounted] = useState<number>(min);
    const targetElement = useRef<HTMLSpanElement>(null);

    const startCountup = () => {
        const intervalId = setInterval(() => {
            setCounted((pre) => {
                const tempCount = pre + Math.ceil(max / 20);
                if (tempCount >= max) {
                    clearInterval(intervalId);
                    return max;
                } else {
                    return tempCount;
                }
            });
        }, 70);
    };

    useEffect(() => {
        function handleIntersection(entries: IntersectionObserverEntry[]) {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setCounted(min);
                    startCountup();
                }
            });
        }

        const options: IntersectionObserverInit = {
            root: null,
            rootMargin: "0px",
            threshold: 0.5,
        };

        const observer = new IntersectionObserver(handleIntersection, options);

        if (targetElement.current) {
            observer.observe(targetElement.current);
        }

        return () => {
            setCounted(min);
            observer.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <i ref={targetElement}>{counted}</i>;
}
