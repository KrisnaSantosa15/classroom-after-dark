"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  LoaderCircle,
  MoonStar,
  RefreshCcw,
  Send,
  Sparkles,
} from "lucide-react";
import { buildActionCard, createLocalCouncil, type Council, type LensId } from "@/lib/council";

type CouncilSource = "local" | "model";

type StoredCouncil = {
  topic?: string;
  council?: Council;
  source?: CouncilSource;
  debateOpen?: boolean;
};

const STORAGE_KEY = "classroom-after-dark/teaching-council-v1";
const exampleTopic = "My Grade 8 discussion stalls after the first confident answer. How can I make the next 30 minutes more thoughtful and inclusive?";

const lensOrder: LensId[] = ["evidence", "access", "momentum"];

function sourceLabel(source: CouncilSource) {
  return source === "model" ? "GPT-5.6 teaching lenses" : "Local planning lenses";
}

export function ClassroomStudio() {
  const [topic, setTopic] = useState("");
  const [council, setCouncil] = useState<Council | null>(null);
  const [source, setSource] = useState<CouncilSource>("local");
  const [debateOpen, setDebateOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "convening">("idle");
  const [inputError, setInputError] = useState("");
  const [notice, setNotice] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as StoredCouncil;
          if (typeof parsed.topic === "string") setTopic(parsed.topic);
          if (parsed.council) setCouncil(parsed.council);
          if (parsed.source === "local" || parsed.source === "model") setSource(parsed.source);
          if (typeof parsed.debateOpen === "boolean") setDebateOpen(parsed.debateOpen);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);
    return () => window.clearTimeout(hydrate);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: StoredCouncil = { topic, council: council ?? undefined, source, debateOpen };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [council, debateOpen, hydrated, source, topic]);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(""), 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);

  const orderedLenses = useMemo(() => {
    if (!council) return [];
    return lensOrder.map((id) => council.lenses.find((lens) => lens.id === id)).filter((lens): lens is NonNullable<typeof lens> => Boolean(lens));
  }, [council]);

  function loadExample() {
    setTopic(exampleTopic);
    setInputError("");
    setNotice("A live example is ready. Convene the room when you are.");
  }

  function startFresh() {
    window.localStorage.removeItem(STORAGE_KEY);
    setTopic("");
    setCouncil(null);
    setSource("local");
    setDebateOpen(false);
    setInputError("");
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function convene(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTopic = topic.replace(/\s+/g, " ").trim();
    if (cleanTopic.length < 12) {
      setInputError("Give the room a little context—one honest sentence is enough.");
      return;
    }

    setStatus("convening");
    setInputError("");
    setDebateOpen(false);

    try {
      const response = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: cleanTopic }),
      });
      const body = await response.json() as Council & { source?: CouncilSource; error?: string };

      if (response.ok) {
        setCouncil(body);
        setSource(body.source === "local" ? "local" : "model");
        setNotice(body.source === "local" ? "The room is ready." : "The council is in session.");
      } else if (response.status >= 500) {
        setCouncil(createLocalCouncil(cleanTopic));
        setSource("local");
        setNotice("Local planning lenses are ready. Add a model key later for a tailored council.");
      } else {
        setInputError(body.error ?? "The topic needs a little adjustment before it can enter the room.");
      }
    } catch {
      setCouncil(createLocalCouncil(cleanTopic));
      setSource("local");
      setNotice("Local planning lenses are ready while the model service is unavailable.");
    } finally {
      setStatus("idle");
    }
  }

  async function copyRecommendation() {
    if (!council) return;
    try {
      await navigator.clipboard.writeText(buildActionCard(council));
      setNotice("Tomorrow’s first move is copied.");
    } catch {
      setNotice("Copy is unavailable in this browser. Select the plan and copy it manually.");
    }
  }

  if (council) {
    return (
      <main className="council-app">
        <header className="council-topbar">
          <button className="brand" type="button" onClick={startFresh} aria-label="Start a new teaching council">
            <span className="brand__mark"><MoonStar size={18} /></span>
            <span><b>Classroom<br />After Dark</b><small>Teaching council</small></span>
          </button>
          <button className="topbar-action" type="button" onClick={startFresh}><RefreshCcw size={14} /> New topic</button>
        </header>

        {notice ? <div className="notice" role="status"><Check size={15} /> {notice}</div> : null}

        <section className="room-heading">
          <div className="room-heading__meta">
            <span className="room-status"><i /> In session</span>
            <span>{sourceLabel(source)}</span>
          </div>
          <p className="eyebrow">The question in the room</p>
          <h1>{council.roomQuestion}</h1>
          <p className="topic-chip"><span>Teacher topic</span> {council.topicTitle}</p>
        </section>

        <section className="lens-grid" aria-label="Teaching Council perspectives">
          {orderedLenses.map((lens, index) => (
            <article className={`lens-card lens-card--${lens.id}`} key={lens.id}>
              <div className="lens-card__top"><span>0{index + 1}</span><b>{lens.label}</b></div>
              <h2>{lens.question}</h2>
              <p>{lens.perspective}</p>
              <div className="lens-card__move"><small>Try</small><strong>{lens.move}</strong></div>
            </article>
          ))}
        </section>

        <section className="recommendation" aria-labelledby="tomorrow-title">
          <div className="recommendation__stamp"><Sparkles size={17} /><span>One move to test</span></div>
          <div className="recommendation__intro">
            <div>
              <p className="eyebrow">Start here tomorrow · {council.recommendation.minutes} minutes</p>
              <h2 id="tomorrow-title">{council.recommendation.title}</h2>
            </div>
            <button className="copy-button" type="button" onClick={copyRecommendation}><Copy size={15} /> Copy plan</button>
          </div>
          <p className="recommendation__action">{council.recommendation.action}</p>
          <div className="recommendation__details">
            <p><small>Say</small>“{council.recommendation.teacherWords}”</p>
            <p><small>Notice</small>{council.recommendation.evidenceToNotice}</p>
          </div>
        </section>

        <section className={`debate ${debateOpen ? "debate--open" : ""}`} aria-labelledby="debate-title">
          <div className="debate__heading">
            <div>
              <p className="eyebrow">The productive disagreement</p>
              <h2 id="debate-title">A good plan has one useful tension.</h2>
            </div>
            {!debateOpen ? <button className="debate-button" type="button" onClick={() => setDebateOpen(true)}>Let the lenses challenge each other <ChevronRight size={17} /></button> : null}
          </div>
          {debateOpen ? (
            <div className="exchange-list">
              {council.debate.map((exchange, index) => (
                <article className="exchange" key={`${exchange.from}-${exchange.to}-${index}`}>
                  <span><b>{exchange.from}</b><ArrowRight size={13} /><b>{exchange.to}</b></span>
                  <p>{exchange.point}</p>
                </article>
              ))}
            </div>
          ) : <p className="debate__hint">Open this only if you want to stress-test the recommendation. Your first move is already ready above.</p>}
        </section>

        <footer className="room-footer">No learner profiles. No invented classroom facts. Just a topic, three lenses, and an editable next move.</footer>
      </main>
    );
  }

  return (
    <main className="council-app">
      <header className="council-topbar">
        <div className="brand" aria-label="Classroom After Dark">
          <span className="brand__mark"><MoonStar size={18} /></span>
          <span><b>Classroom<br />After Dark</b><small>Teaching council</small></span>
        </div>
        <span className="topbar-note">Private by design</span>
      </header>

      {notice ? <div className="notice" role="status"><Check size={15} /> {notice}</div> : null}

      <section className="opening">
        <div className="opening__copy">
          <p className="eyebrow"><span className="live-dot" /> One topic · three lenses · one next move</p>
          <h1>Bring the knot in tomorrow&apos;s class <em>into the room.</em></h1>
          <p className="opening__lede">Give the council the teaching moment you cannot quite solve. It will bring back three perspectives, a productive disagreement, and one grounded move to try.</p>
        </div>

        <aside className="council-preview" aria-label="The Teaching Council lenses">
          <p>Tonight&apos;s room has three seats.</p>
          <div><b>Evidence</b><span>Make the thinking visible.</span></div>
          <div><b>Access</b><span>Create a way in for everyone.</span></div>
          <div><b>Momentum</b><span>Give the next voice a job.</span></div>
        </aside>
      </section>

      <form className="topic-form" onSubmit={convene}>
        <div className="topic-form__head"><label htmlFor="teaching-topic">What are you teaching or trying to solve?</label><span>One honest sentence is enough.</span></div>
        <textarea
          id="teaching-topic"
          value={topic}
          onChange={(event) => { setTopic(event.target.value); setInputError(""); }}
          placeholder="For example: My Grade 8 discussion stalls after the first confident answer. How can I get more thoughtful voices into the room?"
          rows={4}
          maxLength={1600}
          aria-describedby={inputError ? "topic-error" : undefined}
        />
        {inputError ? <p className="form-error" id="topic-error">{inputError}</p> : null}
        <div className="topic-form__actions">
          <button className="convene-button" type="submit" disabled={status === "convening"}>
            {status === "convening" ? <LoaderCircle className="spin" size={18} /> : <Send size={17} />}
            {status === "convening" ? "Convening the room…" : "Convene the room"}
          </button>
          <button className="example-button" type="button" onClick={loadExample}>Try a live example <ArrowRight size={15} /></button>
        </div>
      </form>

      <footer className="opening-footer"><span>Not a tutor</span><span>Not a learner profile</span><span>A thinking partner for teachers</span></footer>
    </main>
  );
}
