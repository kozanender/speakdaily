// SpeakDaily ses tanıma: Whisper, tamamen tarayıcının içinde çalışır.
// Model ilk kullanımda bir kez indirilir ve tarayıcı önbelleğinde kalır; sonrası internetsiz çalışır.
import { pipeline, env } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1";

env.allowLocalModels = false;
env.useBrowserCache = true;

let asr = null;
let loading = null;
let modelId = null;

function load(model) {
  if (asr && modelId === model) return Promise.resolve(asr);
  if (loading && modelId === model) return loading;
  modelId = model;
  const files = {};
  loading = pipeline("automatic-speech-recognition", model, {
    dtype: "q8",
    device: "wasm",
    progress_callback: (p) => {
      if (p.status === "progress" && p.total) {
        files[p.file] = { loaded: p.loaded, total: p.total };
        let l = 0, t = 0;
        for (const f of Object.values(files)) { l += f.loaded; t += f.total; }
        postMessage({ type: "progress", percent: Math.round((l / t) * 100), mb: Math.round(t / 1048576) });
      }
    },
  }).then((p) => { asr = p; loading = null; return p; })
    .catch((e) => { loading = null; throw e; });
  return loading;
}

onmessage = async (e) => {
  const { type, id, audio, model } = e.data;
  try {
    if (type === "preload") {
      await load(model);
      postMessage({ type: "ready" });
      return;
    }
    if (type === "transcribe") {
      const p = await load(model);
      postMessage({ type: "ready" });
      const out = await p(audio, { chunk_length_s: 30 });
      postMessage({ type: "result", id, text: (out.text || "").trim() });
    }
  } catch (err) {
    postMessage({ type: "error", id, message: String((err && err.message) || err) });
  }
};
