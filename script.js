gsap.registerPlugin(ScrollTrigger);

const photos = [
  "f8dfd007-9603-409c-8123-ce9c0edfe13a.jpg",
  "ec53966a-32b2-4fe8-8e9c-e06dd1c9fb60.jpg",
  "b6a6c1e0-7a85-429c-a938-cdfd68a70b91.jpg",
  "a8fd61ca-2a5a-4205-a07d-68dd9e8b04e4.jpg",
  "8c784227-de4d-44bd-8ded-73d05bfbf140.jpg",
  "856cf469-8faa-4c38-8097-ff52e4606492.jpg",
  "813abd1d-a517-4684-9f05-55ca4cfae537.jpg",
  "7cfa1e87-838f-4ac5-96bb-ec3d9d2ce282.jpg",
  "79d1059d-daea-44ff-b1a5-eaf375de93fb.jpg",
  "780ee02d-278d-4c05-a7a7-b869849c80f4.jpg",
  "5cf39aeb-ab76-4c88-bc46-e82f8ce29d80.jpg",
  "4aa6f2f2-bc92-4239-be70-31d659c04f2d.jpg",
  "14cd6465-43d5-4ec5-91a4-1ed919901e99.jpg",
  "IMG_0055.JPG",
  "IMG_0056.JPG",
  "IMG_0057.JPG",
  "IMG_0061.JPG",
  "IMG_0205.JPG",
  "IMG_0210.JPG",
  "IMG_0224.JPG",
  "IMG_0238.JPG",
  "IMG_0239.JPG",
  "IMG_0240.JPG",
  "IMG_0241.JPG"
];

const videos = [
  "f96a4e48-4483-436c-92c5-7132df7411ef.mp4",
  "5b2431c2-4cf9-4fd1-aa70-336b19065ac7.mp4",
  "4e7a0b83-0b7a-4f9d-8a8f-291d427a5b86.mp4"
];

function build() {
  const m = document.querySelector(".masonry");
  if (m) {
    photos.forEach((s, i) => {
      const wrap = document.createElement("div");
      wrap.className = "item";
      const inner = document.createElement("div");
      inner.className = "item-inner";
      const img = document.createElement("img");
      img.src = s;
      img.loading = i < 6 ? "eager" : "lazy";
      img.decoding = "async";
      inner.appendChild(img);
      wrap.appendChild(inner);
      m.appendChild(wrap);
    });
  }
  const v = document.querySelectorAll(".v");
  v.forEach((el, idx) => {
    el.src = videos[idx % videos.length];
    el.load();
    el.play().catch(() => {});
  });
}

function reveals() {
  gsap.from(".title", {
    opacity: 0,
    y: 24,
    duration: 1,
    ease: "power2.out"
  });
  gsap.from(".sub", {
    opacity: 0,
    y: 16,
    duration: 1,
    delay: 0.1,
    ease: "power2.out"
  });

  gsap.utils.toArray(".item").forEach((el) => {
    const inner = el.querySelector(".item-inner");
    const img = el.querySelector("img");

    const rot = gsap.utils.random(-3, 3);
    const y = gsap.utils.random(20, 40);

    gsap.set(el, { clipPath: "inset(0 100% 0 0)", opacity: 0, y: y, rotation: rot });
    gsap.set(inner, { xPercent: 16 });
    gsap.set(img, { xPercent: -16, scale: 1.12 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 92%"
      }
    });

    tl.to(el, {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 1,
      ease: "back.out(1.15)"
    }).to(
      [inner, img],
      {
        xPercent: 0,
        scale: 1,
        duration: 1.25,
        ease: "power3.out"
      },
      "-=0.8"
    );
  });

  gsap.utils.toArray(".vitem").forEach((el) => {
    const video = el.querySelector("video");
    gsap.set(el, { clipPath: "inset(0 100% 0 0)", opacity: 0, y: 26 });
    gsap.set(video, { xPercent: -16, scale: 1.08 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: "top 93%"
      }
    });
    tl.to(el, {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      y: 0,
      duration: 0.95,
      ease: "back.out(1.12)"
    }).to(
      video,
      {
        xPercent: 0,
        scale: 1,
        duration: 1.25,
        ease: "power3.out"
      },
      "-=0.8"
    );
  });
}

const btn = document.getElementById("musicBtn");
const audio = document.getElementById("bgMusic");
let p = false;
function playM() {
  if (!audio) return;
  audio.muted = false;
  audio.volume = 1;
  audio.loop = true;
  const prom = audio.play();
  if (prom !== undefined) {
    prom.then(() => {
      p = true;
      btn.classList.add("playing");
    }).catch(() => {});
  }
}
btn.addEventListener("click", () => {
  if (p) {
    audio.pause();
    p = false;
    btn.classList.remove("playing");
  } else playM();
});
["touchstart", "mousedown", "keydown", "pointerdown"].forEach((e) => {
  window.addEventListener(e, playM, { once: true, passive: true });
});
setTimeout(playM, 400);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    audio.play().catch(() => {});
    document.querySelectorAll(".v").forEach((x) => x.play().catch(() => {}));
  }
});
window.addEventListener("load", () => {
  document.querySelectorAll(".v").forEach((x) => x.play().catch(() => {}));
});

function init() {
  build();
  reveals();
}
const mm = gsap.matchMedia();
mm.add("(prefers-reduced-motion: no-preference)", init);
mm.add("(prefers-reduced-motion: reduce)", () => {
  build();
  gsap.set(".title, .sub", { opacity: 1, y: 0 });
  gsap.set(".item, .vitem", { clipPath: "none", opacity: 1 });
  gsap.set(".item-inner, .item img, .vitem video", { xPercent: 0, scale: 1 });
  playM();
});


