// 手順書の見た目の部品：段階の進み具合、チェックリスト、合格時の紙吹雪。
const STAGES = [
  { title: "ブラウザと Google", icon: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>' },
  { title: "GitHub", icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>' },
  { title: "生成AI", icon: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>' },
  { title: "アバター", icon: '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01M15 9h.01"/>' },
  { title: "リポジトリ", icon: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' },
  { title: "プログラム", icon: '<path d="M16 18l6-6-6-6"/><path d="M8 6l-6 6 6 6"/>' },
];

function svg(inner) {
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
}

function renderProgress() {
  const current = Number(document.body.dataset.stage || 0);
  const nav = document.createElement("ol");
  nav.className = "progress";
  STAGES.forEach((s, i) => {
    const n = i + 1;
    const state = n < current ? "done" : n === current ? "now" : "todo";
    const li = document.createElement("li");
    li.className = state;
    li.innerHTML = `<span class="dot">${state === "done" ? svg('<path d="M5 12l5 5 9-10"/>') : svg(s.icon)}</span><span class="label">${n}. ${s.title}</span>`;
    nav.appendChild(li);
  });
  const anchor = document.querySelector(".stage-nav");
  anchor ? anchor.after(nav) : document.body.prepend(nav);
}

function setupChecklists() {
  document.querySelectorAll("ul.check").forEach((list) => {
    const key = `pp2026-check-${list.dataset.key}`;
    const saved = JSON.parse(localStorage.getItem(key) || "[]");
    const items = [...list.querySelectorAll("li")];
    const done = document.createElement("p");
    done.className = "check-done";
    done.textContent = "全部できました。グループの仲間の様子も見てみましょう。";
    list.after(done);

    const update = () => {
      const states = items.map((li) => li.querySelector("input").checked);
      localStorage.setItem(key, JSON.stringify(states));
      items.forEach((li, i) => li.classList.toggle("checked", states[i]));
      list.classList.toggle("all-done", states.every(Boolean));
    };

    items.forEach((li, i) => {
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = Boolean(saved[i]);
      box.addEventListener("change", update);
      const label = document.createElement("label");
      label.append(box, ...li.childNodes);
      li.append(label);
    });
    update();
  });
}

function celebrate() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const colors = ["#0a5c36", "#4ec96b", "#ffd166", "#ff6b6b", "#4ea8de", "#c77dff"];
  for (let i = 0; i < 80; i++) {
    const p = document.createElement("div");
    p.className = "confetti";
    p.style.left = `${Math.random() * 100}vw`;
    p.style.background = colors[i % colors.length];
    p.style.animationDelay = `${Math.random() * 0.3}s`;
    p.style.setProperty("--drift", `${(Math.random() - 0.5) * 40}vw`);
    p.style.setProperty("--spin", `${Math.random() * 1080}deg`);
    document.body.appendChild(p);
  }
}

function setupNextLinks() {
  document.querySelectorAll("a.next").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      celebrate();
      setTimeout(() => { window.location.href = a.href; }, 1400);
    });
  });
}

renderProgress();
setupChecklists();
setupNextLinks();
