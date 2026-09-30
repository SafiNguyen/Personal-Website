"use client";

import { useEffect, useRef, useState } from "react";
import BackHomeLink from "../components/backHomeLink";
import styles from "./page.module.css";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
const DAY_START = 5 * 60;
const DAY_END = 23 * 60;
const SCHEDULE_MINUTES = DAY_END - DAY_START;

const CATEGORIES = {
  class: "Classes",
  study: "Study & revise",
  flex: "Flex project",
  routine: "Meals & routine",
  game: "Game",
} as const;

type Category = keyof typeof CATEGORIES;
type Block = {
  day?: number;
  start: string;
  end: string;
  name: string;
  room?: string;
  category: Category;
  startMinute: number;
  endMinute: number;
  conflict?: boolean;
};
type BlockInput = Omit<Block, "startMinute" | "endMinute">;

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const CLASS_BLOCKS = ([
  { day: 0, start: "07:30", end: "11:10", name: "Tư duy tính toán · LT", room: "F.203", category: "class" },
  { day: 0, start: "15:30", end: "17:30", name: "Vi tích phân 2 · TH", category: "class" },
  { day: 1, start: "13:30", end: "15:30", name: "Tư duy tính toán · TH", category: "class" },
  { day: 2, start: "07:30", end: "11:10", name: "Kinh tế đại cương", room: "GD 1", category: "class" },
  { day: 2, start: "09:30", end: "11:30", name: "Toán rời rạc · TH", category: "class" },
  { day: 3, start: "13:30", end: "17:10", name: "Vi tích phân 2 · LT", room: "E.404", category: "class" },
  { day: 4, start: "07:30", end: "11:10", name: "Thể dục 1", category: "class" },
  { day: 4, start: "13:30", end: "17:10", name: "Toán rời rạc · LT", room: "C.24", category: "class" },
  { day: 5, start: "07:30", end: "11:10", name: "Hệ thống máy tính", room: "E.405", category: "class" },
 ] satisfies BlockInput[]).map((block) => ({
  ...block,
  startMinute: toMinutes(block.start),
  endMinute: toMinutes(block.end),
}));

const DAILY_TEMPLATE = ([
  { start: "05:00", end: "05:30", category: "routine", name: "Wake up · wash · breakfast" },
  { start: "05:30", end: "07:30", category: "study", name: "Deep study · learn new topics" },
  { start: "07:30", end: "11:30", category: "study", name: "Study / revise problems" },
  { start: "11:30", end: "13:00", category: "routine", name: "Lunch · rest" },
  { start: "13:00", end: "18:00", category: "flex", name: "Flex · project time" },
  { start: "18:00", end: "18:30", category: "routine", name: "Shower 🚿" },
  { start: "18:30", end: "19:30", category: "routine", name: "Exercise · dinner" },
  { start: "19:30", end: "20:00", category: "study", name: "Revise problems" },
  { start: "20:00", end: "21:00", category: "flex", name: "Flex · project time" },
  { start: "21:00", end: "23:00", category: "game", name: "Gaming 🎮" },
 ] satisfies BlockInput[]).map((block) => ({
  ...block,
  startMinute: toMinutes(block.start),
  endMinute: toMinutes(block.end),
}));

function cutAroundClasses(block: Block, classes: Block[]) {
  let segments = [block];

  for (const classBlock of classes) {
    segments = segments.flatMap((segment) => {
      if (classBlock.endMinute <= segment.startMinute || classBlock.startMinute >= segment.endMinute) {
        return [segment];
      }

      const remaining: Block[] = [];
      if (classBlock.startMinute > segment.startMinute) {
        remaining.push({ ...segment, end: classBlock.start, endMinute: classBlock.startMinute });
      }
      if (classBlock.endMinute < segment.endMinute) {
        remaining.push({ ...segment, start: classBlock.end, startMinute: classBlock.endMinute });
      }
      return remaining;
    });
  }

  return segments.filter((segment) =>
    segment.endMinute - segment.startMinute >= (segment.category === "flex" ? 60 : 30),
  );
}

const WEEK = DAY_NAMES.map((_, day) => {
  const classes = CLASS_BLOCKS
    .filter((block) => block.day === day)
    .map((block, _, dayClasses) => ({
      ...block,
      conflict: dayClasses.some(
        (other) => other !== block && other.startMinute < block.endMinute && other.endMinute > block.startMinute,
      ),
    }));
  const freeBlocks = DAILY_TEMPLATE.flatMap((block) => cutAroundClasses(block, classes));

  return { classes, blocks: [...freeBlocks, ...classes] };
});

function formatTime(minutes: number) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export default function TimetablePage() {
  const pageRef = useRef<HTMLElement>(null);
  const [hiddenCategories, setHiddenCategories] = useState<Set<Category>>(() => new Set());
  const [now, setNow] = useState<Date | null>(null);
  const [pixelsPerMinute, setPixelsPerMinute] = useState(0.35);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => setNow(new Date());
    const updateScheduleScale = () => {
      const page = pageRef.current;
      const header = page?.querySelector<HTMLElement>(`.${styles.header}`);
      const legend = page?.querySelector<HTMLElement>(`.${styles.legend}`);
      const footer = page?.querySelector<HTMLElement>(`.${styles.footer}`);
      const controls = page?.querySelector<HTMLElement>(`.${styles.scheduleControls}`);
      const dayHeading = page?.querySelector<HTMLElement>(`.${styles.dayHeading}`);
      const stage = page?.querySelector<HTMLElement>(`.${styles.scheduleStage}`);
      if (!page || !header || !legend || !footer || !controls || !dayHeading || !stage) return;

      const pageStyle = getComputedStyle(page);
      const legendStyle = getComputedStyle(legend);
      const controlsStyle = getComputedStyle(controls);
      const stageStyle = getComputedStyle(stage);
      let fixedHeight =
        controls.offsetHeight +
        Number.parseFloat(pageStyle.paddingTop) +
        Number.parseFloat(pageStyle.paddingBottom) +
        Number.parseFloat(controlsStyle.marginBottom) +
        dayHeading.offsetHeight +
        20;
      if (!isExpanded) {
        fixedHeight +=
          header.offsetHeight +
          legend.offsetHeight +
          footer.offsetHeight +
          Number.parseFloat(legendStyle.marginTop) +
          Number.parseFloat(legendStyle.marginBottom);
      } else {
        fixedHeight += Number.parseFloat(stageStyle.paddingTop) + Number.parseFloat(stageStyle.paddingBottom);
      }
      const availableHeight = Math.max(0, window.innerHeight - fixedHeight);

      setPixelsPerMinute(Math.max(0.18, Math.min(0.8, availableHeight / SCHEDULE_MINUTES)));
    };

    updateTime();
    updateScheduleScale();
    const interval = window.setInterval(updateTime, 60_000);
    window.addEventListener("resize", updateScheduleScale);
    const observer = new ResizeObserver(updateScheduleScale);
    [
      pageRef.current?.querySelector(`.${styles.header}`),
      pageRef.current?.querySelector(`.${styles.legend}`),
      pageRef.current?.querySelector(`.${styles.footer}`),
      pageRef.current?.querySelector(`.${styles.scheduleControls}`),
      pageRef.current?.querySelector(`.${styles.scheduleStage}`),
      pageRef.current?.querySelector(`.${styles.dayHeading}`),
    ].forEach((element) => {
      if (element) observer.observe(element);
    });
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("resize", updateScheduleScale);
      observer.disconnect();
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isExpanded]);

  const today = now ? (now.getDay() + 6) % 7 : -1;
  const todayBlocks = today >= 0 ? WEEK[today].blocks : [];
  const activeBlock = now
    ? todayBlocks.find((block) => now.getHours() * 60 + now.getMinutes() >= block.startMinute && now.getHours() * 60 + now.getMinutes() < block.endMinute)
    : undefined;
  const nextBlock = now
    ? todayBlocks.find((block) => block.startMinute > now.getHours() * 60 + now.getMinutes())
    : undefined;
  const currentTask = activeBlock
    ? activeBlock.name
    : nextBlock
      ? `Next: ${nextBlock.name}`
      : "No more scheduled tasks";
  const weeklyMinutes = WEEK.flatMap((day) => day.blocks).reduce<Record<Category, number>>(
    (totals, block) => {
      totals[block.category] += block.endMinute - block.startMinute;
      return totals;
    },
    { class: 0, study: 0, flex: 0, routine: 0, game: 0 },
  );

  const toggleCategory = (category: Category) => {
    setHiddenCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <main ref={pageRef} className={`${styles.page} ${isExpanded ? styles.expanded : ""}`}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <p className={styles.eyebrow}>Weekly rhythm</p>
            <BackHomeLink className={styles.homeLink}>
              <span aria-hidden="true">↖</span> Home
            </BackHomeLink>
          </div>
          <div className={styles.headerMain}>
            <h1 className={styles.title}>
              My weekly
              <br />
              <span>TimeTable</span>
            </h1>
            <aside className={styles.statusPanel} aria-label="Current time, date, and task">
              <p className={styles.statusLabel}>Right now</p>
              <p className={styles.statusTime}>
                {now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"}
              </p>
              <p className={styles.statusDate}>
                {now ? now.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" }) : "Loading date"}
              </p>
              <div className={styles.statusTask}>
                <span className={styles.statusDot} aria-hidden="true" />
                <span>{currentTask}</span>
              </div>
            </aside>
          </div>
          <div className={styles.headerFoot}>
            <span>Monday — Sunday</span>
            <span>05:00 — 23:00</span>
          </div>
        </header>

        <div className={styles.legend} aria-label="Filter timetable categories">
          {(Object.entries(CATEGORIES) as [Category, string][]).map(([category, label]) => {
            const isHidden = hiddenCategories.has(category);
            const hours = Math.round(weeklyMinutes[category] / 6) / 10;
            return (
              <button
                key={category}
                type="button"
                className={`${styles.legendChip} ${isHidden ? styles.legendChipOff : ""}`}
                aria-pressed={!isHidden}
                onClick={() => toggleCategory(category)}
              >
                <span className={styles.legendDot} style={{ backgroundColor: `var(--${category})` }} />
                {label} · {hours}h/wk
              </button>
            );
          })}
        </div>

        <div className={styles.scheduleStage}>
          <div className={styles.scheduleControls}>
            <button
              type="button"
              className={styles.expandButton}
              aria-pressed={isExpanded}
              aria-label={isExpanded ? "Exit enlarged timetable" : "Enlarge timetable"}
              onClick={() => setIsExpanded((expanded) => !expanded)}
            >
              <span aria-hidden="true">{isExpanded ? "⤡" : "⤢"}</span>
              {isExpanded ? "Exit enlarged view" : "Enlarge timetable"}
            </button>
          </div>

          <div className={styles.scheduleWrap}>
          <div className={styles.scheduleGrid}>
            <div className={styles.dayHeading} aria-hidden="true" />
            {DAY_NAMES.map((day, index) => (
              <div key={day} className={`${styles.dayHeading} ${index === today ? styles.todayHeading : ""}`}>
                {day}
              </div>
            ))}

            <div
              className={styles.timeAxis}
              aria-label="Time of day"
              style={{ height: SCHEDULE_MINUTES * pixelsPerMinute }}
            >
              {Array.from({ length: 19 }, (_, index) => DAY_START + index * 60).map((minute) => (
                <span
                  key={minute}
                  className={styles.timeLabel}
                  style={{ top: (minute - DAY_START) * pixelsPerMinute }}
                >
                  {formatTime(minute)}
                </span>
              ))}
            </div>

            {WEEK.map((day, dayIndex) => {
              const currentMinutes = now ? now.getHours() * 60 + now.getMinutes() : -1;
              return (
                <div
                  key={DAY_NAMES[dayIndex]}
                  className={`${styles.dayColumn} ${dayIndex === today ? styles.todayColumn : ""}`}
                  style={{ height: SCHEDULE_MINUTES * pixelsPerMinute }}
                  aria-label={`${DAY_NAMES[dayIndex]} schedule`}
                >
                  {Array.from({ length: 18 }, (_, index) => index).map((hour) => (
                    <div
                      key={hour}
                      className={styles.hourRule}
                      style={{ top: hour * 60 * pixelsPerMinute }}
                    />
                  ))}

                  {day.blocks.filter((block) => !hiddenCategories.has(block.category)).map((block) => {
                    const classIndex = day.classes.findIndex(
                      (classBlock) => classBlock.start === block.start && classBlock.name === block.name,
                    );
                    const blockHeight = (block.endMinute - block.startMinute) * pixelsPerMinute - 2;
                    const isCompact = blockHeight < 26;
                    return (
                      <div
                        key={`${block.category}-${block.start}-${block.name}`}
                        className={`${styles.block} ${isCompact ? styles.compactBlock : ""} ${block.conflict ? styles.conflict : ""}`}
                        style={{
                          top: (block.startMinute - DAY_START) * pixelsPerMinute,
                          height: blockHeight,
                          left: block.conflict && block.category === "class" && classIndex > 0 ? "50%" : "3px",
                          width: block.conflict ? "calc(50% - 5px)" : "calc(100% - 6px)",
                          backgroundColor: `var(--${block.category})`,
                        }}
                        title={`${block.name}: ${block.start}–${block.end}${block.room ? ` · ${block.room}` : ""}`}
                      >
                        {block.name}
                        <small>
                          {block.start}–{block.end}{block.room ? ` · ${block.room}` : ""}
                        </small>
                      </div>
                    );
                  })}

                  {dayIndex === today && currentMinutes >= DAY_START && currentMinutes <= DAY_END && (
                    <div
                      className={styles.nowLine}
                      style={{ top: (currentMinutes - DAY_START) * pixelsPerMinute }}
                      aria-label={`Current time ${formatTime(currentMinutes)}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          </div>
        </div>

        <footer className={styles.footer}>
          <span>One week, at a glance.</span>
          <BackHomeLink className={styles.footerLink}>Back home ↑</BackHomeLink>
        </footer>
      </div>
    </main>
  );
}