import { useEffect, useRef, useState } from "react";

// returns [ref, inView boolean] with IntersectionObserver (no extra deps)
export const useInView = ({ threshold = 0.2, once = true } = {}) => {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (once) io.disconnect();
                } else if (!once) {
                    setInView(false);
                }
            },
            { threshold }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [threshold, once]);
    return [ref, inView];
};

// Tracks which scrolly step is centered in the viewport.
export const useStepIndex = (count) => {
    const refs = useRef([]);
    const [active, setActive] = useState(0);
    useEffect(() => {
        const observers = [];
        refs.current.forEach((el, i) => {
            if (!el) return;
            const io = new IntersectionObserver(
                (entries) => {
                    entries.forEach((e) => {
                        if (e.isIntersecting) setActive(i);
                    });
                },
                { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
            );
            io.observe(el);
            observers.push(io);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, [count]);
    return { refs, active };
};
