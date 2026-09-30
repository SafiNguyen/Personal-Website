"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import BackHomeLink from "../components/backHomeLink";
import TransitionLink from "../components/transition/transitionLink";
import styles from "./page.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const chapters = [
    {
        id: "bio",
        number: "01",
        eyebrow: "The person behind the page",
        title: "Bio",
        marker: "B",
        description: (
            <>
                I’m <span>[your name]</span>, a <span>[what you do]</span> with a curiosity
                for <span>[the things that interest you]</span>. This is where the story
                starts—and there’s always more around the corner.
            </>
        ),
        note: "A little context goes a long way.",
    },
    {
        id: "work",
        number: "02",
        eyebrow: "Ideas made tangible",
        title: "My work",
        marker: "W",
        description: (
            <>
                I work across <span>[your skills or disciplines]</span>, turning
                thoughtful ideas into things people can use, see, or experience. I’m
                especially drawn to <span>[the work you want to do more of]</span>.
            </>
        ),
        note: "A few things I’ve made, and what I learned along the way.",
    },
    {
        id: "hobby",
        number: "03",
        eyebrow: "Off the clock",
        title: "My hobby",
        marker: "H",
        description: (
            <>
                Away from work, you’ll usually find me <span>[a hobby you love]</span>.
                It keeps me curious, gives me a different perspective, and reminds me
                to make time for play.
            </>
        ),
        note: "The little things that keep the ideas flowing.",
    },
];

export default function About() {
    const pageRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const motion = gsap.matchMedia();

        motion.add("(prefers-reduced-motion: no-preference)", () => {
            const sections = gsap.utils.toArray<HTMLElement>(`.${styles.chapter}`);

            sections.forEach((section) => {
                const meta = section.querySelector(`.${styles.chapterMeta}`);
                const title = section.querySelector(`.${styles.chapterCopy} h2`);
                const description = section.querySelector(`.${styles.description}`);
                const note = section.querySelector(`.${styles.note}`);
                const artwork = section.querySelector(`.${styles.artwork}`);
                const orb = section.querySelector(`.${styles.artworkOrb}`);

                const timeline = gsap.timeline({
                    defaults: { duration: 0.65, ease: "power3.out" },
                    scrollTrigger: {
                        trigger: section,
                        start: "top 78%",
                        once: true,
                    },
                });

                if (meta) timeline.from(meta, { autoAlpha: 0, y: 18, duration: 0.45 });
                if (title) timeline.from(title, { autoAlpha: 0, y: 34 }, "-=0.12");
                if (description) timeline.from(description, { autoAlpha: 0, y: 24 }, "-=0.35");
                if (note) timeline.from(note, { autoAlpha: 0, y: 16, duration: 0.45 }, "-=0.38");
                if (artwork) timeline.from(artwork, { autoAlpha: 0, y: 30, scale: 0.96 }, "-=0.72");
                if (orb) timeline.from(orb, { scale: 0.76, rotation: -12, duration: 0.85, ease: "back.out(1.5)" }, "-=0.58");
            });
        });

        return () => motion.revert();
    }, { scope: pageRef });

    return (
        <main id="top" ref={pageRef} className={styles.page}>
            <div className={styles.shell}>
                <header className={styles.header}>
                    <div className={styles.headerTop}>
                        <p className={styles.kicker}>A few things about me</p>
                        <BackHomeLink className={styles.homeLink}>
                            <span aria-hidden="true">↖</span> Home
                        </BackHomeLink>
                    </div>

                    <h1 className={styles.heroTitle}>
                        More than
                        <br />
                        <span>one thing.</span>
                    </h1>
                    <p className={styles.intro}>
                        A quick introduction to who I am, what I make, and what I love
                        doing when I’m not making it.
                    </p>

                    <nav className={styles.chapterNav} aria-label="About sections">
                        {chapters.map((chapter) => (
                            <a key={chapter.id} href={`#${chapter.id}`}>
                                <span>{chapter.number}</span> {chapter.title}
                                <span aria-hidden="true" className={styles.navArrow}>↘</span>
                            </a>
                        ))}
                    </nav>
                </header>

                <div className={styles.chapters}>
                    {chapters.map((chapter) => (
                        <section
                            key={chapter.id}
                            id={chapter.id}
                            className={styles.chapter}
                            aria-labelledby={`${chapter.id}-title`}
                        >
                            <div className={styles.chapterMeta}>
                                <span className={styles.chapterNumber}>{chapter.number}</span>
                                <span className={styles.chapterEyebrow}>{chapter.eyebrow}</span>
                            </div>

                            <div className={styles.chapterBody}>
                                <div className={styles.chapterCopy}>
                                    <h2 id={`${chapter.id}-title`}>{chapter.title}</h2>
                                    <p className={styles.description}>{chapter.description}</p>
                                    <p className={styles.note}>{chapter.note}</p>
                                </div>

                                <div className={`${styles.artwork} ${styles[`artwork${chapter.marker}`]}`} aria-hidden="true">
                                    <span className={styles.artworkOrb} />
                                    <span className={styles.artworkLetter}>{chapter.marker}</span>
                                    <span className={styles.artworkCaption}>{chapter.number} / 03</span>
                                </div>
                            </div>
                        </section>
                    ))}
                </div>

                <footer className={styles.footer}>
                    <span>That’s the short version.</span>
                    <a href="#top">
                        Back to top ↑
                    </a>
                </footer>

                <div className={styles.workCta}>
                    <p>Want to see what I make?</p>
                    <TransitionLink href="/Projects" className={styles.workButton}>
                        Explore my work <span aria-hidden="true">↗</span>
                    </TransitionLink>
                </div>
            </div>
        </main>
    );
}
