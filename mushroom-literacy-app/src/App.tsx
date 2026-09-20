import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { mushrooms, literacyChars, type Mushroom } from './data/mushrooms'
import { MushroomArt } from './components/MushroomArt'
import { matchMushrooms, sampleImageColors, type MatchResult } from './lib/matchColors'
import { speakChinese } from './lib/speak'
import './App.css'

type Tab = 'home' | 'snap' | 'atlas' | 'chars' | 'quiz'

function SafetyPill({ mushroom }: { mushroom: Mushroom }) {
  const label =
    mushroom.safety === 'toxic-teach'
      ? '有毒教学 · 只看'
      : mushroom.safety === 'cultivated-ok'
        ? '栽培常见 · 野外不采'
        : '只观察 · 不采不吃'
  const tone =
    mushroom.safety === 'toxic-teach'
      ? 'danger'
      : mushroom.safety === 'cultivated-ok'
        ? 'ok'
        : 'warn'
  return <span className={`pill pill-${tone}`}>{label}</span>
}

function CharBig({
  char,
  pinyin,
  onSpeak,
}: {
  char: string
  pinyin?: string
  onSpeak?: () => void
}) {
  return (
    <button type="button" className="char-big" onClick={onSpeak} aria-label={`朗读 ${char}`}>
      <span className="char-glyph">{char}</span>
      {pinyin ? <span className="char-py">{pinyin}</span> : null}
    </button>
  )
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [selected, setSelected] = useState<Mushroom | null>(null)
  const [busy, setBusy] = useState(false)
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizMsg, setQuizMsg] = useState('')
  const [stars, setStars] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraOn, setCameraOn] = useState(false)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  useEffect(() => {
    const video = videoRef.current
    const stream = streamRef.current
    if (!cameraOn || !video || !stream) return
    video.srcObject = stream
    void video.play().catch(() => {})
  }, [cameraOn])

  async function analyzeFile(file: File) {
    setBusy(true)
    try {
      const url = URL.createObjectURL(file)
      setPhotoUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev)
        return url
      })
      const img = new Image()
      img.src = url
      await img.decode()
      const samples = await sampleImageColors(img)
      const ranked = matchMushrooms(samples)
      setMatches(ranked.slice(0, 3))
      setSelected(ranked[0]?.mushroom ?? null)
      setTab('snap')
    } finally {
      setBusy(false)
    }
  }

  function goSnap() {
    // Fresh snap session: don't show a leftover atlas selection.
    if (!photoUrl) {
      setSelected(null)
      setMatches([])
    }
    setTab('snap')
  }

  async function onPick(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await analyzeFile(file)
    e.target.value = ''
  }

  async function startCamera() {
    try {
      goSnap()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      setCameraOn(true)
    } catch {
      setCameraOn(false)
      goSnap()
    }
  }

  async function captureFrame() {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92))
    if (!blob) return
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setCameraOn(false)
    await analyzeFile(new File([blob], 'capture.jpg', { type: 'image/jpeg' }))
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setCameraOn(false)
  }

  function openMushroom(m: Mushroom) {
    setSelected(m)
    setTab('atlas')
    speakChinese(m.name)
  }

  const quizTarget = literacyChars[quizIndex % literacyChars.length]
  const quizPicks = (() => {
    const pool = literacyChars.map((c) => c.char).filter((ch) => ch !== quizTarget.char)
    const a = pool[quizIndex % pool.length]
    const b = pool[(quizIndex + 5) % pool.length]
    const trio = [quizTarget.char, a, b]
    const rot = quizIndex % 3
    return [...trio.slice(rot), ...trio.slice(0, rot)]
  })()

  function answerQuiz(char: string) {
    if (char === quizTarget.char) {
      setStars((s) => s + 1)
      setQuizMsg('真棒！认对了。')
      speakChinese(quizTarget.char)
      window.setTimeout(() => {
        setQuizMsg('')
        setQuizIndex((i) => i + 1)
      }, 700)
    } else {
      setQuizMsg('再想想～点大字听一听。')
    }
  }

  return (
    <div className="app-shell">
      <div className="forest-bg" aria-hidden="true" />
      <div className="spore spore-a" aria-hidden="true" />
      <div className="spore spore-b" aria-hidden="true" />
      <div className="spore spore-c" aria-hidden="true" />

      <header className="topbar">
        <div className="brand-mark" onClick={() => setTab('home')} role="button" tabIndex={0}>
          <span className="brand-cn">蘑菇识字</span>
          <span className="brand-en">Look · Learn · Never taste</span>
        </div>
        <div className="star-chip" title="识字小星星">★ {stars}</div>
      </header>

      <main className="stage">
        {tab === 'home' && (
          <section className="hero panel fade-in">
            <p className="eyebrow">亲子自然课</p>
            <h1 className="hero-title">蘑菇识字</h1>
            <p className="hero-lead">
              拍一拍路边的蘑菇，学汉字、听读音。家规只有一句：
              <strong>只看不吃。</strong>
            </p>
            <div className="cta-row">
              <button type="button" className="btn primary" onClick={startCamera}>
                打开相机
              </button>
              <label className="btn ghost file-btn">
                上传照片
                <input type="file" accept="image/*" capture="environment" onChange={onPick} hidden />
              </label>
            </div>
            <p className="tiny-note">
              识别是「颜色像谁」的趣味匹配，给孩子练观察与识字用，绝不能当能不能吃的依据。
            </p>
            <div className="hero-art-row">
              {mushrooms.slice(0, 4).map((m) => (
                <button key={m.id} type="button" className="mini-mush" onClick={() => openMushroom(m)}>
                  <MushroomArt tone={m.svgTone} title={m.name} />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === 'snap' && (
          <section className="panel fade-in">
            <h2 className="section-title">拍照认蘑菇</h2>
            <p className="section-lead">对准蘑菇，按下快门。我们帮你找「长得有点像」的图鉴，再一起认字。</p>

            {cameraOn ? (
              <div className="camera-box">
                <video ref={videoRef} playsInline muted className="camera-video" />
                <div className="camera-actions">
                  <button type="button" className="btn primary" onClick={captureFrame}>
                    拍一张
                  </button>
                  <button type="button" className="btn ghost" onClick={stopCamera}>
                    关闭相机
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-row">
                <label className="btn primary file-btn">
                  {busy ? '识别中…' : '选一张照片'}
                  <input type="file" accept="image/*" capture="environment" onChange={onPick} hidden disabled={busy} />
                </label>
                <button type="button" className="btn ghost" onClick={startCamera}>
                  重新开相机
                </button>
              </div>
            )}

            {photoUrl && (
              <div className="result-grid">
                <figure className="photo-frame">
                  <img src={photoUrl} alt="你拍到的蘑菇" />
                  <figcaption>你的照片 · 只观察</figcaption>
                </figure>
                <div className="match-list">
                  <h3>可能有点像</h3>
                  {matches.map((m, idx) => (
                    <button
                      key={m.mushroom.id}
                      type="button"
                      className={`match-item ${selected?.id === m.mushroom.id ? 'active' : ''}`}
                      onClick={() => {
                        setSelected(m.mushroom)
                        speakChinese(m.mushroom.name)
                      }}
                    >
                      <MushroomArt tone={m.mushroom.svgTone} title={m.mushroom.name} className="match-art" />
                      <div>
                        <div className="match-name">
                          {idx === 0 ? '最像 · ' : ''}
                          {m.mushroom.name}
                        </div>
                        <div className="match-py">{m.mushroom.pinyin}</div>
                        <SafetyPill mushroom={m.mushroom} />
                      </div>
                      <span className="match-score">{Math.round(m.score * 100)}%</span>
                    </button>
                  ))}
                  <p className="tiny-note">百分比只表示颜色相似度，不是鉴定结果。</p>
                </div>
              </div>
            )}

            {photoUrl && selected && (
              <div className="learn-block">
                <div className="learn-head">
                  <MushroomArt tone={selected.svgTone} title={selected.name} className="learn-art" />
                  <div>
                    <h3>{selected.name}</h3>
                    <p className="match-py">{selected.pinyin}</p>
                    <SafetyPill mushroom={selected} />
                    <p>{selected.funFact}</p>
                    <p className="safety-line">{selected.safetyNote}</p>
                  </div>
                </div>
                <div className="char-row">
                  {selected.chars.map((ch) => {
                    const meta = literacyChars.find((c) => c.char === ch)
                    return (
                      <CharBig
                        key={ch}
                        char={ch}
                        pinyin={meta?.pinyin}
                        onSpeak={() => speakChinese(ch)}
                      />
                    )
                  })}
                </div>
                <button type="button" className="btn primary" onClick={() => speakChinese(`只看不吃。${selected.name}`)}>
                  听一听：只看不吃
                </button>
              </div>
            )}
          </section>
        )}

        {tab === 'atlas' && (
          <section className="panel fade-in">
            <h2 className="section-title">蘑菇图鉴</h2>
            <p className="section-lead">点开一张，大声读名字，记住汉字。</p>
            <div className="atlas-grid">
              {mushrooms.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`atlas-card ${selected?.id === m.id ? 'active' : ''}`}
                  onClick={() => openMushroom(m)}
                >
                  <MushroomArt tone={m.svgTone} title={m.name} />
                  <strong>{m.name}</strong>
                  <span>{m.pinyin}</span>
                  <SafetyPill mushroom={m} />
                </button>
              ))}
            </div>
            {selected && (
              <div className="learn-block">
                <h3>{selected.name}</h3>
                <p>{selected.funFact}</p>
                <p className="safety-line">{selected.safetyNote}</p>
                <p>生长环境：{selected.habitat}</p>
                <div className="char-row">
                  {selected.chars.map((ch) => {
                    const meta = literacyChars.find((c) => c.char === ch)
                    return (
                      <CharBig
                        key={ch}
                        char={ch}
                        pinyin={meta?.pinyin}
                        onSpeak={() => speakChinese(ch)}
                      />
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {tab === 'chars' && (
          <section className="panel fade-in">
            <h2 className="section-title">汉字卡片</h2>
            <p className="section-lead">点大字听读音。先学会「看 / 不 / 吃 / 毒」。</p>
            <div className="char-grid">
              {literacyChars.map((c) => (
                <button
                  key={c.char}
                  type="button"
                  className="char-card"
                  onClick={() => speakChinese(`${c.char}，${c.meaning}`)}
                >
                  <span className="char-glyph">{c.char}</span>
                  <span className="char-py">{c.pinyin}</span>
                  <span className="char-mean">{c.meaning}</span>
                  <span className="char-tip">{c.tip}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {tab === 'quiz' && (
          <section className="panel fade-in quiz-panel">
            <h2 className="section-title">认字小测验</h2>
            <p className="section-lead">听读音，选出正确的字。</p>
            <button
              type="button"
              className="char-big quiz-target"
              onClick={() => speakChinese(quizTarget.char)}
            >
              <span className="char-glyph">{quizTarget.char}</span>
              <span className="char-py">{quizTarget.pinyin}</span>
            </button>
            <p className="quiz-hint">{quizTarget.meaning}</p>
            <div className="quiz-options">
              {quizPicks.map((ch) => (
                <button key={ch} type="button" className="btn ghost quiz-opt" onClick={() => answerQuiz(ch)}>
                  {ch}
                </button>
              ))}
            </div>
            {quizMsg && <p className="quiz-msg">{quizMsg}</p>}
          </section>
        )}
      </main>

      <nav className="dock" aria-label="主导航">
        {(
          [
            ['home', '首页'],
            ['snap', '拍照'],
            ['atlas', '图鉴'],
            ['chars', '识字'],
            ['quiz', '测验'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={tab === id ? 'dock-btn active' : 'dock-btn'}
            onClick={() => (id === 'snap' ? goSnap() : setTab(id))}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
