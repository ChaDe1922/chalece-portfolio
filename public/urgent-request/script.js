/* =========================================================================
   The Urgent Request controller (vanilla JS, no framework, no dependencies)

   7-screen state machine (title → learn → scenario → decision → kc → anatomy
   → results) plus small reusable interaction modules: tabs, comparison slider,
   hotspots, countdown, confetti.

   LOCKED (do not edit): the email, the three choices, the three coaching layers,
   the KC prompt/options/feedback, the takeaways, the closing + conditional
   messages, and the rules: score set only on Choice C; A/B return to choices;
   KC exact-match, one retry then always advance, no third attempt, no per-item
   markers; complete fires once at results, not gated on score.
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------- Helpers ------------------------------ */
  var $ = function (sel, ctx) {
    return (ctx || document).querySelector(sel);
  };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };
  var REDUCE = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  /* ------------------------------- State -------------------------------- */
  var DEFAULTS = {
    currentScreen: "title",
    score: 0,
    kcAttempts: 0,
    kcPassed: false,
    visibleLayer: "none", // none | A | B | C
    reported: false,
    completed: false,
  };
  var state = Object.assign({}, DEFAULTS);
  var reportReset = null; // assigned by initReportComposer

  // Knowledge check: each real flag must land in the bin whose key matches it;
  // the two decoys ("invoice", "signoff") must be left unplaced.
  var REAL_FLAGS = ["urgency", "secrecy", "domain", "money"];
  var BIN_LABELS = {
    urgency: "Urgency",
    secrecy: "Secrecy",
    domain: "Fake sender",
    money: "Money request",
  };
  var PHRASE_TEXT = {}; // flag -> phrase text, captured once at init
  var placement = {}; // flag -> bin key
  var pending = null; // flag currently picked up, awaiting a box
  var kcFrozen = false;

  // Order = stepper order. Spot the flags, see why (anatomy), decide, then report.
  var SCREENS = ["title", "learn", "scenario", "kc", "anatomy", "decision", "report", "results"];
  var HEADING = {
    title: "title-heading",
    learn: "learn-heading",
    scenario: "scenario-heading",
    decision: "decision-heading",
    kc: "kc-heading",
    anatomy: "anatomy-heading",
    report: "report-heading",
    results: "results-heading",
  };

  /* ----------------------------- Elements ------------------------------- */
  var sections = $$("[data-screen]");
  var steps = $$(".step");
  var navback = $("#navback");
  var maxReached = 0; // highest SCREENS index visited; bounds backward navigation

  var decisionChoices = $("#decision-choices");
  var layers = { A: $("#layer-A"), B: $("#layer-B"), C: $("#layer-C") };

  var kcForm = $("#kc-form");
  var kcSubmit = $("#kc-submit");
  var kcContinue = $("#kc-continue");
  var kcFeedback = $("#kc-feedback");

  var verdictEl = $("#results-verdict");
  var badgeEl = $("#badge");
  var processEl = $(".process");
  var confettiEl = $("#confetti");

  var laptopNotif = $("#laptop-notif");
  var laptopEmail = $("#laptop-email");
  var deskStage = $(".deskscene__stage");
  var deskPhoto = $(".deskscene__photo");
  var scenarioCaption = $("#scenario-caption");
  var scenarioActions = $("#scenario-actions");
  var countdownEl = $("#countdown");
  var emailOpened = false;

  var countdownTimer = null;
  var countdownRemaining = 15 * 60;
  var confettiTimer = null;
  var notifyTimer = null;

  /* ------------------------------- Audio -------------------------------- */
  // A short synthesized "ding" for the message arrival: no asset, no license.
  // Unlocked on the first user gesture so autoplay policy allows later plays.
  var audioCtx = null;
  function unlockAudio() {
    if (audioCtx) return;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch (e) {
      audioCtx = null;
    }
  }
  function playDing() {
    if (!audioCtx) return;
    try {
      if (audioCtx.state === "suspended") audioCtx.resume();
      var now = audioCtx.currentTime;
      [{ f: 880, t: 0 }, { f: 1320, t: 0.09 }].forEach(function (n) {
        var osc = audioCtx.createOscillator();
        var gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = n.f;
        gain.gain.setValueAtTime(0.0001, now + n.t);
        gain.gain.exponentialRampToValueAtTime(0.12, now + n.t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + 0.5);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + 0.55);
      });
    } catch (e) {}
  }
  function initAudio() {
    function unlock() {
      unlockAudio();
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    }
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
  }

  /* -------------------------- Screen controller ------------------------- */
  var transitioning = false;

  function visibleSection() {
    for (var i = 0; i < sections.length; i++) {
      if (!sections[i].hidden) return sections[i];
    }
    return null;
  }

  function sectionFor(name) {
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getAttribute("data-screen") === name) return sections[i];
    }
    return null;
  }

  // Sequenced exit -> enter transition (a more dramatic intro/outro on every screen).
  function showScreen(name, immediate) {
    if (transitioning) return;
    var goingFrom = visibleSection();
    if (
      REDUCE ||
      immediate ||
      !goingFrom ||
      typeof goingFrom.animate !== "function" ||
      goingFrom.getAttribute("data-screen") === name
    ) {
      swapTo(name, immediate);
      return;
    }
    transitioning = true;
    var exit = goingFrom.animate(
      [
        { opacity: 1, transform: "none" },
        { opacity: 0, transform: "translateY(-12px) scale(0.99)" },
      ],
      { duration: 300, easing: "ease-in", fill: "forwards" }
    );
    exit.onfinish = function () {
      transitioning = false;
      swapTo(name, false);
      exit.cancel();
    };
  }

  function swapTo(name, immediate) {
    stopCountdown();
    clearTimeout(notifyTimer); // cancel any pending notification arrival
    state.currentScreen = name;
    sections.forEach(function (sec) {
      sec.hidden = sec.getAttribute("data-screen") !== name;
    });
    updateStepper(name);
    if (name === "decision") resetDecisionToChoices();
    if (name === "scenario") enterScenario();
    if (name === "results") enterResults();

    var el = sectionFor(name);
    if (el && !immediate && !REDUCE && typeof el.animate === "function") {
      el.animate(
        [
          { opacity: 0, transform: "translateY(18px) scale(0.98)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 500, easing: "cubic-bezier(0.22,0.61,0.36,1)" }
      );
      var head = el.querySelector(".screen__title, .coaching__title, .kc__prompt");
      if (head) {
        head.animate(
          [
            { opacity: 0, transform: "translateY(10px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 560, delay: 130, easing: "ease-out", fill: "backwards" }
        );
      }
    }
    focusHeading(name);
  }

  function focusHeading(name) {
    var h = document.getElementById(HEADING[name]);
    if (h) h.focus();
  }

  function updateStepper(name) {
    var idx = SCREENS.indexOf(name);
    if (idx > maxReached) maxReached = idx;
    steps.forEach(function (el, i) {
      el.classList.toggle("is-done", i < idx);
      el.classList.toggle("is-current", i === idx);
      // Revisit any page reached so far; never jump forward past a gate.
      el.disabled = i > maxReached;
      if (i === idx) el.setAttribute("aria-current", "step");
      else el.removeAttribute("aria-current");
    });
    if (navback) navback.disabled = idx <= 0;
  }

  /* ----------------------------- Decision ------------------------------- */
  function resetDecisionToChoices() {
    state.visibleLayer = "none";
    if (decisionChoices) decisionChoices.hidden = false;
    Object.keys(layers).forEach(function (k) {
      if (layers[k]) layers[k].hidden = true;
    });
  }

  function onChoice(letter) {
    if (!layers[letter]) return;
    if (letter === "C") state.score = 1; // set only on Choice C; never decremented
    state.visibleLayer = letter;
    decisionChoices.hidden = true;
    Object.keys(layers).forEach(function (k) {
      layers[k].hidden = k !== letter;
    });
    var h = $("#layer-" + letter + "-heading");
    if (h) h.focus();
  }

  function tryAgain() {
    resetDecisionToChoices();
    var firstChoice = $(".choice");
    if (firstChoice) firstChoice.focus(); // return focus to the decision choices
  }

  /* ------------------ Knowledge check: sort red flags into bins --------- */
  function announceKc(msg) {
    var live = $("#kc-live");
    if (live) live.textContent = msg;
  }

  function renderKc() {
    $$(".select-flag").forEach(function (b) {
      var f = b.getAttribute("data-flag");
      var placed = placement[f];
      b.classList.toggle("is-pending", pending === f);
      b.classList.toggle("is-placed", !!placed);
      b.disabled = kcFrozen;
      b.setAttribute(
        "aria-label",
        PHRASE_TEXT[f] + (placed ? ", placed in " + BIN_LABELS[placed] : ", not placed")
      );
    });
    $$(".kc-bin").forEach(function (bin) {
      var key = bin.getAttribute("data-bin");
      bin.classList.toggle("is-target", !!pending && !kcFrozen);
      var label = bin.querySelector(".kc-bin__label");
      if (label) label.disabled = kcFrozen;
      var ul = bin.querySelector(".kc-bin__items");
      if (!ul) return;
      ul.innerHTML = "";
      Object.keys(placement).forEach(function (f) {
        if (placement[f] !== key) return;
        var li = document.createElement("li");
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "kc-chip";
        chip.setAttribute("data-flag", f);
        chip.disabled = kcFrozen;
        chip.setAttribute("aria-label", "Remove " + PHRASE_TEXT[f] + " from " + BIN_LABELS[key]);
        chip.appendChild(document.createTextNode(PHRASE_TEXT[f]));
        var x = document.createElement("span");
        x.className = "kc-chip__x";
        x.setAttribute("aria-hidden", "true");
        x.textContent = "×";
        chip.appendChild(x);
        li.appendChild(chip);
        ul.appendChild(li);
      });
    });
  }

  function pickUpFlag(flag) {
    if (kcFrozen) return;
    pending = pending === flag ? null : flag;
    renderKc();
    announceKc(
      pending
        ? "Picked up: " + PHRASE_TEXT[flag] + ". Choose a box, or select it again to cancel."
        : "Cancelled."
    );
  }

  function placeInBin(key) {
    if (kcFrozen || !pending) return;
    var f = pending;
    placement[f] = key;
    pending = null;
    renderKc();
    announceKc("Placed " + PHRASE_TEXT[f] + " in " + BIN_LABELS[key] + ".");
  }

  function removeFlag(flag) {
    if (kcFrozen || !placement[flag]) return;
    var was = BIN_LABELS[placement[flag]];
    delete placement[flag];
    if (pending === flag) pending = null;
    renderKc();
    announceKc("Removed " + PHRASE_TEXT[flag] + " from " + was + ".");
  }

  // Correct: each real flag sits in its own bin (bin key == flag key) and no
  // decoy ("invoice", "signoff") is placed anywhere.
  function isExactMatch() {
    if (Object.keys(placement).length !== REAL_FLAGS.length) return false;
    return REAL_FLAGS.every(function (f) {
      return placement[f] === f;
    });
  }

  function setFeedback(kind, text) {
    kcFeedback.setAttribute("data-state", kind);
    kcFeedback.textContent = text;
  }

  function finalizeKc() {
    // Freeze the graded sort (no per-item markers here; the Anatomy screen explains next).
    kcFrozen = true;
    pending = null;
    renderKc();
    kcSubmit.hidden = true;
    kcSubmit.disabled = true;
    kcContinue.hidden = false;
    kcContinue.focus();
  }

  function onKcSubmit(event) {
    event.preventDefault();
    if (state.kcAttempts >= 2 || kcSubmit.disabled) return; // no third attempt

    state.kcAttempts += 1;
    var exact = isExactMatch();
    if (exact) state.kcPassed = true;

    if (exact) {
      setFeedback(
        "pass",
        "Yes. Urgency, secrecy, a lookalike sender, and a money or data request are the classic combination."
      );
      finalizeKc();
      return;
    }

    // Directional guidance only; no per-item markers.
    setFeedback(
      "incomplete",
      "Not quite. Put each red flag in the box that says why it is suspicious, and leave the two normal lines out."
    );

    if (state.kcAttempts >= 2) {
      finalizeKc(); // second submission always advances, regardless of result
    }
  }

  function initKcSort() {
    var email = $(".kc-email");
    var bins = $$(".kc-bin");
    if (!email || !bins.length) return;
    var dragFlag = null;

    // Capture each phrase's clean text once, before any state rewrites it.
    $$(".select-flag").forEach(function (b) {
      PHRASE_TEXT[b.getAttribute("data-flag")] = b.textContent.trim();
    });

    email.addEventListener("click", function (e) {
      var p = e.target.closest(".select-flag");
      if (p && !p.disabled) pickUpFlag(p.getAttribute("data-flag"));
    });
    email.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && pending) {
        pending = null;
        renderKc();
        announceKc("Cancelled.");
      }
    });
    email.addEventListener("dragstart", function (e) {
      var p = e.target.closest(".select-flag");
      if (!p || p.disabled || kcFrozen) {
        if (e.preventDefault) e.preventDefault();
        return;
      }
      dragFlag = p.getAttribute("data-flag");
      pending = dragFlag;
      renderKc();
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", dragFlag);
      }
    });
    email.addEventListener("dragend", function () {
      dragFlag = null;
    });

    bins.forEach(function (bin) {
      var key = bin.getAttribute("data-bin");
      bin.addEventListener("click", function (e) {
        var chip = e.target.closest(".kc-chip");
        if (chip) {
          if (!chip.disabled) removeFlag(chip.getAttribute("data-flag"));
          return;
        }
        placeInBin(key); // places the pending phrase, or no-op when nothing is pending
      });
      bin.addEventListener("dragover", function (e) {
        if ((pending || dragFlag) && !kcFrozen) {
          e.preventDefault();
          bin.classList.add("is-dragover");
        }
      });
      bin.addEventListener("dragleave", function () {
        bin.classList.remove("is-dragover");
      });
      bin.addEventListener("drop", function (e) {
        e.preventDefault();
        bin.classList.remove("is-dragover");
        var f = dragFlag || (e.dataTransfer && e.dataTransfer.getData("text/plain"));
        dragFlag = null;
        if (!f || kcFrozen) return;
        placement[f] = key;
        pending = null;
        renderKc();
        announceKc("Placed " + PHRASE_TEXT[f] + " in " + BIN_LABELS[key] + ".");
      });
    });

    renderKc();
  }

  /* ------------------------------ Results ------------------------------- */
  function enterResults() {
    verdictEl.textContent =
      state.score === 1 ? "Nice work" : "Review the red flags and you have got it";
    var found = $("#recap-found");
    if (found) {
      found.textContent = state.kcPassed
        ? "You spotted all four red flags in the message: urgency, secrecy, a lookalike domain, and a money request."
        : "The four red flags were urgency, secrecy, a lookalike domain, and a money request.";
    }
    if (badgeEl) badgeEl.classList.add("is-drawn");
    if (processEl) processEl.classList.add("is-revealed");
    if (!REDUCE) launchConfetti();

    if (!state.completed) {
      state.completed = true;
      document.dispatchEvent(
        new CustomEvent("urgent-request:complete", {
          detail: { score: state.score, kcPassed: state.kcPassed },
        })
      );
      if (window.console && console.info) {
        console.info("[The Urgent Request] complete", {
          score: state.score,
          kcPassed: state.kcPassed,
        });
      }
    }
  }

  function launchConfetti() {
    if (!confettiEl) return;
    var colors = ["#6d5ae6", "#5b45cc", "#1f9d61", "#f0b429", "#d23b3b"];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < 48; i++) {
      var p = document.createElement("span");
      p.className = "confetti__piece";
      p.style.left = Math.random() * 100 + "%";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 1.8 + Math.random() * 1.4 + "s";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      frag.appendChild(p);
    }
    confettiEl.appendChild(frag);
    clearTimeout(confettiTimer);
    confettiTimer = setTimeout(function () {
      confettiEl.innerHTML = "";
    }, 4500);
  }

  /* -------------------- Scenario: the work-laptop scene ----------------- */
  // Phase 1: a notification pops in on the laptop screen.
  function showNotifyPhase() {
    if (deskStage) deskStage.classList.remove("is-reading");
    if (laptopEmail) laptopEmail.hidden = true;
    if (scenarioCaption) scenarioCaption.hidden = true;
    if (scenarioActions) scenarioActions.hidden = true;
    if (!laptopNotif) return;

    // The laptop sits empty for a beat; the notification arrives after a pause.
    laptopNotif.hidden = true;
    clearTimeout(notifyTimer);

    // The photo fades in slowly behind the wait.
    if (deskPhoto && !REDUCE && typeof deskPhoto.animate === "function") {
      deskPhoto.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: 900,
        easing: "ease-out",
      });
    }

    var delay = REDUCE ? 600 : 1000;
    notifyTimer = setTimeout(function () {
      laptopNotif.hidden = false;
      playDing(); // a short message-arrival sound
      if (!REDUCE && typeof laptopNotif.animate === "function") {
        laptopNotif.animate(
          [
            { opacity: 0, transform: "scale(0.85)" },
            { opacity: 1, transform: "scale(1.03)", offset: 0.7 },
            { opacity: 1, transform: "scale(1)" },
          ],
          { duration: 560, easing: "ease-out" }
        );
      }
      laptopNotif.focus();
    }, delay);
  }

  // Phase 2: the notification disappears and the email opens on the screen.
  function revealEmail(animate) {
    if (deskStage) deskStage.classList.add("is-reading");
    if (laptopNotif) laptopNotif.hidden = true;
    if (laptopEmail) laptopEmail.hidden = false;
    if (scenarioCaption) scenarioCaption.hidden = false;
    if (scenarioActions) scenarioActions.hidden = false;
    startCountdown();
    if (laptopEmail && animate && !REDUCE && typeof laptopEmail.animate === "function") {
      laptopEmail.animate(
        [
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 460, easing: "ease-out" }
      );
    }
    if (laptopEmail) laptopEmail.focus();
  }

  function openMail() {
    emailOpened = true;
    if (!laptopNotif || REDUCE || typeof laptopNotif.animate !== "function") {
      revealEmail(true);
      return;
    }
    var out = laptopNotif.animate(
      [
        { opacity: 1, transform: "scale(1)" },
        { opacity: 0, transform: "scale(0.9)" },
      ],
      { duration: 320, easing: "ease-in", fill: "forwards" }
    );
    out.onfinish = function () {
      revealEmail(true);
      out.cancel();
    };
  }

  function enterScenario() {
    stopCountdown();
    if (emailOpened) {
      revealEmail(false); // returning via Back: show the opened email directly
    } else {
      showNotifyPhase();
    }
  }

  function fmtCountdown(t) {
    var m = Math.floor(t / 60);
    var s = t % 60;
    return "Reply needed in " + m + ":" + (s < 10 ? "0" + s : s);
  }

  function startCountdown() {
    if (!countdownEl) return;
    countdownRemaining = 15 * 60;
    countdownEl.textContent = fmtCountdown(countdownRemaining);
    if (REDUCE) return; // static, no tick
    stopCountdown();
    countdownTimer = setInterval(function () {
      countdownRemaining -= 1;
      if (countdownRemaining <= 0) {
        countdownRemaining = 0;
        countdownEl.textContent = fmtCountdown(0);
        stopCountdown();
        return;
      }
      countdownEl.textContent = fmtCountdown(countdownRemaining);
    }, 1000);
  }

  function stopCountdown() {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  }

  /* ------------------- Interaction module: learn tabs ------------------- */
  // The Learn page: stylized WAI-ARIA tabs. All three labels stay visible; only
  // the panel switches. Tracks which tabs have been read and gates the
  // "See the message" button until all three are opened.
  function initLearnTabs(root) {
    if (!root) return { reset: function () {} };
    var tabs = $$('[role="tab"]', root);
    var panels = tabs.map(function (t) {
      return document.getElementById(t.getAttribute("aria-controls"));
    });
    var progressEl = $("#learn-progress");
    var gateBtn = $("#learn-continue");
    var gateHint = $("#learn-gate-hint");
    var total = tabs.length;
    var seen = {};

    function updateGate() {
      var count = 0;
      for (var k in seen) {
        if (seen.hasOwnProperty(k)) count += 1;
      }
      var done = count >= total;
      if (progressEl) {
        progressEl.textContent = done
          ? "All three read. You can continue."
          : count + " of " + total + " read";
      }
      if (!gateBtn) return;
      if (done && gateBtn.disabled) {
        gateBtn.disabled = false;
        gateBtn.classList.remove("is-locked");
        gateBtn.classList.add("is-unlocked");
        if (gateHint) gateHint.textContent = "You're all set.";
      } else if (!done) {
        gateBtn.disabled = true;
        gateBtn.classList.add("is-locked");
        gateBtn.classList.remove("is-unlocked");
        if (gateHint) gateHint.textContent = "Open all three tabs to continue.";
      }
    }

    function select(i, focus, animate) {
      tabs.forEach(function (t, idx) {
        var sel = idx === i;
        t.setAttribute("aria-selected", sel ? "true" : "false");
        t.tabIndex = sel ? 0 : -1;
        if (panels[idx]) panels[idx].hidden = !sel;
      });
      tabs[i].classList.add("is-read");
      seen[i] = true;
      if (focus) tabs[i].focus();
      var panel = panels[i];
      if (panel && animate && !REDUCE && typeof panel.animate === "function") {
        panel.animate(
          [
            { opacity: 0, transform: "translateY(8px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 380, easing: "ease-out" }
        );
      }
      updateGate();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { select(i, false, true); });
      t.addEventListener("keydown", function (e) {
        var ni = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") ni = (i + 1) % total;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") ni = (i - 1 + total) % total;
        else if (e.key === "Home") ni = 0;
        else if (e.key === "End") ni = total - 1;
        if (ni !== null) {
          e.preventDefault();
          select(ni, true, true);
        }
      });
    });

    function reset() {
      tabs.forEach(function (t) { t.classList.remove("is-read"); });
      seen = {};
      select(0, false, false);
    }

    select(0, false, false); // tab 1 shown and marked read on load
    return { reset: reset };
  }

  /* ----------------- Interaction module: address breakdown -------------- */
  function initAddress() {
    var btn = $("[data-addr-reveal]");
    var tip = $("#addr-tip");
    if (!btn || !tip) return { reset: function () {} };
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", open ? "false" : "true");
      tip.hidden = open;
    });
    return {
      reset: function () {
        btn.setAttribute("aria-expanded", "false");
        tip.hidden = true;
      },
    };
  }

  /* ---------------------- Interaction module: hotspots ------------------ */
  function initHotspots() {
    var spots = $$(".hotspot");
    var counter = $("#hotspot-counter");
    var found = {};
    var foundCount = 0;
    function updateCounter() {
      if (counter) counter.textContent = "Found " + foundCount + " of " + spots.length + " red flags.";
    }
    spots.forEach(function (btn) {
      var pop = document.getElementById(btn.getAttribute("aria-controls"));
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        btn.setAttribute("aria-expanded", open ? "false" : "true");
        if (pop) pop.hidden = open;
        if (!open) {
          btn.classList.add("is-found");
          var flag = btn.getAttribute("data-flag");
          if (!found[flag]) {
            found[flag] = true;
            foundCount += 1;
            updateCounter();
          }
        }
      });
    });
    updateCounter();
    return {
      reset: function () {
        found = {};
        foundCount = 0;
        spots.forEach(function (btn) {
          btn.setAttribute("aria-expanded", "false");
          btn.classList.remove("is-found");
          var pop = document.getElementById(btn.getAttribute("aria-controls"));
          if (pop) pop.hidden = true;
        });
        updateCounter();
      },
    };
  }

  /* ------------------------------ Restart ------------------------------- */
  function resetKc() {
    placement = {};
    pending = null;
    kcFrozen = false;
    renderKc();
    kcFeedback.textContent = "";
    kcFeedback.removeAttribute("data-state");
    kcSubmit.hidden = false;
    kcSubmit.disabled = false;
    kcContinue.hidden = true;
  }

  function restart() {
    state = Object.assign({}, DEFAULTS);
    resetKc();
    resetDecisionToChoices();
    if (reportReset) reportReset();
    if (verdictEl) verdictEl.textContent = "";
    if (badgeEl) badgeEl.classList.remove("is-drawn");
    if (processEl) processEl.classList.remove("is-revealed");
    if (confettiEl) confettiEl.innerHTML = "";
    clearTimeout(confettiTimer);
    clearTimeout(notifyTimer);
    stopCountdown();
    emailOpened = false;
    learnTabsCtl.reset();
    addressCtl.reset();
    hotspotsCtl.reset();
    maxReached = 0;
    showScreen("title");
  }

  /* ------------------------------ Wiring -------------------------------- */
  function onAction(event) {
    var trigger = event.target.closest("[data-action]");
    if (!trigger) return;
    switch (trigger.getAttribute("data-action")) {
      case "start":
        showScreen("learn");
        break;
      case "to-scenario":
        showScreen("scenario");
        break;
      case "to-decision":
        showScreen("decision");
        break;
      case "try-again":
        tryAgain();
        break;
      case "to-kc":
        showScreen("kc");
        break;
      case "to-anatomy":
        showScreen("anatomy");
        break;
      case "to-report":
        showScreen("report");
        break;
      case "to-results":
        showScreen("results");
        break;
      case "restart":
        restart();
        break;
    }
  }

  function onChoiceClick(event) {
    var btn = event.target.closest(".choice");
    if (!btn) return;
    onChoice(btn.getAttribute("data-choice"));
  }

  /* ----------- Report it: step-by-step drag-and-drop composer ----------- */
  // Three steps (To -> Subject -> Message). Drag (or tap/keyboard) the right
  // line into the active slot; only the correct line advances. Every option
  // carries a rationale; distractors are length-matched to the correct line.
  var REPORT_STEPS = [
    {
      field: "to",
      slot: "slot-to",
      prompt: "Who should receive this report?",
      options: [
        { text: "daniel.okafor@finance-corp-secure.com", correct: false, rationale: "That replies straight to the attacker and tips them off." },
        { text: "security@yourcompany.com", correct: true, rationale: "Right. Your security team can investigate, warn others, and block the sender." },
        { text: "everyone@yourcompany.com", correct: false, rationale: "Mass-emailing the company spreads alarm. Send it to security." },
      ],
    },
    {
      field: "subject",
      slot: "slot-subject",
      prompt: "Pick a clear subject line.",
      options: [
        { text: "Reporting a suspected phishing email", correct: true, rationale: "Clear and accurate, so security can triage it fast." },
        { text: "Re: Need this handled in the next 15 minutes", correct: false, rationale: "Replying keeps the attacker in the thread. Start fresh." },
        { text: "Urgent: approved the vendor wire transfer", correct: false, rationale: "False, and it signals you acted. Report, do not confirm." },
      ],
    },
    {
      field: "body",
      slot: "slot-body",
      prompt: "What should the message say?",
      options: [
        { text: "I clicked the link to check whether it was a real message before flagging it.", correct: false, rationale: "Never click to test. Report it without interacting." },
        { text: "Here are the company card details so your team can verify the request is legitimate.", correct: false, rationale: "Never put card details in a report. Describe, do not expose." },
        { text: "I received a suspicious message from a lookalike address asking me to wire money. I did not reply, click, or pay.", correct: true, rationale: "Exactly. It states the facts and confirms you did not act." },
      ],
    },
  ];
  var REPORT_PLACEHOLDER = {
    to: "Drag the recipient here",
    subject: "Drag the subject here",
    body: "Drag the message here",
  };

  function initReportComposer() {
    var compose = $("#report-compose");
    var sent = $("#report-sent");
    if (!compose || !sent) return;
    var stepEl = $("#report-step");
    var promptEl = $("#report-prompt");
    var optionsEl = $("#report-options");
    var noteEl = $("#report-note");
    var nextBtn = $("#report-next");
    var live = $("#report-live");

    var stepIdx = 0;
    var picked = {}; // field -> chosen correct text
    var dragIndex = null;

    function announce(msg) {
      if (live) live.textContent = msg;
    }
    function setNote(kind, text) {
      noteEl.textContent = text || "";
      noteEl.classList.toggle("is-ok", kind === "ok");
      noteEl.classList.toggle("is-warn", kind === "warn");
    }

    function renderTemplate() {
      REPORT_STEPS.forEach(function (s, i) {
        var row = compose.querySelector('.compose__row[data-slot="' + s.field + '"]');
        var slot = document.getElementById(s.slot);
        if (!row || !slot) return;
        row.classList.remove("is-dragover");
        if (picked[s.field]) {
          row.setAttribute("data-state", "done");
          slot.textContent = picked[s.field];
        } else if (i === stepIdx) {
          row.setAttribute("data-state", "active");
          slot.textContent = REPORT_PLACEHOLDER[s.field];
        } else {
          row.setAttribute("data-state", "locked");
          slot.textContent = "";
        }
      });
    }

    function renderStep() {
      var step = REPORT_STEPS[stepIdx];
      stepEl.textContent = "Step " + (stepIdx + 1) + " of " + REPORT_STEPS.length;
      promptEl.textContent = step.prompt;
      setNote(null, "");
      nextBtn.hidden = true;
      renderTemplate();
      optionsEl.innerHTML = "";
      step.options.forEach(function (opt, i) {
        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "report-chip";
        chip.setAttribute("draggable", "true");
        chip.setAttribute("data-index", String(i));
        chip.textContent = opt.text;
        optionsEl.appendChild(chip);
      });
    }

    function attempt(i) {
      var step = REPORT_STEPS[stepIdx];
      var opt = step.options[i];
      if (!opt) return;
      if (opt.correct) {
        picked[step.field] = opt.text;
        setNote("ok", opt.rationale);
        announce("Correct. " + opt.rationale);
        optionsEl.querySelectorAll(".report-chip").forEach(function (c) {
          c.disabled = true;
          c.classList.toggle("is-chosen", +c.getAttribute("data-index") === i);
        });
        renderTemplate();
        nextBtn.hidden = false;
        if (stepIdx === REPORT_STEPS.length - 1) {
          nextBtn.textContent = "Send report";
          nextBtn.setAttribute("data-mode", "send");
        } else {
          nextBtn.textContent = "Next";
          nextBtn.setAttribute("data-mode", "next");
        }
        nextBtn.focus();
      } else {
        setNote("warn", opt.rationale);
        announce(opt.rationale);
        var chip = optionsEl.querySelector('.report-chip[data-index="' + i + '"]');
        if (chip) chip.classList.add("is-wrong");
      }
    }

    function sendReport() {
      state.reported = true;
      compose.hidden = true;
      sent.hidden = false;
      if (!REDUCE) sent.classList.add("is-playing");
      var cont = $("#report-continue");
      if (cont) cont.focus();
    }

    optionsEl.addEventListener("click", function (e) {
      var chip = e.target.closest(".report-chip");
      if (chip && !chip.disabled) attempt(+chip.getAttribute("data-index"));
    });
    optionsEl.addEventListener("dragstart", function (e) {
      var chip = e.target.closest(".report-chip");
      if (!chip || chip.disabled) {
        if (e.preventDefault) e.preventDefault();
        return;
      }
      dragIndex = +chip.getAttribute("data-index");
      chip.classList.add("is-dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(dragIndex));
      }
    });
    optionsEl.addEventListener("dragend", function (e) {
      var chip = e.target.closest(".report-chip");
      if (chip) chip.classList.remove("is-dragging");
      dragIndex = null;
    });
    compose.addEventListener("dragover", function (e) {
      var row = e.target.closest('.compose__row[data-state="active"]');
      if (row && dragIndex !== null) {
        e.preventDefault();
        row.classList.add("is-dragover");
      }
    });
    compose.addEventListener("dragleave", function (e) {
      var row = e.target.closest(".compose__row");
      if (row) row.classList.remove("is-dragover");
    });
    compose.addEventListener("drop", function (e) {
      var row = e.target.closest('.compose__row[data-state="active"]');
      if (!row) return;
      e.preventDefault();
      row.classList.remove("is-dragover");
      var idx = dragIndex;
      if (idx === null && e.dataTransfer) idx = parseInt(e.dataTransfer.getData("text/plain"), 10);
      dragIndex = null;
      if (idx !== null && !isNaN(idx)) attempt(idx);
    });

    nextBtn.addEventListener("click", function () {
      if (nextBtn.getAttribute("data-mode") === "send") sendReport();
      else {
        stepIdx += 1;
        renderStep();
      }
    });

    reportReset = function () {
      stepIdx = 0;
      picked = {};
      dragIndex = null;
      compose.hidden = false;
      sent.hidden = true;
      sent.classList.remove("is-playing");
      renderStep();
    };
    reportReset();
  }

  // Cover icon: rests as static faded rings. It pulses (smooth ease-in/out loop)
  // during a short intro on load and whenever the cursor is near, speeding up as
  // it gets closer. Activation/deactivation ease via the ring's CSS transition,
  // so there is no abrupt start or cut. A click pops it. Static under reduced motion.
  function initPing() {
    var ping = $(".ping");
    if (!ping || REDUCE) return;
    var FOLLOW = 320; // px radius the cursor influences
    var prox = 0;
    var introActive = true;
    var curTier = null;

    // SVG elements have no offsetParent/offsetWidth; use a layout read instead.
    function visible() {
      return ping.getBoundingClientRect().width > 0; // 0 when the title screen is hidden
    }
    function durFor(p) {
      return p > 0.66 ? "0.9s" : p > 0.33 ? "1.4s" : "2.2s";
    }

    document.addEventListener("pointermove", function (e) {
      var r = ping.getBoundingClientRect();
      if (!r.width) {
        prox = 0;
        return;
      }
      var dx = e.clientX - (r.left + r.width / 2);
      var dy = e.clientY - (r.top + r.height / 2);
      var d = Math.sqrt(dx * dx + dy * dy);
      prox = Math.max(0, Math.min(1, 1 - d / FOLLOW));
    });

    function loop() {
      var near = prox > 0.1;
      if (visible() && (introActive || near)) {
        ping.classList.add("is-active");
        var tier = durFor(near ? prox : 0.5); // intro pulses at a medium speed
        if (tier !== curTier) {
          ping.style.setProperty("--pulse-dur", tier);
          curTier = tier;
        }
      } else {
        ping.classList.remove("is-active"); // eases back to rest via the CSS transition
      }
      setTimeout(loop, 160);
    }

    ping.addEventListener("click", function () {
      ping.classList.remove("is-pop");
      void ping.getBoundingClientRect();
      ping.classList.add("is-pop");
    });
    ping.addEventListener("animationend", function (e) {
      if (e.animationName === "ping-pop") ping.classList.remove("is-pop");
    });

    // Start: pulse for a few seconds on arrival, then settle to rest.
    setTimeout(function () {
      introActive = false;
    }, 3200);
    loop();
  }

  // Click-word "bloom": clicking a highlighted key word spawns a soft halo and
  // a gentle pop (ported from the portfolio). Decorative; under reduced motion
  // it does nothing, matching the portfolio's early return.
  function initClickWords() {
    $$(".click-word").forEach(function (btn) {
      var danger = btn.classList.contains("click-word--danger");
      btn.addEventListener("click", function () {
        // "red flags" turns red and stays red (works even under reduced motion).
        if (danger) btn.classList.add("is-red");
        if (REDUCE) return;
        var text = btn.querySelector(".click-word-text");
        if (text) {
          text.removeAttribute("data-pop");
          void text.offsetWidth; // restart the pop if clicked again
          text.setAttribute("data-pop", "");
        }
        var bloom = document.createElement("span");
        bloom.className = danger ? "click-word-bloom click-word-bloom--danger" : "click-word-bloom";
        bloom.setAttribute("aria-hidden", "true");
        bloom.addEventListener("animationend", function () {
          if (bloom.parentNode) bloom.parentNode.removeChild(bloom);
        });
        btn.insertBefore(bloom, btn.firstChild);
      });
    });
  }

  // Light/dark toggle. Shares the portfolio's localStorage key ("theme") so the
  // choice carries across, and follows the OS while no explicit choice is set.
  function initTheme() {
    var btn = $("#navtheme");
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
    function stored() {
      try {
        return localStorage.getItem("theme");
      } catch (e) {
        return null;
      }
    }
    function apply(dark) {
      var root = document.documentElement;
      root.classList.add("no-transition");
      root.classList.toggle("dark", dark);
      void root.offsetWidth; // flush, then re-enable transitions
      root.classList.remove("no-transition");
    }
    if (btn) {
      btn.addEventListener("click", function () {
        var dark = !document.documentElement.classList.contains("dark");
        apply(dark);
        try {
          localStorage.setItem("theme", dark ? "dark" : "light");
        } catch (e) {}
      });
    }
    if (mq) {
      var onChange = function () {
        if (!stored()) apply(mq.matches);
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  }

  document.addEventListener("click", onAction);
  var choicesGroup = $(".choices");
  if (choicesGroup) choicesGroup.addEventListener("click", onChoiceClick);
  if (kcForm) kcForm.addEventListener("submit", onKcSubmit);
  if (laptopNotif) laptopNotif.addEventListener("click", openMail);

  // Page navigation: Back button + clickable progress bar (bounded by maxReached).
  if (navback)
    navback.addEventListener("click", function () {
      var idx = SCREENS.indexOf(state.currentScreen);
      if (idx > 0) showScreen(SCREENS[idx - 1]);
    });
  steps.forEach(function (el, i) {
    el.addEventListener("click", function () {
      if (i <= maxReached) showScreen(SCREENS[i]);
    });
  });

  var learnTabsCtl = initLearnTabs($("[data-learn-tabs]"));
  var addressCtl = initAddress();
  var hotspotsCtl = initHotspots();
  initKcSort();
  initClickWords();
  initReportComposer();
  initPing();
  initAudio();
  initTheme();

  // Initial state: animate the title screen in; all others hidden, stepper at step 1.
  swapTo("title");
})();
