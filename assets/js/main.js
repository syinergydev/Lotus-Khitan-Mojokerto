(function () {
  var C = window.SITE_CONFIG || {};
  var DEFAULT_MSG = "Assalamualaikum, saya ingin berkonsultasi mengenai layanan khitan di Jagoan Sunat. Mohon informasi lebih lanjut. Terima kasih.";
  function waUrl(text, num) { return "https://wa.me/" + (num || C.wa) + "?text=" + encodeURIComponent(text || DEFAULT_MSG); }
  document.documentElement.classList.add("js");

  /* WhatsApp & tautan */
  document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waUrl(a.getAttribute("data-wa")); });
  document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:+" + C.wa; });
  document.querySelectorAll("[data-maps]").forEach(function (a) { a.href = C.mapsUrl; });
  document.querySelectorAll("[data-social]").forEach(function (a) {
    var u = C[a.getAttribute("data-social")];
    if (u) { a.href = u; a.target = "_blank"; a.rel = "noopener noreferrer"; }
    else { a.setAttribute("aria-disabled", "true"); a.removeAttribute("href"); }
  });

  /* Header & menu */
  var header = document.querySelector("header.site");
  var burger = document.querySelector(".burger");
  var mfull = document.getElementById("mfull");
  function setMenu(open) {
    if (!mfull) return;
    mfull.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (window.gsap && !reduce) {
      gsap.fromTo(mfull.querySelectorAll("a"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.6, ease: "power3.out", delay: 0.15 });
    } else mfull.querySelectorAll("a").forEach(function (a) { a.style.opacity = 1; a.style.transform = "none"; });
  }
  if (burger) burger.addEventListener("click", function () { setMenu(!mfull.classList.contains("open")); });
  if (mfull) mfull.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  var page = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("nav.menu a, #mfull a").forEach(function (a) {
    if (a.getAttribute("href") === page) a.classList.add("active");
  });
  var totop = document.querySelector(".totop");
  function onScroll() {
    if (header) header.classList.toggle("scrolled", window.scrollY > 16);
    if (totop) totop.classList.toggle("show", window.scrollY > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (totop) totop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = !!window.gsap && !!window.ScrollTrigger && !reduce;

  /* Pecah judul per kata untuk animasi */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w" style="display:inline-block;overflow:hidden;vertical-align:top"><span class="wi" style="display:inline-block">' + w + "&nbsp;</span></span>"; }).join("");
  });

  if (!hasGsap) {
    document.documentElement.classList.add("rv-fallback");
  } else {
    gsap.registerPlugin(ScrollTrigger);
    var ctx = gsap.context(function () {
      /* Hero masuk */
      var hero = document.querySelector(".hero");
      if (hero) {
        var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from(".hero .eyebrow", { y: 20, opacity: 0, duration: 0.8 })
          .from(".hero .wi", { yPercent: 110, duration: 1.1, stagger: 0.07 }, "-=0.5")
          .from(".hero .lead, .hero .chips, .hero .cta-row", { y: 26, opacity: 0, duration: 0.9, stagger: 0.12 }, "-=0.7")
          .from(".hero .media-frame", { scale: 0.86, opacity: 0, duration: 1.4, ease: "expo.out" }, "-=1.2")
          .from(".float-card", { y: 30, opacity: 0, stagger: 0.15, duration: 0.9 }, "-=0.9");
        gsap.to(".hero .media-frame", { yPercent: -6, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
      }
      /* Judul section */
      gsap.utils.toArray("section:not(.hero) [data-split]").forEach(function (h) {
        gsap.from(h.querySelectorAll(".wi"), { yPercent: 110, duration: 1, stagger: 0.05, ease: "power4.out", scrollTrigger: { trigger: h, start: "top 85%", once: true } });
      });
      /* Kartu & blok konten */
      gsap.utils.toArray(".rv").forEach(function (el) {
        var group = el.parentElement && el.parentElement.querySelectorAll(":scope > .rv");
        var delay = group && group.length > 1 ? Array.prototype.indexOf.call(group, el) * 0.1 : 0;
        gsap.fromTo(el, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: delay, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      });
      /* Foto: scale 0.85 -> 1 */
      gsap.utils.toArray(".round, .shot").forEach(function (el) {
        gsap.fromTo(el, { scale: 0.85, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });
      /* Parallax ringan */
      gsap.utils.toArray("[data-parallax]").forEach(function (el) {
        gsap.to(el, { yPercent: -10, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      /* Galeri horizontal (desktop) */
      var hs = document.querySelector(".hscroll");
      if (hs && window.innerWidth > 900) {
        var dist = function () { return hs.scrollWidth - window.innerWidth + 120; };
        gsap.to(hs, { x: function () { return -dist(); }, ease: "none", scrollTrigger: { trigger: ".hscroll-wrap", start: "top 20%", end: function () { return "+=" + dist(); }, pin: true, scrub: 0.8, invalidateOnRefresh: true } });
      }
      /* Footer */
      gsap.from(".foot-cta, .foot > div", { y: 50, opacity: 0, duration: 1, stagger: 0.12, scrollTrigger: { trigger: "footer.site", start: "top 90%", once: true } });
    });
    window.addEventListener("beforeunload", function () { ctx.revert(); });
  }

  /* Tombol WhatsApp magnetic (desktop) */
  if (!reduce && window.matchMedia("(pointer:fine)").matches) {
    document.querySelectorAll(".magnetic").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.25, y = (e.clientY - r.top - r.height / 2) * 0.35;
        b.style.transform = "translate(" + x + "px," + y + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* Filter & lightbox galeri */
  document.querySelectorAll(".filters button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filters button").forEach(function (x) { x.classList.toggle("on", x === btn); });
      var f = btn.getAttribute("data-f");
      document.querySelectorAll(".gi").forEach(function (g) { g.classList.toggle("hidden", f !== "all" && g.getAttribute("data-cat") !== f); });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });
  var lb = document.getElementById("lb");
  if (lb) {
    var shots = Array.prototype.slice.call(document.querySelectorAll(".shot[data-full]"));
    var idx = 0, img = lb.querySelector("img"), cap = lb.querySelector(".lb-cap");
    function show(i) {
      var visible = shots.filter(function (s) { return !s.closest(".gi.hidden"); });
      if (!visible.length) return;
      idx = (i + visible.length) % visible.length;
      img.src = visible[idx].getAttribute("data-full"); img.alt = visible[idx].getAttribute("data-alt") || "";
      if (cap) cap.textContent = visible[idx].getAttribute("data-alt") || "";
      window._vis = visible;
    }
    shots.forEach(function (s) { s.addEventListener("click", function () {
      var visible = shots.filter(function (x) { return !x.closest(".gi.hidden"); });
      show(visible.indexOf(s)); lb.showModal();
    }); });
    lb.querySelector(".lb-next").addEventListener("click", function () { show(idx + 1); });
    lb.querySelector(".lb-prev").addEventListener("click", function () { show(idx - 1); });
    lb.querySelector(".lb-close").addEventListener("click", function () { lb.close(); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.open) return;
      if (e.key === "ArrowRight") show(idx + 1);
      if (e.key === "ArrowLeft") show(idx - 1);
    });
  }

  /* FAQ: satu terbuka */
  document.querySelectorAll("details.faq").forEach(function (d) {
    d.addEventListener("toggle", function () {
      if (d.open) document.querySelectorAll("details.faq").forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* Formulir konsultasi & reservasi: validasi lalu buka WhatsApp */
  function validate(form) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (inp) {
      var grp = inp.closest(".field"); var valid = inp.value.trim() !== "";
      if (inp.type === "tel") valid = /^[0-9+\-\s()]{9,18}$/.test(inp.value.trim());
      if (grp) grp.classList.toggle("bad", !valid);
      if (!valid) ok = false;
    });
    return ok;
  }
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(form)) { var b = form.querySelector(".field.bad input,.field.bad select"); if (b) b.focus(); return; }
      var f = new FormData(form), lines = [form.getAttribute("data-intro")];
      f.forEach(function (v, k) { if (String(v).trim()) lines.push(form.querySelector('[name="' + k + '"]').getAttribute("data-label") + ": " + v); });
      lines.push("Mohon informasi lebih lanjut. Terima kasih.");
      window.open(waUrl(lines.join("\n")), "_blank", "noopener");
      var ok = form.querySelector(".form-ok"); if (ok) ok.style.display = "block";
    });
  });
})();
/* tambahan: email */
document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + (window.SITE_CONFIG || {}).mail; });
