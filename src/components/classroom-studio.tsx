"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  BookOpenCheck,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Copy,
  Flame,
  Hand,
  Info,
  Lightbulb,
  LoaderCircle,
  MoonStar,
  PencilLine,
  Play,
  RotateCcw,
  Sparkles,
  Split,
  WandSparkles,
} from "lucide-react";
import {
  applyMove,
  buildTeachTomorrowPack,
  fixtureLesson,
  fixtureSignals,
  makeCustomMove,
  metricDelta,
  metricLabel,
  startingMetrics,
  suggestedMoves,
  type CoachDraft,
  type Lesson,
  type MetricKey,
  type Metrics,
  type RehearsalEvent,
  type Signal,
  type Support,
  type TeachingMove,
} from "@/lib/rehearsal";

type Stage = "home" | "lesson" | "signals" | "rehearsal" | "compare" | "pack";
type Route = "primary" | "branch";

type StoredStudio = {
  stage?: Stage;
  lesson?: Lesson;
  selectedSignalIds?: string[];
  customSignals?: Signal[];
  primaryEvent?: RehearsalEvent | null;
  branchEvent?: RehearsalEvent | null;
  preferredRoute?: Route;
  reflection?: string;
  coachDraft?: CoachDraft | null;
};

const STORAGE_KEY = "classroom-after-dark/studio-v1";
const stageOrder: Stage[] = ["home", "lesson", "signals", "rehearsal", "compare", "pack"];
const stageLabels: Record<Stage, string> = {
  home: "Welcome",
  lesson: "Lesson desk",
  signals: "Signal deck",
  rehearsal: "Rehearsal",
  compare: "Compare",
  pack: "Teach tomorrow",
};

const metricMeta: Array<{ key: MetricKey; eyebrow: string; label: string; className: string }> = [
  { key: "objectiveEvidence", eyebrow: "Can we see it?", label: "Objective evidence", className: "amber" },
  { key: "participationAccess", eyebrow: "Who gets in?", label: "Participation access", className: "pink" },
  { key: "representationAccess", eyebrow: "Can it be seen?", label: "Representation access", className: "blue" },
  { key: "languageAccess", eyebrow: "Can it be said?", label: "Language access", className: "lime" },
];

const supportLabels: Record<Support, string> = {
  representation: "Make it visible",
  language: "Make the language usable",
  "response-route": "Create a response route",
  "reasoning-check": "Ask for proof",
  extension: "Stretch the secure idea",
};

const unsafeSignalPattern = /\b(adhd|autism|autistic|dyslexia|diagnos(?:is|ed|tic)?|iep|504 plan)\b|\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b|\b(?:\+?\d[\d\s().-]{7,}\d)\b/i;

function stageIndex(stage: Stage) {
  return stageOrder.indexOf(stage);
}

function initials(title: string) {
  return title
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function MetricMeter({ metrics, highlight }: { metrics: Metrics; highlight?: Metrics }) {
  return (
    <div className="metric-grid" aria-label="Rehearsal state">
      {metricMeta.map((metric) => {
        const delta = highlight ? metricDelta(metrics, highlight, metric.key) : 0;
        return (
          <article className={`metric-card metric-card--${metric.className}`} key={metric.key}>
            <span>{metric.eyebrow}</span>
            <strong>{metric.label}</strong>
            <div className="metric-card__measure">
              <div className="meter" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((tick) => (
                  <i className={tick < metrics[metric.key] ? "meter__tick meter__tick--on" : "meter__tick"} key={tick} />
                ))}
              </div>
              <b>{metricLabel(metrics[metric.key])}</b>
            </div>
            {highlight ? (
              <small className={delta > 0 ? "metric-card__delta metric-card__delta--positive" : "metric-card__delta"}>
                {delta > 0 ? `+${delta} after this move` : delta < 0 ? `${delta} after this move` : "No change from this move"}
              </small>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function FractionStrips({ illuminated = false }: { illuminated?: boolean }) {
  return (
    <div className={`fraction-strips${illuminated ? " fraction-strips--lit" : ""}`} aria-label="A visual comparison of one third and one eighth">
      <div className="fraction-strip">
        <span>one third</span>
        <div className="fraction-strip__bar fraction-strip__bar--thirds">
          <i />
          <i />
          <i />
        </div>
      </div>
      <div className="fraction-strip">
        <span>one eighth</span>
        <div className="fraction-strip__bar fraction-strip__bar--eighths">
          {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
        </div>
      </div>
      <div className="fraction-strips__note">same whole · different number of equal parts</div>
    </div>
  );
}

function SignalCard({ signal, selected, onClick, compact = false }: { signal: Signal; selected: boolean; onClick?: () => void; compact?: boolean }) {
  const card = (
    <>
      <div className="signal-card__cap">
        <span className={`signal-card__dot signal-card__dot--${signal.accent}`} />
        <small>{signal.kicker}</small>
        {selected ? <Check size={14} aria-label="Selected" /> : null}
      </div>
      <div className="signal-card__body">
        <span className="signal-card__initials">{initials(signal.title)}</span>
        <div>
          <h3>{signal.title}</h3>
          <p>{compact ? signal.cue : signal.description}</p>
        </div>
      </div>
      {!compact ? <blockquote>{signal.cue}</blockquote> : null}
    </>
  );

  if (!onClick) return <article className={`signal-card signal-card--${signal.accent} signal-card--selected`}>{card}</article>;
  return (
    <button className={`signal-card signal-card--${signal.accent}${selected ? " signal-card--selected" : ""}`} type="button" onClick={onClick} aria-pressed={selected}>
      {card}
    </button>
  );
}

function MoveCard({ move, onChoose, chosen }: { move: TeachingMove; onChoose: (move: TeachingMove) => void; chosen?: boolean }) {
  return (
    <button className={`move-card move-card--${move.tone}${chosen ? " move-card--chosen" : ""}`} type="button" onClick={() => onChoose(move)}>
      <span className="move-card__number">0{suggestedMoves.findIndex((candidate) => candidate.id === move.id) + 1 || "*"}</span>
      <span className="move-card__copy">
        <strong>{move.title}</strong>
        <small>{move.description}</small>
      </span>
      <span className="move-card__time"><Clock3 size={13} /> {move.timeCost} min</span>
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  );
}

export function ClassroomStudio() {
  const [stage, setStage] = useState<Stage>("home");
  const [lesson, setLesson] = useState<Lesson>(fixtureLesson);
  const [selectedSignalIds, setSelectedSignalIds] = useState<string[]>(fixtureSignals.slice(0, 4).map((signal) => signal.id));
  const [customSignals, setCustomSignals] = useState<Signal[]>([]);
  const [primaryEvent, setPrimaryEvent] = useState<RehearsalEvent | null>(null);
  const [branchEvent, setBranchEvent] = useState<RehearsalEvent | null>(null);
  const [branchMode, setBranchMode] = useState(false);
  const [preferredRoute, setPreferredRoute] = useState<Route>("branch");
  const [reflection, setReflection] = useState("");
  const [customMoveText, setCustomMoveText] = useState("");
  const [customSupports, setCustomSupports] = useState<Support[]>(["representation", "response-route"]);
  const [customSignalTitle, setCustomSignalTitle] = useState("");
  const [customSignalDescription, setCustomSignalDescription] = useState("");
  const [signalError, setSignalError] = useState("");
  const [toast, setToast] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [coachDraft, setCoachDraft] = useState<CoachDraft | null>(null);
  const [coachStatus, setCoachStatus] = useState<"idle" | "loading" | "error">("idle");

  const allSignals = useMemo(() => [...fixtureSignals, ...customSignals], [customSignals]);
  const selectedSignals = useMemo(() => allSignals.filter((signal) => selectedSignalIds.includes(signal.id)), [allSignals, selectedSignalIds]);
  const chosenEvent = preferredRoute === "branch" ? branchEvent ?? primaryEvent : primaryEvent ?? branchEvent;
  const visibleEvent = branchMode ? branchEvent : primaryEvent;

  useEffect(() => {
    const hydrateTimer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredStudio;
          if (parsed.stage && stageOrder.includes(parsed.stage)) setStage(parsed.stage);
          if (parsed.lesson) setLesson({ ...fixtureLesson, ...parsed.lesson });
          if (parsed.selectedSignalIds?.length) setSelectedSignalIds(parsed.selectedSignalIds);
          if (parsed.customSignals) setCustomSignals(parsed.customSignals);
          if (parsed.primaryEvent) setPrimaryEvent(parsed.primaryEvent);
          if (parsed.branchEvent) setBranchEvent(parsed.branchEvent);
          if (parsed.preferredRoute) setPreferredRoute(parsed.preferredRoute);
          if (typeof parsed.reflection === "string") setReflection(parsed.reflection);
          if (parsed.coachDraft) setCoachDraft(parsed.coachDraft);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrateTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: StoredStudio = { stage, lesson, selectedSignalIds, customSignals, primaryEvent, branchEvent, preferredRoute, reflection, coachDraft };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [branchEvent, coachDraft, customSignals, hydrated, lesson, preferredRoute, primaryEvent, reflection, selectedSignalIds, stage]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function transitionTo(nextStage: Stage) {
    setStage(nextStage);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }

  function startFixture() {
    transitionTo("lesson");
    setToast("The fractions rehearsal is ready. Make the lesson yours before you begin.");
  }

  function resetStudio() {
    window.localStorage.removeItem(STORAGE_KEY);
    transitionTo("home");
    setLesson(fixtureLesson);
    setSelectedSignalIds(fixtureSignals.slice(0, 4).map((signal) => signal.id));
    setCustomSignals([]);
    setPrimaryEvent(null);
    setBranchEvent(null);
    setBranchMode(false);
    setPreferredRoute("branch");
    setReflection("");
    setCoachDraft(null);
    setToast("A fresh rehearsal room is ready.");
  }

  function goTo(nextStage: Stage) {
    if (nextStage === "signals" && !lesson.objective.trim()) {
      setToast("Name the learning objective before opening the signal deck.");
      return;
    }
    if (nextStage === "rehearsal" && selectedSignalIds.length < 3) {
      setToast("Choose at least three fictional learning signals for a useful rehearsal.");
      return;
    }
    if (nextStage === "compare" && !branchEvent) {
      setToast("Replay the moment with a second move first.");
      return;
    }
    if (nextStage === "pack" && !chosenEvent) {
      setToast("Choose a teaching move before creating a pack.");
      return;
    }
    transitionTo(nextStage);
  }

  function toggleSignal(id: string) {
    setSelectedSignalIds((current) => (current.includes(id) ? current.filter((signalId) => signalId !== id) : [...current, id]));
  }

  function addCustomSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = customSignalTitle.trim();
    const description = customSignalDescription.trim();
    if (!title || !description) {
      setSignalError("Give the rehearsal condition a short title and a teaching-relevant description.");
      return;
    }
    if (unsafeSignalPattern.test(`${title} ${description}`)) {
      setSignalError("Keep this fictional and teaching-relevant: no student names, contacts, diagnostic labels, or support-plan language.");
      return;
    }
    const newSignal: Signal = {
      id: `custom-${Date.now()}`,
      title,
      kicker: "teacher-authored signal",
      description,
      cue: "A rehearsal condition you can test before class.",
      accent: "violet",
    };
    setCustomSignals((current) => [...current, newSignal]);
    setSelectedSignalIds((current) => [...current, newSignal.id]);
    setCustomSignalTitle("");
    setCustomSignalDescription("");
    setSignalError("");
  }

  function chooseMove(move: TeachingMove) {
    const event = applyMove(startingMetrics, move);
    if (branchMode) {
      setBranchEvent(event);
      setPreferredRoute("branch");
      setBranchMode(false);
      transitionTo("compare");
      setToast("Branch B is preserved. Now compare the trade-offs.");
      return;
    }
    setPrimaryEvent(event);
    setToast("The first route is saved. The rule trace below explains what changed.");
  }

  function startBranch() {
    setBranchMode(true);
    setToast("Branch B starts from the same moment. Try a genuinely different move.");
    window.setTimeout(() => document.getElementById("move-menu")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }

  function chooseCustomMove() {
    chooseMove(makeCustomMove(customMoveText, customSupports));
    setCustomMoveText("");
  }

  function toggleSupport(support: Support) {
    setCustomSupports((current) => (current.includes(support) ? current.filter((item) => item !== support) : [...current, support]));
  }

  async function askNarrativeCoach() {
    setCoachStatus("loading");
    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lesson: { title: lesson.title, objective: lesson.objective, phase: lesson.phase },
          signals: selectedSignals.map(({ id, title, description, cue }) => ({ id, title, description, cue })),
          currentMove: primaryEvent?.move.title ?? "No move chosen yet",
        }),
      });
      const body = (await response.json()) as CoachDraft & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "The Narrative Coach could not respond.");
      setCoachDraft(body);
      setToast("Narrative Coach draft added. It is yours to edit or ignore.");
      setCoachStatus("idle");
    } catch (error) {
      setCoachStatus("error");
      setToast(error instanceof Error ? error.message : "The Narrative Coach is unavailable. The rehearsal still works locally.");
    }
  }

  const teachTomorrowPack = useMemo(() => {
    if (!chosenEvent) return "";
    return buildTeachTomorrowPack({ lesson, selectedSignals, preferredEvent: chosenEvent, reflection });
  }, [chosenEvent, lesson, reflection, selectedSignals]);

  async function copyPack() {
    await navigator.clipboard.writeText(teachTomorrowPack);
    setToast("Teach Tomorrow pack copied to your clipboard.");
  }

  function downloadPack() {
    const blob = new Blob([teachTomorrowPack], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = href;
    anchor.download = "teach-tomorrow-fractions-rehearsal.md";
    anchor.click();
    URL.revokeObjectURL(href);
    setToast("Markdown pack downloaded.");
  }

  const activeMetrics = visibleEvent?.after ?? startingMetrics;

  return (
    <main className="studio-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => transitionTo("home")} aria-label="Return to Classroom After Dark home">
          <span className="brand__mark"><MoonStar size={20} /></span>
          <span>
            <b>Classroom<br />After Dark</b>
            <small>Private lesson rehearsal</small>
          </span>
        </button>
        <div className="topbar__right">
          <span className="privacy-note"><span /> Fictional signals only</span>
          <button className="quiet-button" type="button" onClick={resetStudio}><RotateCcw size={15} /> Fresh room</button>
        </div>
      </header>

      {stage !== "home" ? (
        <nav className="progress-rail" aria-label="Lesson rehearsal progress">
          {stageOrder.slice(1).map((item, index) => {
            const current = stageIndex(stage);
            const itemIndex = stageIndex(item);
            const allowed = itemIndex <= current || (item === "signals" && stage === "lesson");
            return (
              <button key={item} type="button" className={`progress-step${item === stage ? " progress-step--active" : ""}${itemIndex < current ? " progress-step--done" : ""}`} onClick={() => allowed && goTo(item)} disabled={!allowed}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{stageLabels[item]}</b>
                {itemIndex < current ? <Check size={13} /> : <i />}
              </button>
            );
          })}
        </nav>
      ) : null}

      {toast ? <div className="toast" role="status"><Info size={16} /> {toast}</div> : null}

      {stage === "home" ? (
        <section className="home-stage">
          <div className="home-stage__halo" aria-hidden="true" />
          <div className="home-stage__copy">
            <p className="eyebrow"><Flame size={13} /> Tomorrow is still editable</p>
            <h1>Rehearse the moment<br /><em>before it reaches</em><br />the classroom.</h1>
            <p className="home-stage__lede">A private studio for trying a teaching move, seeing its trade-off, and carrying a stronger plan into tomorrow.</p>
            <div className="home-stage__actions">
              <button className="button button--light button--large" type="button" onClick={startFixture}><Play size={17} fill="currentColor" /> Rehearse the fractions lesson</button>
              <button className="text-button" type="button" onClick={() => transitionTo("lesson")}>Start with a blank lesson <ArrowRight size={16} /></button>
            </div>
            <p className="home-stage__footnote"><Hand size={15} /> No student data. No prediction. Only editable, fictional rehearsal conditions.</p>
          </div>
          <div className="night-tableau" aria-label="Preview of a fractions lesson rehearsal">
            <div className="night-tableau__moon" />
            <div className="night-tableau__paper">
              <span className="night-tableau__pin">guided practice</span>
              <h2>Which is larger?</h2>
              <FractionStrips illuminated />
              <div className="night-tableau__quote">“One eighth, because 8 is bigger.”</div>
              <div className="night-tableau__pulse"><span /> rehearsal signal surfaced</div>
            </div>
            <div className="night-tableau__tape">TRY AGAIN<br />FROM HERE ↗</div>
          </div>
          <div className="home-stage__provenance">
            <span>NOT A TUTOR</span><span>NOT A PROFILE</span><span>A TEACHER&apos;S REHEARSAL ROOM</span>
          </div>
        </section>
      ) : null}

      {stage === "lesson" ? (
        <section className="page-grid lesson-page">
          <div className="page-heading">
            <p className="eyebrow"><BookOpenCheck size={14} /> First, make the lesson legible</p>
            <h1>Put tomorrow&apos;s lesson<br />on the desk.</h1>
            <p>Start with the exact moment worth rehearsing. Everything remains teacher-editable.</p>
          </div>
          <aside className="side-note">
            <span>01</span>
            <p>We use the lesson as a rehearsal script—not as a source of claims about real learners.</p>
          </aside>
          <div className="lesson-sheet">
            <div className="lesson-sheet__header"><span>lesson card</span><span>private draft</span></div>
            <label className="field field--wide">Lesson title<input value={lesson.title} onChange={(event) => setLesson({ ...lesson, title: event.target.value })} /></label>
            <div className="field-row">
              <label className="field">Grade / subject<input value={lesson.grade} onChange={(event) => setLesson({ ...lesson, grade: event.target.value })} /></label>
              <label className="field">Total minutes<input type="number" min="5" max="180" value={lesson.duration} onChange={(event) => setLesson({ ...lesson, duration: Number(event.target.value) || 0 })} /></label>
            </div>
            <label className="field field--objective">Learning objective<textarea value={lesson.objective} onChange={(event) => setLesson({ ...lesson, objective: event.target.value })} /></label>
            <div className="lesson-sheet__rule" />
            <div className="lesson-sheet__phase">
              <div><small>Pivotal moment</small><strong>{lesson.phase}</strong></div>
              <span>10 min is protected for the rehearsal</span>
            </div>
            <div className="lesson-sheet__materials"><small>Already on your desk</small>{lesson.materials.map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <div className="page-actions">
            <button className="button button--ink" type="button" onClick={() => goTo("signals")}>Open the signal deck <ArrowRight size={17} /></button>
            <p><Check size={14} /> Lesson facts stay in this browser unless you choose to export.</p>
          </div>
        </section>
      ) : null}

      {stage === "signals" ? (
        <section className="signal-page">
          <header className="signal-page__header">
            <div>
              <p className="eyebrow"><Sparkles size={14} /> Build a fictional signal deck</p>
              <h1>Rehearse conditions,<br /><em>not children.</em></h1>
            </div>
            <div className="selection-counter"><strong>{selectedSignalIds.length}</strong><span>signals<br />selected</span></div>
          </header>
          <div className="fiction-banner"><Info size={17} /><span><b>Fictional rehearsal boundary.</b> These are editable teaching conditions—never student names, records, diagnoses, or predictions.</span></div>
          <div className="signal-grid">
            {allSignals.map((signal) => <SignalCard key={signal.id} signal={signal} selected={selectedSignalIds.includes(signal.id)} onClick={() => toggleSignal(signal.id)} />)}
          </div>
          <form className="custom-signal" onSubmit={addCustomSignal}>
            <div className="custom-signal__number">+</div>
            <div className="custom-signal__title"><small>Need a different rehearsal condition?</small><strong>Author one safely</strong></div>
            <label><span>Short label</span><input value={customSignalTitle} onChange={(event) => setCustomSignalTitle(event.target.value)} placeholder="e.g. Context gets in the way" /></label>
            <label><span>Teaching-relevant description</span><input value={customSignalDescription} onChange={(event) => setCustomSignalDescription(event.target.value)} placeholder="Needs the context unpacked before the concept is visible." /></label>
            <button className="button button--outline" type="submit">Add signal</button>
            {signalError ? <p className="custom-signal__error">{signalError}</p> : null}
          </form>
          <div className="page-actions page-actions--signal">
            <button className="button button--ink" type="button" onClick={() => goTo("rehearsal")}>Dim the room. Start rehearsal <MoonStar size={17} /></button>
            <p><Check size={14} /> Pick 3–5 conditions. You can return and edit them later.</p>
          </div>
        </section>
      ) : null}

      {stage === "rehearsal" ? (
        <section className="rehearsal-page">
          <header className="rehearsal-topline">
            <div>
              <p className="eyebrow"><MoonStar size={14} /> {branchMode ? "Branch B · same moment, another move" : lesson.phase}</p>
              <h1>{branchMode ? "Replay this moment." : "The room goes quiet."}</h1>
            </div>
            <div className="clock-card"><Clock3 size={18} /><span><b>{activeMetrics.minutesRemaining}</b> minutes<br />still in hand</span></div>
          </header>

          <div className="rehearsal-layout">
            <aside className="signal-rail">
              <div className="signal-rail__heading"><span>Signals in the room</span><small>fictional</small></div>
              {selectedSignals.slice(0, 4).map((signal) => <SignalCard signal={signal} selected key={signal.id} compact />)}
            </aside>

            <div className="moment-stage">
              <div className="moment-stage__paperclip">GUIDED PRACTICE · REHEARSAL ONLY</div>
              <div className="moment-stage__question"><span>Prompt on the board</span><h2>Which fraction is larger:<br /><em>one third</em> or <em>one eighth</em>?</h2></div>
              <FractionStrips illuminated={Boolean(visibleEvent?.move.supports.includes("representation"))} />
              <div className="moment-stage__voice">
                <span className="voice-dot" />
                <p>{visibleEvent?.evidence ?? fixtureSignals[0].cue}</p>
                <small>{visibleEvent ? "rehearsal evidence after your move" : "first fictional evidence signal"}</small>
              </div>
              {coachDraft ? <div className="coach-whisper"><WandSparkles size={16} /><span><b>GPT-5.6 draft</b>{coachDraft.evidence}</span></div> : null}
            </div>

            <aside className="decision-rail" id="move-menu">
              <div className="decision-rail__heading"><span>{branchMode ? "Choose the branch move" : visibleEvent ? "What else could you try?" : "Your next teaching move"}</span><small>teacher decides</small></div>
              {suggestedMoves.map((move) => <MoveCard key={move.id} move={move} onChoose={chooseMove} chosen={visibleEvent?.move.id === move.id} />)}
              <div className="teacher-move">
                <div><PencilLine size={15} /><b>Write your own move</b></div>
                <textarea value={customMoveText} onChange={(event) => setCustomMoveText(event.target.value)} placeholder="What would you actually say or do?" />
                <div className="support-chips">
                  {(Object.keys(supportLabels) as Support[]).map((support) => <button key={support} type="button" className={customSupports.includes(support) ? "support-chip support-chip--active" : "support-chip"} onClick={() => toggleSupport(support)}>{supportLabels[support]}</button>)}
                </div>
                <button className="text-button text-button--small" type="button" onClick={chooseCustomMove}>Try this move <ArrowRight size={14} /></button>
              </div>
            </aside>
          </div>

          <MetricMeter metrics={visibleEvent?.before ?? startingMetrics} highlight={visibleEvent?.after} />

          {visibleEvent ? (
            <div className="consequence-panel">
              <div className="consequence-panel__intro"><span>Why the rehearsal shifted</span><p>{visibleEvent.move.teacherWords}</p></div>
              <div className="rule-traces">{visibleEvent.traces.map((trace) => <article key={trace.id}><small>{trace.id.replaceAll("-", " · ")}</small><h3>{trace.title}</h3><p>{trace.explanation}</p></article>)}</div>
              <div className="consequence-panel__actions">
                {!branchEvent && !branchMode ? <button className="button button--light" type="button" onClick={startBranch}><Split size={17} /> Branch from this moment</button> : null}
                {branchEvent ? <button className="button button--light" type="button" onClick={() => goTo("compare")}>Compare both routes <ArrowRight size={17} /></button> : null}
                <button className="quiet-button quiet-button--coach" type="button" onClick={askNarrativeCoach} disabled={coachStatus === "loading"}>{coachStatus === "loading" ? <LoaderCircle className="spin" size={15} /> : <WandSparkles size={15} />}{coachStatus === "loading" ? "Drafting…" : "Ask Narrative Coach"}</button>
              </div>
            </div>
          ) : null}
          {coachStatus === "error" ? <p className="coach-error">Narrative Coach is optional. Configure `OPENAI_API_KEY` to use it; the deterministic rehearsal remains complete without a key.</p> : null}
        </section>
      ) : null}

      {stage === "compare" && primaryEvent && branchEvent ? (
        <section className="compare-page">
          <header className="compare-page__heading">
            <div><p className="eyebrow"><Split size={14} /> Same room. Two choices.</p><h1>Keep the move that<br /><em>serves tomorrow.</em></h1></div>
            <p>There is no universal winner. Choose the route that creates the evidence and access you need for this lesson.</p>
          </header>
          <div className="compare-tape"><span>10:00</span><i /><span>same pivotal moment</span><i /><span>two possible teaching moves</span></div>
          <div className="route-grid">
            {(["primary", "branch"] as Route[]).map((route) => {
              const event = route === "primary" ? primaryEvent : branchEvent;
              const preferred = preferredRoute === route;
              return (
                <article className={`route-card route-card--${route}${preferred ? " route-card--preferred" : ""}`} key={route}>
                  <div className="route-card__top"><span>ROUTE {route === "primary" ? "A" : "B"}</span>{preferred ? <b><Check size={14} /> selected</b> : null}</div>
                  <h2>{event.move.title}</h2>
                  <p className="route-card__words">“{event.move.teacherWords}”</p>
                  <div className="route-card__metrics">{metricMeta.map((metric) => <div key={metric.key}><span>{metric.label}</span><b>{metricLabel(event.after[metric.key])}</b><i style={{ "--route-score": event.after[metric.key] } as CSSProperties} /></div>)}</div>
                  <div className="route-card__proof"><small>What becomes possible</small><p>{event.evidence}</p></div>
                  <div className="route-card__tradeoff"><Clock3 size={15} /> Costs {event.move.timeCost} minutes · {event.after.minutesRemaining} remain</div>
                  <button className={preferred ? "button button--selected" : "button button--outline"} type="button" onClick={() => setPreferredRoute(route)}>{preferred ? "This is the route to keep" : "Choose this route"}</button>
                </article>
              );
            })}
          </div>
          <div className="compare-insight"><Lightbulb size={20} /><p><b>The meaningful difference:</b> Route B makes the part-whole relationship visible and adds a private response route before public talk. It costs two more minutes than Route A, but produces stronger evidence for the objective.</p></div>
          <div className="page-actions page-actions--compare"><button className="button button--ink" type="button" onClick={() => goTo("pack")}><ClipboardCheck size={17} /> Commit this into tomorrow&apos;s plan</button><p>Your comparison is saved in this browser.</p></div>
        </section>
      ) : null}

      {stage === "pack" && chosenEvent ? (
        <section className="pack-page">
          <header className="pack-page__heading"><div><p className="eyebrow"><ClipboardCheck size={14} /> The rehearsal leaves the room with you</p><h1>Your <em>Teach Tomorrow</em> pack.</h1></div><p>A practical plan, made from the move and supports you chose—not a generic generated lesson.</p></header>
          <div className="pack-layout">
            <section className="pack-preview">
              <div className="pack-preview__seal"><MoonStar size={18} /><span>Classroom<br />After Dark</span></div>
              <p className="pack-preview__meta">{lesson.grade} · {lesson.duration} minutes</p>
              <h2>{lesson.title}</h2>
              <div className="pack-section"><span>Learning objective</span><p>{lesson.objective}</p></div>
              <div className="pack-section pack-section--highlight"><span>Keep this teaching move</span><h3>{chosenEvent.move.title}</h3><p>{chosenEvent.move.teacherWords}</p></div>
              <div className="pack-section"><span>Set out before class</span><div className="tag-list">{lesson.materials.map((item) => <b key={item}>{item}</b>)}</div></div>
              <div className="pack-section"><span>Exit check</span><p>“Which is larger: one third or one eighth? Show a model that proves it.”</p></div>
              <div className="pack-preview__footer">FICTIONAL REHEARSAL · TEACHER DECIDES · {new Date().getFullYear()}</div>
            </section>
            <section className="pack-editor">
              <div className="pack-editor__head"><div><small>Make it yours</small><h2>One last reflection</h2></div><span>saved locally</span></div>
              <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="Why is this the route you want to carry into the room? What will you watch for?" />
              {coachDraft ? <div className="coach-draft"><WandSparkles size={17} /><div><small>Optional GPT-5.6 language draft</small><b>{coachDraft.moveTitle}</b><p>{coachDraft.teacherWords}</p><em>{coachDraft.tradeoff}</em></div></div> : null}
              <div className="pack-editor__actions"><button className="button button--light" type="button" onClick={downloadPack}><ArrowDownToLine size={17} /> Download Markdown</button><button className="button button--outline" type="button" onClick={copyPack}><Copy size={17} /> Copy pack</button></div>
              <details><summary>Preview exported text</summary><pre>{teachTomorrowPack}</pre></details>
            </section>
          </div>
          <div className="pack-epilogue"><span>Tomorrow, the room is real.</span><p>Tonight, the choice was yours to rehearse.</p><button type="button" onClick={resetStudio}>Begin another lesson <ArrowRight size={15} /></button></div>
        </section>
      ) : null}
    </main>
  );
}
