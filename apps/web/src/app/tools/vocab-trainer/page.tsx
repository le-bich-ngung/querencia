'use client';
import { useState, useRef, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { useSession, signIn } from 'next-auth/react';
import * as XLSX from 'xlsx';
import { vocabApi, VocabWord, VocabSetMeta, VocabSetDetail } from '../../../lib/api-client';

const SAGE = '#4a7c59';
const SAGE_DARK = '#2c4137';
const GOLD = '#b8863f';
const PAPER = '#f3efe6';
const CARD = '#fffdf8';
const LINE = '#ddd6c6';
const INK = '#1b2420';
const MUTED = '#7a7264';
const MAX_WORDS = 5000;

// ── SM-2 ──────────────────────────────────────────────────────
type SRSCard = { ef: number; interval: number; reps: number; due: number; learned: boolean };
function sm2(card: SRSCard, quality: number) {
  const now = Date.now(); const DAY = 24 * 60 * 60 * 1000;
  if (quality < 3) {
    card.reps = 0; card.interval = 0;
    card.due = now + (quality === 2 ? 5 * 60 * 1000 : 60 * 1000);
    card.learned = false;
  } else {
    if (card.reps === 0) card.interval = 1;
    else if (card.reps === 1) card.interval = 6;
    else card.interval = Math.round(card.interval * card.ef);
    card.reps += 1;
    card.due = now + card.interval * DAY;
    card.learned = card.interval >= 8;
  }
  card.ef = Math.max(1.3, Math.min(3.2, card.ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))));
}
function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// ── Parse uploaded file ───────────────────────────────────────
async function parseFile(file: File): Promise<VocabWord[]> {
  const isExcel = /\.(xlsx|xls)$/i.test(file.name);
  if (isExcel) {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const words: VocabWord[] = [];
    for (const row of rows) {
      if (!row || row.length === 0) continue;
      let cells = row.map(c => (c ?? '').toString().trim());
      if (cells.length >= 3 && /^\d+$/.test(cells[0])) cells = cells.slice(1);
      if (cells.length < 2) continue;
      const [w, p, m] = cells.length >= 3 ? [cells[0], cells[1], cells[2]] : [cells[0], '', cells[1]];
      if (!w || !m || /^từ vựng$/i.test(w) || /^stt$/i.test(w)) continue;
      words.push({ w, p: p || undefined, m });
    }
    return words;
  }
  const text = await file.text();
  const words: VocabWord[] = [];
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line || line.startsWith('#') || /^\*\*/.test(line)) continue;
    if (/^\|?\s*-+\s*\|/.test(line)) continue;
    let cells: string[];
    if (line.startsWith('|')) {
      cells = line.split('|').map(c => c.trim()).filter((c, i, arr) => !(c === '' && (i === 0 || i === arr.length - 1)));
      if (cells.length >= 3 && /^\d+$/.test(cells[0])) cells = cells.slice(1);
      if (/^stt$/i.test(cells[0] || '')) continue;
    } else {
      cells = line.split('|').map(c => c.trim());
    }
    if (cells.length < 2) continue;
    const [w, p, m] = cells.length >= 3 ? [cells[0], cells[1], cells[2]] : [cells[0], '', cells[1]];
    if (!w || !m || /^từ vựng$/i.test(w)) continue;
    words.push({ w, p: p || undefined, m });
  }
  return words;
}

// ── Sample template download ──────────────────────────────────
function downloadTemplate() {
  const wb = XLSX.utils.book_new();
  const data = [
    ['STT', 'Từ vựng', 'Loại từ', 'Nghĩa'],
    [1, 'example', 'n', 'ví dụ'],
    [2, 'consider', 'v', 'xem xét, cân nhắc'],
    [3, 'beautiful', 'adj', 'đẹp'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(data);
  ws['!cols'] = [{ wch: 6 }, { wch: 20 }, { wch: 12 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, ws, 'Từ vựng mẫu');
  XLSX.writeFile(wb, 'mau-tu-vung-querencia.xlsx');
}

// ── Q logo ────────────────────────────────────────────────────
const QMark = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width={size} height={size}>
    <defs><clipPath id="qm"><circle cx="55" cy="55" r="32" /></clipPath></defs>
    <circle cx="55" cy="55" r="38" fill="none" stroke={SAGE} strokeWidth="9" strokeLinecap="round" />
    <line x1="81" y1="79" x2="98" y2="98" stroke={SAGE} strokeWidth="9" strokeLinecap="round" />
    <polyline points="20,55 28,38 35,68 43,32 51,60 58,43 66,70 74,48 90,55" fill="none" stroke={SAGE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" clipPath="url(#qm)" />
  </svg>
);

export default function VocabTrainerPage() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const { data: mine, mutate: mutateMine } = useSWR(token ? ['vocab-mine', token] : null, () => vocabApi.listMine(token!));
  const { data: pub, mutate: mutatePub } = useSWR('vocab-public', () => vocabApi.listPublic());

  const [tab, setTab] = useState<'mine' | 'explore'>('mine');
  const [activeSet, setActiveSet] = useState<VocabSetDetail | null>(null);
  const [studyMode, setStudyMode] = useState<'flip' | 'quiz'>('flip');
  const [query, setQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    if (!token) return;
    setUploading(true); setUploadMsg('');
    try {
      const words = await parseFile(file);
      if (words.length === 0) { setUploadMsg('Không đọc được từ nào — kiểm tra lại định dạng file (xem hướng dẫn cột phía trên).'); setUploading(false); return; }
      if (words.length > MAX_WORDS) { setUploadMsg(`File có ${words.length} từ, vượt quá giới hạn ${MAX_WORDS}.`); setUploading(false); return; }
      const setName_ = name.trim() || file.name.replace(/\.[^.]+$/, '');
      await vocabApi.create({ name: setName_, isPublic, words }, token);
      setUploadMsg(`✓ Đã tải lên ${words.length} từ vào "${setName_}"`);
      setName(''); setIsPublic(false);
      if (fileRef.current) fileRef.current.value = '';
      mutateMine();
      setTimeout(() => setShowUpload(false), 1200);
    } catch (e: any) {
      setUploadMsg('Lỗi: ' + (e.message ?? 'không rõ nguyên nhân'));
    } finally { setUploading(false); }
  }

  async function togglePublic(s: VocabSetMeta) {
    if (!token) return;
    await vocabApi.update(s.id, { isPublic: !s.isPublic }, token);
    mutateMine(); mutatePub();
  }
  async function deleteSet(s: VocabSetMeta) {
    if (!token) return;
    if (!confirm(`Xoá bộ từ "${s.name}"? Không thể hoàn tác.`)) return;
    await vocabApi.remove(s.id, token);
    mutateMine(); mutatePub();
  }
  async function openStudy(meta: VocabSetMeta, isMine: boolean) {
    const detail = isMine && token ? await vocabApi.getMine(meta.id, token) : await vocabApi.getPublic(meta.id);
    setActiveSet(detail);
  }
  async function saveEditedSet(updated: VocabSetDetail) {
    if (!token) return;
    await vocabApi.update(updated.id, { words: updated.words }, token);
    mutateMine();
  }

  const filteredMine = useMemo(() => {
    if (!mine) return [];
    if (!query.trim()) return mine;
    const q = query.toLowerCase();
    return mine.filter(s => s.name.toLowerCase().includes(q));
  }, [mine, query]);
  const filteredPub = useMemo(() => {
    if (!pub) return [];
    if (!query.trim()) return pub;
    const q = query.toLowerCase();
    return pub.filter(s => s.name.toLowerCase().includes(q));
  }, [pub, query]);

  // ---------- Not logged in ----------
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: `radial-gradient(1200px 600px at 20% -10%, #f8f4ea 0%, ${PAPER} 55%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: sysFont }}>
        <div style={{ textAlign: 'center', maxWidth: 360, background: CARD, border: `1px solid ${LINE}`, borderRadius: 22, padding: '40px 30px', boxShadow: '0 10px 40px rgba(27,36,32,.08)' }}>
          <div style={{ marginBottom: 16 }}><QMark size={44} /></div>
          <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 8 }}>Querencia · Vocab</div>
          <h1 style={{ fontFamily: serifFont, fontSize: 22, marginBottom: 10, fontWeight: 500 }}>Học từ vựng, theo cách của bạn</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24, lineHeight: 1.6 }}>
            Tải bộ từ vựng riêng lên (Excel, CSV, Markdown), học bằng thuật toán lặp lại ngắt quãng SM-2, và chia sẻ với người khác nếu muốn.
          </p>
          <button onClick={() => signIn('google')} style={{
            padding: '13px 24px', borderRadius: 12, border: 'none', background: SAGE,
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', width: '100%',
          }}>Tiếp tục với Google</button>
        </div>
      </div>
    );
  }

  if (activeSet) {
    return <StudyView set={activeSet} mode={studyMode} setMode={setStudyMode} onBack={() => setActiveSet(null)} onSave={saveEditedSet} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(1000px 500px at 15% -10%, #f8f4ea 0%, ${PAPER} 55%)`, fontFamily: sysFont }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '28px 20px 80px' }}>

        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <QMark size={24} />
            <div style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700 }}>Querencia · Vocab</div>
          </div>
          <h1 style={{ fontFamily: serifFont, fontSize: 24, fontWeight: 500, margin: 0 }}>Học từ vựng</h1>
        </div>

        {/* Search + upload trigger */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <input
            type="text" placeholder="🔍 Tìm bộ từ..." value={query} onChange={e => setQuery(e.target.value)}
            style={{ flex: 1, padding: '11px 14px', borderRadius: 12, border: `1px solid ${LINE}`, background: CARD, fontSize: 13.5, fontFamily: 'inherit' }}
          />
          <button onClick={() => setShowUpload(s => !s)} style={{
            padding: '11px 18px', borderRadius: 12, border: 'none', background: showUpload ? SAGE_DARK : SAGE,
            color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{showUpload ? 'Đóng' : '+ Tải lên'}</button>
        </div>

        {/* Upload panel */}
        {showUpload && (
          <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 16, padding: 20, marginBottom: 20, animation: 'slideDown .2s ease' }}>
            <h3 style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>Tải bộ từ mới</h3>

            {/* Column format guide */}
            <div style={{ background: '#f3efe6', border: `1px solid ${LINE}`, borderRadius: 10, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: SAGE_DARK, marginBottom: 8 }}>📋 File cần có đúng các cột sau (theo thứ tự):</div>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1.4fr', gap: 4, fontSize: 11, marginBottom: 8 }}>
                <div style={{ fontWeight: 700, color: MUTED }}>STT</div>
                <div style={{ fontWeight: 700, color: MUTED }}>Từ vựng</div>
                <div style={{ fontWeight: 700, color: MUTED }}>Loại từ</div>
                <div style={{ fontWeight: 700, color: MUTED }}>Nghĩa</div>
                <div style={{ color: INK }}>1</div>
                <div style={{ color: INK }}>example</div>
                <div style={{ color: INK }}>n</div>
                <div style={{ color: INK }}>ví dụ</div>
              </div>
              <p style={{ fontSize: 10.5, color: MUTED, margin: '0 0 8px', lineHeight: 1.5 }}>
                Cột <strong>STT</strong> có thể bỏ qua (không bắt buộc). Dòng tiêu đề đầu tiên sẽ tự động bị bỏ qua khi đọc file.
              </p>
              <button onClick={downloadTemplate} style={{
                fontSize: 11.5, fontWeight: 700, color: SAGE_DARK, background: 'transparent',
                border: `1px solid ${SAGE}`, borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
              }}>⬇ Tải file mẫu (.xlsx)</button>
            </div>

            <input
              type="text" placeholder="Tên bộ từ (vd: Passage 1 - 416 từ)" value={name} onChange={e => setName(e.target.value)}
              style={{ width: '100%', padding: 11, borderRadius: 10, border: `1px solid ${LINE}`, marginBottom: 10, fontFamily: 'inherit', fontSize: 13.5 }}
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 14, cursor: 'pointer', color: MUTED }}>
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
              🌍 Công khai — mọi người xem và học được bộ từ này
            </label>
            <label style={{
              display: 'block', border: `1.5px dashed ${LINE}`, borderRadius: 12, padding: '20px', textAlign: 'center',
              cursor: uploading ? 'default' : 'pointer', fontSize: 13, color: MUTED, opacity: uploading ? .6 : 1,
            }}>
              <input
                ref={fileRef} type="file" accept=".xlsx,.xls,.csv,.md,.txt" disabled={uploading}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
                style={{ display: 'none' }}
              />
              📄 {uploading ? 'Đang xử lý...' : 'Bấm để chọn file (.xlsx, .csv, .md, .txt)'}
            </label>
            {uploadMsg && <p style={{ fontSize: 12.5, color: uploadMsg.startsWith('Lỗi') ? '#a4453a' : SAGE, marginTop: 10, fontWeight: 600 }}>{uploadMsg}</p>}
            <p style={{ fontSize: 10.5, color: '#999', marginTop: 8 }}>Giới hạn {MAX_WORDS.toLocaleString('vi-VN')} từ / bộ.</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          <button onClick={() => setTab('mine')} style={tabStyle(tab === 'mine')}>Bộ từ của tôi {mine ? `(${mine.length})` : ''}</button>
          <button onClick={() => setTab('explore')} style={tabStyle(tab === 'explore')}>Khám phá {pub ? `(${pub.length})` : ''}</button>
        </div>

        {tab === 'mine' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!mine || filteredMine.length === 0 ? (
              <EmptyState text={mine && mine.length > 0 ? 'Không tìm thấy bộ từ khớp.' : 'Chưa có bộ từ nào — bấm "+ Tải lên" để bắt đầu.'} />
            ) : filteredMine.map(s => (
              <SetCard key={s.id} s={s} mine onStudy={() => openStudy(s, true)} onTogglePublic={() => togglePublic(s)} onDelete={() => deleteSet(s)} />
            ))}
          </div>
        )}

        {tab === 'explore' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!pub || filteredPub.length === 0 ? (
              <EmptyState text="Chưa có bộ từ công khai nào phù hợp." />
            ) : filteredPub.map(s => (
              <SetCard key={s.id} s={s} mine={false} onStudy={() => openStudy(s, false)} />
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

const sysFont = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif";
const serifFont = "'Iowan Old Style','Palatino Linotype',Georgia,serif";

function tabStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1, padding: '10px 6px', borderRadius: 12, fontSize: 13, fontWeight: 700,
    border: `1px solid ${active ? SAGE : LINE}`, background: active ? SAGE : CARD,
    color: active ? '#fff' : MUTED, cursor: 'pointer', transition: 'all .15s',
  };
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: MUTED, fontSize: 13.5, background: CARD, border: `1px solid ${LINE}`, borderRadius: 16 }}>
      {text}
    </div>
  );
}

function SetCard({ s, mine, onStudy, onTogglePublic, onDelete }: {
  s: VocabSetMeta; mine: boolean; onStudy: () => void; onTogglePublic?: () => void; onDelete?: () => void;
}) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
      padding: '14px 16px', background: CARD, border: `1px solid ${LINE}`, borderRadius: 16,
      transition: 'box-shadow .15s',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
        <div style={{ fontSize: 11.5, color: MUTED, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>{s.wordCount.toLocaleString('vi-VN')} từ</span>
          {mine && <><span>·</span><span>{s.isPublic ? '🌍 Public' : '🔒 Private'}</span></>}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button onClick={onStudy} style={{ padding: '8px 14px', borderRadius: 10, border: 'none', background: SAGE, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Học</button>
        {mine && onTogglePublic && (
          <button onClick={onTogglePublic} title={s.isPublic ? 'Đặt Private' : 'Đặt Public'} style={{
            width: 34, height: 34, borderRadius: 10, border: `1px solid ${LINE}`, background: 'transparent', cursor: 'pointer', fontSize: 14,
          }}>{s.isPublic ? '🌍' : '🔒'}</button>
        )}
        {mine && onDelete && (
          <button onClick={onDelete} title="Xoá" style={{ width: 34, height: 34, borderRadius: 10, border: `1px solid ${LINE}`, background: 'transparent', color: '#a4453a', cursor: 'pointer', fontSize: 14 }}>✕</button>
        )}
      </div>
    </div>
  );
}

// ================= Study View =================
function StudyView({ set, mode, setMode, onBack, onSave }: {
  set: VocabSetDetail; mode: 'flip' | 'quiz'; setMode: (m: 'flip' | 'quiz') => void;
  onBack: () => void; onSave: (s: VocabSetDetail) => void;
}) {
  const storeKey = `querencia_vocab_srs_${set.id}`;
  const storeRef = useRef<Record<string, SRSCard>>({});

  function persist() { try { localStorage.setItem(storeKey, JSON.stringify(storeRef.current)); } catch {} }
  function cardOf(idx: number): SRSCard {
    const key = String(idx);
    if (!storeRef.current[key]) storeRef.current[key] = { ef: 2.5, interval: 0, reps: 0, due: Date.now(), learned: false };
    return storeRef.current[key];
  }

  const [words, setWords] = useState(set.words);


  // Load SRS data từ localStorage sau khi mount (tránh hydration mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) storeRef.current = JSON.parse(raw);
    } catch {}
  }, [storeKey]);
  const [queue, setQueue] = useState<number[]>(() => buildQueue());
  const [current, setCurrent] = useState<number | null>(queue[0] ?? null);
  const [flipped, setFlipped] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);

  const dueCount = words.filter((_, i) => { const c = cardOf(i); return c.due <= Date.now() && c.reps > 0; }).length;
  const learnedCount = words.filter((_, i) => cardOf(i).learned).length;
  const total = words.length;

  function buildQueue(): number[] {
    const now = Date.now();
    const idxs = words.map((_, i) => i);
    const due = idxs.filter(i => { const c = cardOf(i); return c.due <= now && c.reps > 0; });
    const fresh = idxs.filter(i => cardOf(i).reps === 0);
    const later = idxs.filter(i => { const c = cardOf(i); return c.due > now && c.reps > 0; });
    return shuffle(due).concat(shuffle(fresh)).concat(shuffle(later));
  }

  function next() {
    const q = queue.slice(1);
    setQueue(q); setCurrent(q[0] ?? null); setFlipped(false); setDragX(0);
  }
  function grade(q: number) {
    if (current === null) return;
    sm2(cardOf(current), q); persist(); next();
  }

  function onDown(clientX: number) { setDragging(true); moved.current = false; startX.current = clientX; }
  function onMove(clientX: number) {
    if (!dragging) return;
    const dx = clientX - startX.current;
    if (Math.abs(dx) > 6) moved.current = true;
    setDragX(dx);
  }
  function onUp() {
    if (!dragging) return;
    setDragging(false);
    if (Math.abs(dragX) > 80) {
      const dir = dragX > 0 ? 1 : -1;
      setDragX(dir * 600);
      setTimeout(() => grade(dir > 0 ? 4 : 1), 180);
    } else {
      if (!moved.current) setFlipped(f => !f);
      setDragX(0);
    }
  }

  const word = current !== null ? words[current] : null;
  const distractors = useMemo(() => {
    if (current === null) return [];
    return shuffle(words.filter((_, i) => i !== current).map(w => w.m)).slice(0, 3);
  }, [current, words]);
  const options = useMemo(() => word ? shuffle([word.m, ...distractors]) : [], [word, distractors]);
  const [answered, setAnswered] = useState<string | null>(null);

  function handleQuizPick(opt: string) {
    if (answered || current === null) return;
    setAnswered(opt);
    const correct = word && opt === word.m;
    sm2(cardOf(current), correct ? 4 : 1); persist();
    setTimeout(() => { setAnswered(null); next(); }, correct ? 500 : 1000);
  }

  function handleEditSave(newWords: typeof words) {
    setWords(newWords);
    onSave({ ...set, words: newWords, wordCount: newWords.length });
    setEditOpen(false);
    setQueue(buildQueue());
  }

  return (
    <div style={{ minHeight: '100vh', background: `radial-gradient(1000px 500px at 15% -10%, #f8f4ea 0%, ${PAPER} 55%)`, fontFamily: sysFont, display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 480, width: '100%', margin: '0 auto', padding: '20px 18px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <button onClick={onBack} style={{ border: 'none', background: 'none', fontSize: 13, color: SAGE, cursor: 'pointer', fontWeight: 700 }}>← Quay lại</button>
          <button onClick={() => setEditOpen(true)} style={{ border: 'none', background: 'none', fontSize: 13, color: MUTED, cursor: 'pointer' }}>✏️ Sửa từ</button>
        </div>
        <div style={{ fontFamily: serifFont, fontSize: 17, fontWeight: 500, marginBottom: 14, textAlign: 'center' }}>{set.name}</div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <StatChip label="Cần ôn" value={dueCount} />
          <StatChip label="Đã thuộc" value={learnedCount} />
          <StatChip label="Tổng số" value={total} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
          <button onClick={() => setMode('flip')} style={tabStyle(mode === 'flip')}>Lật thẻ</button>
          <button onClick={() => setMode('quiz')} style={tabStyle(mode === 'quiz')}>Trắc nghiệm</button>
        </div>

        {!word ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: MUTED }}>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🎉</div>
            <p style={{ fontFamily: serifFont, fontSize: 17 }}>Hết từ cần ôn trong bộ này!</p>
          </div>
        ) : mode === 'flip' ? (
          <>
            <div
              onMouseDown={e => onDown(e.clientX)}
              onMouseMove={e => onMove(e.clientX)}
              onMouseUp={onUp}
              onMouseLeave={() => dragging && onUp()}
              onTouchStart={e => onDown(e.touches[0].clientX)}
              onTouchMove={e => onMove(e.touches[0].clientX)}
              onTouchEnd={onUp}
              style={{
                position: 'relative', flex: 1, minHeight: 300, marginBottom: 18,
                perspective: 1400, cursor: 'grab', touchAction: 'none',
              }}
            >
              <div style={{
                position: 'absolute', left: 20, top: 20, padding: '6px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase',
                color: '#a4453a', border: '2px solid #a4453a', transform: 'rotate(-8deg)',
                opacity: dragX < 0 ? Math.min(Math.abs(dragX) / 90, 1) : 0, transition: dragging ? 'none' : 'opacity .2s', zIndex: 2,
              }}>Quên</div>
              <div style={{
                position: 'absolute', right: 20, top: 20, padding: '6px 14px', borderRadius: 8,
                fontSize: 12, fontWeight: 800, letterSpacing: '.06em', textTransform: 'uppercase',
                color: SAGE_DARK, border: `2px solid ${SAGE_DARK}`, transform: 'rotate(8deg)',
                opacity: dragX > 0 ? Math.min(Math.abs(dragX) / 90, 1) : 0, transition: dragging ? 'none' : 'opacity .2s', zIndex: 2,
              }}>Nhớ</div>

              <div style={{
                position: 'absolute', inset: 0, borderRadius: 22, border: `1px solid ${LINE}`, background: CARD,
                boxShadow: '0 2px 4px rgba(27,36,32,.06), 0 14px 30px rgba(27,36,32,.10)',
                transformStyle: 'preserve-3d',
                transform: `translateX(${dragX}px) rotate(${dragX / 22}deg) rotateY(${flipped ? 180 : 0}deg)`,
                transition: dragging ? 'none' : 'transform .4s cubic-bezier(.3,.9,.4,1)',
              }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 22, backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 16 }}>Từ vựng</div>
                  <div style={{ fontFamily: serifFont, fontSize: 32, fontWeight: 600 }}>{word.w}</div>
                  {word.p && <div style={{ fontSize: 12, color: MUTED, fontStyle: 'italic', marginTop: 10 }}>{word.p}</div>}
                  <div style={{ position: 'absolute', bottom: 16, fontSize: 10.5, color: MUTED }}>Chạm để xem nghĩa · vuốt để ôn nhanh</div>
                </div>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 22, backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
                  background: SAGE, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#e7d6b3', fontWeight: 700, marginBottom: 16 }}>Nghĩa</div>
                  <div style={{ fontFamily: serifFont, fontSize: 22, fontWeight: 500 }}>{word.m}</div>
                  <div style={{ position: 'absolute', bottom: 16, fontSize: 10.5, color: 'rgba(255,255,255,.7)' }}>Chạm để lật lại</div>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => grade(1)} style={gradeBtn('#a4453a')}>Quên<small> &lt;1 ph</small></button>
              <button onClick={() => grade(3)} style={gradeBtn('#c07a3e')}>Khó<small> ôn sớm</small></button>
              <button onClick={() => grade(4)} style={gradeBtn(SAGE)}>Nhớ<small> vài ngày</small></button>
              <button onClick={() => grade(5)} style={gradeBtn(SAGE_DARK)}>Dễ<small> lâu hơn</small></button>
            </div>
          </>
        ) : (
          <>
            <div style={{ background: CARD, border: `1px solid ${LINE}`, borderRadius: 18, padding: 26, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 10.5, letterSpacing: '.14em', textTransform: 'uppercase', color: GOLD, fontWeight: 700, marginBottom: 12 }}>Chọn nghĩa đúng</div>
              <div style={{ fontFamily: serifFont, fontSize: 28, fontWeight: 600 }}>{word.w}</div>
              {word.p && <div style={{ fontSize: 12, color: MUTED, marginTop: 6, fontStyle: 'italic' }}>{word.p}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {options.map(opt => {
                let bg = CARD, border = LINE;
                if (answered) {
                  if (opt === word.m) { bg = '#dcead8'; border = SAGE; }
                  else if (opt === answered) { bg = '#f6dedb'; border = '#a4453a'; }
                }
                return (
                  <button key={opt} onClick={() => handleQuizPick(opt)} style={{
                    textAlign: 'left', padding: 15, borderRadius: 13, border: `1.5px solid ${border}`,
                    background: bg, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                  }}>{opt}</button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {editOpen && <EditWordsModal words={words} onCancel={() => setEditOpen(false)} onSave={handleEditSave} />}
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ flex: 1, background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: SAGE_DARK, fontFamily: serifFont }}>{value}</div>
      <div style={{ fontSize: 9.5, color: MUTED, textTransform: 'uppercase', letterSpacing: '.05em' }}>{label}</div>
    </div>
  );
}
function gradeBtn(bg: string): React.CSSProperties {
  return { flex: 1, border: 'none', borderRadius: 14, padding: '13px 4px', fontSize: 12.5, fontWeight: 700, color: '#fff', background: bg, cursor: 'pointer' };
}

// ================= Edit Words Modal =================
function EditWordsModal({ words, onCancel, onSave }: {
  words: VocabWord[]; onCancel: () => void; onSave: (w: VocabWord[]) => void;
}) {
  const [rows, setRows] = useState(words.map(w => ({ ...w })));
  const [filter, setFilter] = useState('');
  const visible = filter.trim() ? rows.filter(r => r.w.toLowerCase().includes(filter.toLowerCase())) : rows;

  function updateRow(idx: number, field: 'w' | 'p' | 'm', value: string) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }
  function removeRow(idx: number) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }
  function addRow() {
    setRows(prev => [{ w: '', p: '', m: '' }, ...prev]);
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(27,36,32,.5)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: PAPER, borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 480, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '18px 20px 10px', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, background: LINE, borderRadius: 99, margin: '0 auto 14px' }} />
          <h3 style={{ fontFamily: serifFont, fontSize: 17, margin: '0 0 10px' }}>Sửa từ vựng ({rows.length})</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input placeholder="🔍 Lọc từ..." value={filter} onChange={e => setFilter(e.target.value)}
              style={{ flex: 1, padding: 9, borderRadius: 9, border: `1px solid ${LINE}`, fontSize: 12.5, fontFamily: 'inherit' }} />
            <button onClick={addRow} style={{ padding: '9px 14px', borderRadius: 9, border: 'none', background: SAGE, color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer' }}>+ Thêm</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }}>
          {visible.map((r, i) => {
            const realIdx = rows.indexOf(r);
            return (
              <div key={realIdx} style={{ display: 'flex', gap: 6, marginBottom: 8, alignItems: 'center' }}>
                <input value={r.w} onChange={e => updateRow(realIdx, 'w', e.target.value)} placeholder="Từ"
                  style={{ flex: 2, padding: 8, borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 12.5, fontFamily: 'inherit' }} />
                <input value={r.p ?? ''} onChange={e => updateRow(realIdx, 'p', e.target.value)} placeholder="Loại"
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 12.5, fontFamily: 'inherit' }} />
                <input value={r.m} onChange={e => updateRow(realIdx, 'm', e.target.value)} placeholder="Nghĩa"
                  style={{ flex: 3, padding: 8, borderRadius: 8, border: `1px solid ${LINE}`, fontSize: 12.5, fontFamily: 'inherit' }} />
                <button onClick={() => removeRow(realIdx)} style={{ border: 'none', background: 'none', color: '#a4453a', fontSize: 16, cursor: 'pointer', flexShrink: 0 }}>✕</button>
              </div>
            );
          })}
        </div>
        <div style={{ padding: 16, display: 'flex', gap: 10, flexShrink: 0, borderTop: `1px solid ${LINE}` }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${LINE}`, background: 'transparent', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Huỷ</button>
          <button onClick={() => onSave(rows.filter(r => r.w.trim() && r.m.trim()))} style={{ flex: 2, padding: 12, borderRadius: 10, border: 'none', background: SAGE, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Lưu thay đổi</button>
        </div>
      </div>
    </div>
  );
}
