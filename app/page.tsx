"use client";

import { useRef, useState, useEffect, useCallback } from "react";

type Screen = "intro" | "quiz" | "results";

interface Option {
  text: string;
  scores: [number, number];
}

interface Question {
  text: string;
  options: Option[];
}

interface Quadrant {
  name: string;
  tag: string;
  desc: string;
  examples: string;
}

const questions: Question[] = [
  {
    text: "Religious texts are most valuable as...",
    options: [
      { text: "Literal records of divine truth or historical events", scores: [-2, -1] },
      { text: "Moral guides whose authority comes from God", scores: [-1, -2] },
      { text: "Living myths that encode timeless human wisdom", scores: [2, 1] },
      { text: "Literature — profound but human in origin", scores: [1, 2] },
    ],
  },
  {
    text: "When science contradicts a religious claim, the religious claim...",
    options: [
      { text: "Is simply wrong — science wins", scores: [-1, 2] },
      { text: "Needs reinterpretation within its tradition", scores: [-1, -1] },
      { text: "Was probably never meant to be taken literally", scores: [2, 0] },
      { text: "May be pointing at a truth science can't reach", scores: [2, 2] },
    ],
  },
  {
    text: "Miracles are...",
    options: [
      { text: "Real events that suspend natural law", scores: [-2, -2] },
      { text: "Possible, but I'm skeptical of specific claims", scores: [-1, -1] },
      { text: "Metaphors for experiences of extraordinary meaning", scores: [2, 0] },
      { text: "A category error — the word muddles more than it clarifies", scores: [1, 2] },
    ],
  },
  {
    text: "When you feel a sense of awe or transcendence, it feels like contact with...",
    options: [
      { text: "God — a being who is aware of me", scores: [-1, -2] },
      { text: "Something vast and real, though I can't name it", scores: [1, 1] },
      { text: "Myself more deeply, or the collective human experience", scores: [2, 2] },
      { text: "Nothing in particular — it's a brain state", scores: [0, 2] },
    ],
  },
  {
    text: "Prayer or meditation works because...",
    options: [
      { text: "God hears and responds", scores: [-2, -2] },
      { text: "It changes the one who prays, regardless of any external response", scores: [1, 0] },
      { text: "It connects you to something larger than yourself", scores: [1, 1] },
      { text: "It's neuroscience — attention, calm, and habit", scores: [0, 2] },
    ],
  },
  {
    text: "When someone dies, they...",
    options: [
      { text: "Go somewhere — heaven, another realm, or reincarnation", scores: [-2, -2] },
      { text: "Return to something — a ground of being, a universal consciousness", scores: [1, 1] },
      { text: "Live on in others, in what they made, in the signal they left", scores: [2, 2] },
      { text: "Simply cease — consciousness ends with the body", scores: [0, 2] },
    ],
  },
  {
    text: "The universe feels to you like it is...",
    options: [
      { text: "Designed — there is intention behind it", scores: [-1, -2] },
      { text: "Indifferent — vast and without concern for us", scores: [0, 2] },
      { text: "Mysterious — I hold the question open", scores: [1, 1] },
      { text: "Self-organizing — complexity emerges without a designer", scores: [0, 2] },
    ],
  },
  {
    text: "Ancient myths across cultures are similar because...",
    options: [
      { text: "They all point toward the same God", scores: [-2, -1] },
      { text: "Humans share the same psychological architecture", scores: [1, 1] },
      { text: "There's a collective truth they're all tracking, independently", scores: [2, 2] },
      { text: "Common human circumstances produce common stories", scores: [1, 2] },
    ],
  },
  {
    text: "Spiritual experience is...",
    options: [
      { text: "Contact with the divine — something outside and beyond me", scores: [-2, -2] },
      { text: "Meaningful but self-generated — the mind reaching its own depths", scores: [1, 0] },
      { text: "Evidence of something real but unnamed", scores: [2, 1] },
      { text: "A brain state — remarkable, but not pointing beyond itself", scores: [0, 2] },
    ],
  },
  {
    text: "The most honest thing you can say about God is...",
    options: [
      { text: "God exists — I believe this", scores: [-2, -2] },
      { text: "God might exist — I hold the question open", scores: [0, -1] },
      { text: "The question itself may be poorly formed", scores: [2, 1] },
      { text: "God doesn't exist — this is my best assessment", scores: [0, 2] },
    ],
  },
];

const quadrants: Record<string, Quadrant> = {
  "literal-personal": {
    name: "Traditional Theism",
    tag: "Literal · Personal",
    desc: "You tend to take religious or spiritual claims as literally true, and you understand the sacred as a being — conscious, relational, and in some meaningful way aware of you. This is the territory of orthodox faith: a God who hears, intervenes, and knows you by name.",
    examples:
      "<strong>Resonant traditions:</strong> Evangelical Christianity, orthodox Islam, Latter-day Saints, devout Catholicism, orthodox Judaism. <strong>Thinkers:</strong> Alvin Plantinga, G.K. Chesterton, C.S. Lewis (early).",
  },
  "mythic-personal": {
    name: "Relational Mysticism",
    tag: "Mythic · Personal",
    desc: "You treat religious language as pointing at something real rather than describing literal facts, but what it points at still feels relational — a presence, a love, a being of some kind. God is real, but not reducible to doctrine. The myths matter because they're true in the way that counts.",
    examples:
      "<strong>Resonant traditions:</strong> Liberal Christianity, Sufism, Kabbalah, Progressive Judaism, Unitarian Universalism. <strong>Thinkers:</strong> Paul Tillich, Rumi, Martin Buber, Richard Rohr.",
  },
  "literal-impersonal": {
    name: "Secular Materialism",
    tag: "Literal · Impersonal",
    desc: "You take empirical claims seriously and find the religious ones wanting. The universe is real and knowable, but it doesn't contain gods or spiritual forces. The myths aren't pointing at hidden truths — they're human constructions, worth studying but not worthy of belief.",
    examples:
      "<strong>Resonant traditions:</strong> Secular humanism, scientific atheism. <strong>Thinkers:</strong> Richard Dawkins, Daniel Dennett, Christopher Hitchens, Sam Harris.",
  },
  "mythic-impersonal": {
    name: "The Collective",
    tag: "Mythic · Impersonal",
    desc: "You find the myths true in the way that matters, but what they point at isn't a being — it's something more like a field, a signal, a substrate. Consciousness, meaning, and beauty are real, but they don't require a designer or a listener. When something ancient rings true today, you're picking up a frequency that was always there.",
    examples:
      "<strong>Resonant traditions:</strong> Taoism, secular Buddhism, Jungian thought, philosophical naturalism. <strong>Thinkers:</strong> Joseph Campbell, Carl Jung, Alan Watts, Ursula K. Le Guin, the Tao Te Ching.",
  },
};

function drawCompass(
  canvas: HTMLCanvasElement,
  xNorm: number,
  yNorm: number
) {
  const ctx = canvas.getContext("2d")!;
  const W = canvas.width;
  const H = canvas.height;
  const cx = W / 2;
  const cy = H / 2;

  ctx.clearRect(0, 0, W, H);

  const colors = ["#e8e4f0", "#e8f0e8", "#f0e8e8", "#e8eef0"];
  ctx.fillStyle = colors[0]; ctx.fillRect(0, 0, cx, cy);
  ctx.fillStyle = colors[1]; ctx.fillRect(cx, 0, cx, cy);
  ctx.fillStyle = colors[2]; ctx.fillRect(0, cy, cx, cy);
  ctx.fillStyle = colors[3]; ctx.fillRect(cx, cy, cx, cy);

  ctx.strokeStyle = "#c8c0b0";
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    const x = (W / 4) * i;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    const y = (H / 4) * i;
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.strokeStyle = "#999";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();

  ctx.font = '600 9px "Source Sans 3", sans-serif';
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.textAlign = "center";
  ctx.fillText("TRADITIONAL", cx / 2, 16);
  ctx.fillText("THEISM", cx / 2, 27);
  ctx.fillText("RELATIONAL", cx + cx / 2, 16);
  ctx.fillText("MYSTICISM", cx + cx / 2, 27);
  ctx.fillText("SECULAR", cx / 2, H - 18);
  ctx.fillText("MATERIALISM", cx / 2, H - 7);
  ctx.fillText("THE", cx + cx / 2, H - 18);
  ctx.fillText("COLLECTIVE", cx + cx / 2, H - 7);

  const dotX = ((xNorm + 1) / 2) * W;
  const dotY = ((-yNorm + 1) / 2) * H;

  ctx.strokeStyle = "rgba(192,57,43,0.4)";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(dotX, 0); ctx.lineTo(dotX, H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, dotY); ctx.lineTo(W, dotY); ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#c0392b";
  ctx.beginPath();
  ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  ctx.stroke();
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showError, setShowError] = useState(false);
  const [results, setResults] = useState<{
    xNorm: number;
    yNorm: number;
    quadKey: string;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const letters = ["A", "B", "C", "D"];

  function startQuiz() {
    setScreen("quiz");
    setCurrent(0);
    setAnswers(new Array(questions.length).fill(null));
  }

  function selectOption(i: number) {
    const next = [...answers];
    next[current] = i;
    setAnswers(next);
    setShowError(false);
  }

  function goBack() {
    if (current > 0) setCurrent(current - 1);
  }

  function goNext() {
    if (answers[current] === null) {
      setShowError(true);
      setTimeout(() => setShowError(false), 600);
      return;
    }
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      showResults();
    }
  }

  function showResults() {
    let xScore = 0;
    let yScore = 0;
    answers.forEach((ans, qi) => {
      if (ans !== null) {
        xScore += questions[qi].options[ans].scores[0];
        yScore += questions[qi].options[ans].scores[1];
      }
    });
    const maxScore = questions.length * 2;
    const xNorm = xScore / maxScore;
    const yNorm = yScore / maxScore;
    const quadKey =
      (xNorm >= 0 ? "mythic" : "literal") +
      "-" +
      (yNorm >= 0 ? "impersonal" : "personal");
    setResults({ xNorm, yNorm, quadKey });
    setScreen("results");
  }

  const drawCanvas = useCallback(() => {
    if (results && canvasRef.current) {
      drawCompass(canvasRef.current, results.xNorm, results.yNorm);
    }
  }, [results]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  function retake() {
    setCurrent(0);
    setAnswers(new Array(questions.length).fill(null));
    setResults(null);
    setScreen("intro");
  }

  const q = questions[current];

  return (
    <div className="container">
      {screen === "intro" && (
        <div className="intro-screen">
          <h2>
            Where do you actually
            <br />
            <em>sit</em> on questions of the sacred?
          </h2>
          <p>
            Most belief surveys ask whether you&apos;re religious or not. This one
            tries to ask something more interesting: <em>how</em> you relate to
            spiritual claims, and <em>what</em> you think the transcendent is, if
            anything.
          </p>
          <p>
            Ten questions. No right answers. The result is a position on a
            two-axis map, not a score.
          </p>
          <div className="meta">
            10 questions &nbsp;·&nbsp; ~4 minutes &nbsp;·&nbsp; No data
            collected
          </div>
          <button className="btn" onClick={startQuiz}>
            Begin the test
          </button>
        </div>
      )}

      {screen === "quiz" && (
        <div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(current / questions.length) * 100}%` }}
            />
          </div>
          <div className="question-counter">
            Question {current + 1} of {questions.length}
          </div>
          <div className="question-text">{q.text}</div>
          <div className={`options${showError ? " error" : ""}`}>
            {q.options.map((opt, i) => (
              <div
                key={i}
                className={`option${answers[current] === i ? " selected" : ""}`}
                onClick={() => selectOption(i)}
              >
                <span className="option-letter">{letters[i]}</span>
                <span>{opt.text}</span>
              </div>
            ))}
          </div>
          <div className="nav-row">
            <button
              className="btn-ghost"
              onClick={goBack}
              disabled={current === 0}
            >
              ← Back
            </button>
            <button className="btn" onClick={goNext}>
              {current === questions.length - 1 ? "See results" : "Next →"}
            </button>
          </div>
        </div>
      )}

      {screen === "results" && results && (() => {
        const quad = quadrants[results.quadKey];
        const xPct = ((results.xNorm + 1) / 2) * 100;
        const yPct = ((results.yNorm + 1) / 2) * 100;
        return (
          <div>
            <div className="results-title">Your position</div>
            <div className="results-subtitle">Based on your responses</div>

            <div className="compass-wrap">
              <div className="compass-container">
                <div className="axis-label">Personal</div>
                <div className="compass-row">
                  <div className="axis-label-side">Literal</div>
                  <canvas
                    ref={canvasRef}
                    className="compass-canvas"
                    width={300}
                    height={300}
                  />
                  <div className="axis-label-side right">Mythic</div>
                </div>
                <div className="axis-label bottom">Impersonal</div>
              </div>

              <div className="quadrant-info">
                <div className="quadrant-name">{quad.name}</div>
                <div className="quadrant-tag">{quad.tag}</div>
                <div className="quadrant-desc">{quad.desc}</div>
                <div
                  className="quadrant-examples"
                  dangerouslySetInnerHTML={{ __html: quad.examples }}
                />
              </div>
            </div>

            <div className="scores-row">
              <div className="score-item">
                <div className="score-label">Literal ← → Mythic</div>
                <div className="score-track">
                  <div className="score-fill" style={{ width: `${xPct}%` }} />
                </div>
                <div className="score-ends">
                  <span>Literal</span>
                  <span>Mythic</span>
                </div>
              </div>
              <div className="score-item">
                <div className="score-label">Personal ← → Impersonal</div>
                <div className="score-track">
                  <div className="score-fill" style={{ width: `${yPct}%` }} />
                </div>
                <div className="score-ends">
                  <span>Personal</span>
                  <span>Impersonal</span>
                </div>
              </div>
            </div>

            <div className="retake-row">
              <button className="btn-ghost" onClick={retake}>
                Retake the test
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
