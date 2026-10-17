# Voice-First Agentic Soundbox: Product and Build Spec

HackSprint 2026 (SDG MIT Bengaluru) · Solo build, 18 hours · Hero merchant: kirana store

A voice-only, agentic soundbox that listens at a kirana counter, builds the bill, tracks stock and udhaar, translates between owner and customer, and speaks only when it matters.

## Principles

- Voice only: no touch or buttons. The display shows only the QR, transcript, alerts and answers.
- Ambient: the agent stays silent by default and acts on clear intent.
- Owner in control: the QR appears only when the owner asks; risky actions get a spoken confirmation.
- Indian languages first: every language Sarvam supports, auto-detected per utterance, with code-mixed speech as the normal case.

## Conversation: “Chote!”

- Two modes. Ambient: no wake word, it listens, builds carts and stays silent. Active: after “Chote!” the owner talks to it directly, like Siri or Google, but as a real back-and-forth.
- No dead air. A Talker agent handles the voice: it answers at once (“done”, “one second”), can be interrupted mid-sentence, and never waits on tools. A Doer agent runs in the background with the tools and hands results back, which the Talker speaks at the next natural gap.
- It understands loose speech from context: “remove that”, “same as yesterday for Ramesh”, “add ten more”. The owner never has to spell everything out.
- Replies are short and in the owner’s language.

## Multiple customers at once

Each customer is a session with its own cart, language and voice. Sessions never mix, and every session is kept in history with its items and outcome (paid, credit, cancelled).

| Situation | What Chote does |
| --- | --- |
| Two customers order together | Separate lanes on the display; items go to whoever said them (voice first, then name and context). If unsure, it asks the owner quietly: “rice for whom?” |
| Owner serves someone else first | “Pehle isko” parks the current session and focuses on the other. The parked cart waits and resumes later intact. |
| Customer cancels or walks away | Asks the owner once, then voids or parks it. Nothing is lost from history. |
| Customer changes the order | The correction applies to that customer’s cart only. |
| Item not available | Owner says it is out; the item is removed, stock is marked empty, and an alternative is offered. |
| Wrong attribution | “That’s his” moves the item to the right session. |
| Shared bill | “Same bill” merges two sessions. |
| Returning customer | Recognized by consented voice or by name; shows usual order and khata balance. |

## Proactive help

- When a new voice appears, the display quietly shows what helps: a regular’s usual order and balance, or a low-stock heads-up. It does not speak over a conversation.
- Daily digest on request or at closing: feedback themes, slow movers, items customers asked for but the shop lacks, and one or two suggestions to improve the business.
- Audio only, no camera. Voiceprints are stored only for customers who agree.

## Features

| Feature | Behavior | Done when |
| --- | --- | --- |
| Order and QR | Live cart from speech, handles corrections (“make it 2 oils, remove sugar”). Owner says “QR” and a UPI QR for the total appears. | Order with one correction gives the right total and QR |
| Inventory | Auto-decrement on sale; “10 kg rice aaya” adds stock; low-stock alert; stock queries by voice. | Sale reduces stock; query returns the right number |
| Khata (udhaar) | “Put it on Ramesh’s khata”, “Ramesh paid 200”; balance queries. | Credit and repayment change the balance correctly |
| Translation | Any Sarvam-supported language pair, auto-detected per utterance; the other side’s speech is translated on screen, in parallel with order capture. | Translation shown within about 2 seconds |
| Feedback | Customer remarks stored by item and sentiment; owner asks “what are customers saying?” | Two remarks stored and summarized |
| GST | Per-item rates, tax logged per sale; weekly taxable value and tax by rate on request. | Summary equals sum of logged tax |
| Security | Rules plus LLM check: unusually large bill, repeated credit, “payment done” with no payment event, pressure to skip the bill. Alert on screen with reason. | Scripted fraud case raises an alert |

## Extra features

Build the first three first; khata trust score, restock suggestions, monthly repeat and seasonal nudges are stretch.

- Value counter: “Chote, how did I do?” shows what it did for the shop this week: udhaar recovered, stock-outs caught, billing minutes saved, GST tracked.
- Fake payment guard: Chote trusts only a real payment event. If a customer says “paid” or shows a screen, it tells the owner “payment not received yet” and keeps the bill open.
- Voice-only setup: the owner says “rice 60, sugar 45, Tata salt 28” and Chote builds the catalog and prices, reading them back to confirm.
- Replayable demo mode: Chote can take audio from recorded files instead of the live mic, switched by a hotkey on Laptop A. If the hall is noisy, the rest of the system still runs live.
- Closing routine: “Chote, closing” gives cash versus UPI totals, who still owes, what to restock for tomorrow, and the day’s value summary.
- Credit limit warning: when a customer asks for udhaar, the display quietly warns if they are over their usual limit or have not repaid recently.
- Smarter khata: a simple trust score from repayment history, and a reminder message in the customer’s own language (simulated WhatsApp for the demo).
- Restock suggestions: spots fast and slow sellers, drafts a reorder message to the distributor, and warns when an item sells below cost.
- Monthly repeat: “Same as last month for Sharma ji” rebuilds the cart from history and flags price or stock changes.
- Seasonal nudges: before festivals such as Diwali, Eid or Ugadi, suggests stocking what usually sells, based on past sales (seed some history for the demo).
- Local units and slang: paav, seer, aadha kilo, ek darjan and brand shorthand map to catalog items through aliases.

## Architecture

Laptop B is a web page that receives JSON events from Laptop A over the local network. No video streaming.

```
Laptop A (Bun server, logs)
  Mics or recorded audio (demo mode) -> VAD + wake word "Chote" (always on)
  -> voice ID: owner / customer A / customer B
  -> Sarvam STT (streaming, any supported language) -> {session, speaker, lang, text}
  -> Talker (voice agent): speaks, confirms, translates, never waits for tools
  -> Doer (Gemini, function calling): background, runs per utterance
     -> sessions + tools update SQLite -> events broadcast

Laptop B (browser, /display)
  Three.js soundbox + a lane per customer (cart, QR, alerts) + audio out
```

- Stack: Bun + TypeScript, bun:sqlite, Sarvam (STT, translation, TTS), Gemini for the Doer plus a fast streaming voice setup for the Talker, Vite + Three.js, `qrcode` for the UPI link.
- Talker and Doer share session state through events. Owner speech cuts off the Talker (barge-in).
- Doer context: open sessions with carts, last 10 to 15 segments per speaker, relevant stock and ledger facts. Every tool call is logged to the Laptop A dashboard.
- Speaker: separate mics per person if possible, plus voice embeddings and language as extra signals. Do not rely on live diarization alone.
- Tools: `session_open`, `session_close`, `session_pause`, `session_resume`, `session_reassign`, `session_merge`, `cart_add`, `cart_remove`, `mark_unavailable`, `generate_qr`, `close_sale`, `stock_update`, `stock_query`, `ledger_add`, `ledger_pay`, `ledger_query`, `feedback_add`, `feedback_summary`, `gst_summary`, `translate`, `flag_risk`, verify\_payment, catalog\_setup, value\_summary, khata\_remind, restock\_suggest, closing\_report, repeat\_order, credit\_check, season\_suggest, `speak`.
- Tables: items, customers, sessions, sales, sale\_items, ledger, feedback, utterances, events\_log, alerts, voiceprints (opt-in). Seed about 30 kirana items and 3 to 5 customers.

## Build order (18 hours)

1. Keys, Sarvam STT test in Hindi and Kannada, wake word “Chote” (2h)
2. Mic, VAD, WebSocket, live transcript, recorded-audio demo mode (2h)
3. Talker and Doer loop with cart tools and QR (4h)
4. Sessions: voice ID, multi-customer carts, park, resume, cancel (3h)
5. Laptop B display, Three.js model, lanes per customer (2.5h)
6. Inventory and khata with seed data, including local unit and slang aliases (2h)
7. Translation across languages (1.5h)
8. GST, feedback digest, security rules with the fake payment guard and credit limit warning (1.5h)
9. Value counter, closing routine and voice-only catalog setup (2h)
10. Stretch: khata trust score and reminders, restock suggestions, monthly repeat, seasonal nudges

The steps above add up to about 21 hours before the stretch step, so steps 8 to 10 are the first to shrink. Cut first: step 10, then feedback, then GST Q&A, then the LLM security check. Never cut: wake word, Talker and Doer split, multi-customer sessions, voice to QR, khata, translation.

## Open items

- Languages for the live demo (support all Sarvam languages in code; pick two or three to show)
- Stage mic setup, and whether each customer gets a mic
- How payment confirmation is simulated (voice or key press)
- Talker voice model choice and wake word engine for “Chote” (verify current options)
- Sarvam model names, language list and streaming limits
