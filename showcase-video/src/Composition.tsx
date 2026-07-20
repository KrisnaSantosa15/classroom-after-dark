import { Audio, Video } from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Composition,
} from "remotion";

const fps = 30;
const durationInFrames = 1200;

const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = (value: number, from: number, to: number, outputFrom: number, outputTo: number) =>
  interpolate(value, [from, to], [outputFrom, outputTo], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Wordmark: React.FC<{ inverse?: boolean }> = ({ inverse = false }) => (
  <div className={`wordmark${inverse ? " wordmark--inverse" : ""}`}>
    <div className="wordmark__moon">◔</div>
    <div><b>Classroom<br />After Dark</b><span>Teaching council</span></div>
  </div>
);

const PinnedNote: React.FC<{ label: string; text: string; accent: string; delay: number }> = ({ label, text, accent, delay }) => {
  const frame = useCurrentFrame();
  return (
    <div
      className="pinned-note"
      style={{
        opacity: clamp(frame, delay, delay + 16, 0, 1),
        translate: `0 ${clamp(frame, delay, delay + 20, 30, 0)}px`,
        borderColor: accent,
      }}
    >
      <i style={{ background: accent }} />
      <small>{label}</small>
      <b>{text}</b>
    </div>
  );
};

const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { width } = useVideoConfig();
  return (
    <AbsoluteFill className="intro-scene">
      <div className="glow glow--intro" />
      <div className="intro-topline" style={{ opacity: clamp(frame, 4, 18, 0, 1) }}>
        <Wordmark />
        <span>Made for the moment before class</span>
      </div>
      <div className="intro-title">
        <p style={{ opacity: clamp(frame, 12, 28, 0, 1), translate: `0 ${clamp(frame, 12, 28, 24, 0)}px` }}>Teachers do not need more tabs.</p>
        <h1 style={{ opacity: clamp(frame, 24, 50, 0, 1), translate: `0 ${clamp(frame, 24, 50, 38, 0)}px` }}>
          They need one<br /><em>good next move.</em>
        </h1>
      </div>
      <div className="intro-notes" style={{ width: Math.min(width - 140, 900) }}>
        <PinnedNote label="01 · Bring the knot" text="One honest teaching topic" accent="#ff8058" delay={54} />
        <PinnedNote label="02 · Convene the room" text="Three useful lenses" accent="#a9dcb8" delay={69} />
        <PinnedNote label="03 · Leave ready" text="One practical opener" accent="#9bc8da" delay={84} />
      </div>
    </AbsoluteFill>
  );
};

const ProductWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const sceneFrame = frame;
  const cardWidth = Math.min(width - 160, 1390);

  return (
    <AbsoluteFill className="walkthrough-scene">
      <div className="glow glow--walkthrough" />
      <div className="walkthrough-header">
        <Wordmark inverse />
        <span>From a teaching knot to tomorrow&apos;s opener</span>
      </div>
      <div
        className="product-frame"
        style={{
          width: cardWidth,
          height: Math.min(height - 190, 805),
          opacity: clamp(sceneFrame, 0, 18, 0, 1),
          scale: clamp(sceneFrame, 0, 26, 0.94, 1),
          translate: `-50% ${clamp(sceneFrame, 0, 26, 32, 0)}px`,
        }}
      >
        <div className="product-frame__chrome"><span /><span /><span /><b>classroom-after-dark · teaching council</b></div>
        <Video src={staticFile("product-walkthrough.webm")} className="product-frame__video" />
      </div>
      <div className="walkthrough-caption" style={{ opacity: clamp(sceneFrame, 45, 61, 0, 1) }}>
        <span>ONE TOPIC</span><i /> <span>THREE LENSES</span><i /> <span>ONE NEXT MOVE</span>
      </div>
      <div
        className="proof-badge proof-badge--top"
        style={{ opacity: clamp(sceneFrame, 155, 174, 0, 1), translate: `${clamp(sceneFrame, 155, 174, 40, 0)}px 0` }}
      >
        <small>No fictional learner profiles</small><b>Only the topic the teacher brings.</b>
      </div>
      <div
        className="proof-badge proof-badge--bottom"
        style={{ opacity: clamp(sceneFrame, 275, 294, 0, 1), translate: `${clamp(sceneFrame, 275, 294, -40, 0)}px 0` }}
      >
        <small>Works without setup</small><b>Local planning lenses are ready on day one.</b>
      </div>
    </AbsoluteFill>
  );
};

const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill className="closing-scene">
      <div className="glow glow--closing" />
      <div className="closing-grid" />
      <div className="closing-content">
        <Wordmark />
        <p style={{ opacity: clamp(frame, 8, 23, 0, 1) }}>Classroom After Dark turns the last-minute teaching knot into:</p>
        <h2 style={{ opacity: clamp(frame, 20, 48, 0, 1), translate: `0 ${clamp(frame, 20, 48, 32, 0)}px` }}>A room full of<br /><em>useful thinking.</em></h2>
        <div className="closing-points">
          <span style={{ opacity: clamp(frame, 48, 64, 0, 1) }}>Evidence</span>
          <span style={{ opacity: clamp(frame, 62, 78, 0, 1) }}>Access</span>
          <span style={{ opacity: clamp(frame, 76, 92, 0, 1) }}>Momentum</span>
        </div>
        <div className="closing-line" style={{ scale: clamp(frame, 90, 112, 0, 1), transformOrigin: "left" }} />
        <small style={{ opacity: clamp(frame, 108, 122, 0, 1) }}>One topic · Three lenses · One next move</small>
        <div className="codex-proof" style={{ opacity: clamp(frame, 235, 258, 0, 1), translate: `0 ${clamp(frame, 235, 258, 20, 0)}px` }}>
          <span>Built with Codex + GPT-5.6</span>
          <b>Architecture · structured council route · interface · tests · release</b>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Showcase: React.FC = () => (
  <AbsoluteFill className="showcase">
    <Audio src={staticFile("narration.wav")} />
    <Sequence name="Opening promise" durationInFrames={175}><Intro /></Sequence>
    <Sequence name="Live product walkthrough" from={145} durationInFrames={410}><ProductWalkthrough /></Sequence>
    <Sequence name="Closing statement" from={520} durationInFrames={680}><Closing /></Sequence>
  </AbsoluteFill>
);

export const ClassroomAfterDarkShowcase = () => {
  return (
    <Composition
      id="ClassroomAfterDarkShowcase"
      component={Showcase}
      durationInFrames={durationInFrames}
      fps={fps}
      width={1920}
      height={1080}
    />
  );
};
