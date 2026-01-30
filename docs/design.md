Below is a **clean, game-engine–style decomposition** of Balhousie.
I’ll keep it **conceptual, reusable, and implementation-agnostic** (no code yet).

---

# Balhousie – Isolated System Components (Pre-Dev Design)

Think in **layers**:

> **Generic Multiplayer Game Layer**
> → **Turn / Event System**
> → **Balhousie-specific Rules & Content**

You already identified **Gameroom** correctly. That’s component #1.

---

## 1. GameRoom (Generic – Reusable Across Games)

This is your **foundation**.

### Responsibilities

* Create / maintain a room
* Manage players
* Track host
* Handle join / leave
* Gate game start

### Core Concepts

* `room_id`
* `host_player_id`
* `players[]`
* `room_state` → `waiting | in_progress | ended`

### Player Model (minimal)

* `player_id`
* `display_name`
* `avatar_id`
* `is_host`
* `is_connected`

### Events

* Player joined
* Player left
* Host started game

⚠️ **Important separation**
GameRoom **must not** know:

* Game rules
* Tickets
* Taglines
* Claims

It only knows **who is here** and **when the game starts**.

You already nailed this 💯.

---

## 2. Identity & Presence System (Lightweight)

This is *not* auth. This is **session identity**.

### Responsibilities

* Name-based login (no password)
* Auto-assign avatar
* Maintain presence

### Rules

* Name uniqueness **within a room**
* Avatar assignment:

  * Random from pool OR deterministic hash(name)

### States

* Joined
* Disconnected
* Reconnected (same name)

This is reusable for **any casual multiplayer game**.

---

## 3. Game Orchestrator (Game Lifecycle Controller)

This is the **brain** that moves the game forward.

### Responsibilities

* Transition between phases
* Enforce order
* Emit game events

### Game Phases (for Balhousie)

1. Lobby
2. Ticket Assignment
3. Active Play
4. Claim Phase
5. Game End

### What it does NOT do

* Doesn’t know how a ticket works
* Doesn’t know what a tagline means

It just says:

> “We are now in Phase X.”

---

## 4. Content Engine (Bolhousie-Specific, Stateless)

This is where **brands & taglines live**, but *no players*.

### Responsibilities

* Maintain brand pool
* Maintain tagline pool
* Ensure 1-to-1 tagline → brand mapping
* Prevent duplicates in a game

### Entities

* Brand

  * id
  * name
* Tagline

  * id
  * text
  * brand_id

### Constraints

* One tagline maps to exactly one brand
* A brand can have multiple taglines (optional)

This engine can later support:

* Difficulty modes (Obscure Ads)
* Sector packs (Auto, FMCG, Tech)
* Era packs (90s, 2000s)

---

## 5. Ticket Generator (Deterministic, Isolated)

This is **extremely important to isolate**.

### Responsibilities

* Generate tickets from brand pool
* Ensure fairness
* Avoid overlaps if desired

### Inputs

* Brand pool
* Ticket size
* Game seed (optional)

### Outputs

* Ticket structure per player

### Why isolate this?

Because later you might want:

* Same ticket regeneration (debugging)
* Anti-cheat verification
* Replay support

Ticket Generator must be:

* **Pure**
* **Stateless**
* **Repeatable**

---

## 6. Caller System (Turn-Based Event Generator)

This replaces the “number caller”.

### Responsibilities

* Select next tagline
* Ensure no repeats
* Emit “tagline called” event

### Key Rule

The Caller:

* Knows the tagline
* Knows the brand
* **Never exposes the brand name directly**

### Modes

* Manual (host triggers next)
* Auto (timer-based)
* Performance mode (host reads)

---

## 7. Player Interaction Layer

This is what players can *do* during gameplay.

### Actions

* Mark ticket entry
* Make a claim
* Undo mark (optional)

### Constraints

* Cannot mark after claim lock
* Cannot claim same prize twice

This layer does not validate claims — it only **requests** them.

---

## 8. Claim Engine (Rules & Validation)

This is where most bugs happen if not isolated.

### Responsibilities

* Define winning patterns
* Track which claims are still available
* Validate claims against ticket state

### Claim Examples

* Teaser
* Prime Time
* Intermission
* Late Night
* Jackpot

### Validation Inputs

* Player ticket
* Called taglines so far
* Claimed patterns

### Outputs

* Claim accepted
* Claim rejected (reason)

---

## 9. State Synchronization Layer (Multiplayer Glue)

This keeps everyone in sync.

### Responsibilities

* Broadcast events:

  * Player joined
  * Tagline called
  * Claim accepted
* Resolve conflicts:

  * Two claims at same time
* Ensure host authority

Think of this as:

> “Single source of truth broadcaster”

---

## 10. Game State Store (Authoritative Snapshot)

Even if in-memory initially, conceptually isolate it.

### Stores

* Room state
* Player states
* Tickets
* Called dialogues
* Claims

This enables:

* Reconnect support
* Debugging
* Replay (later)

---

## 11. UI/UX Layer (Last, Not First)

Strictly consumes events & state.

### Views

* Lobby
* Player list
* Ticket view
* Tagline display
* Claim status

UI **never**:

* Validates rules
* Decides winners

---

## 12. What NOT to Build Initially (Very Important)

❌ Private rooms
❌ Authentication
❌ Chat
❌ Payments
❌ Spectators
❌ AI caller
❌ Animations

You are doing the right thing by **hardcoding the host**.

---

## High-Level Component Map

```
[ Identity ]
     ↓
[ GameRoom ]
     ↓
[ Game Orchestrator ]
     ↓
[ Content Engine ] ↔ [ Ticket Generator ]
     ↓
[ Caller System ]
     ↓
[ Player Actions ]
     ↓
[ Claim Engine ]
     ↓
[ State Store ]
     ↓
[ UI ]
```

---

## Final Thought (Important)

If you design these as **isolated boxes with clean inputs/outputs**, you can:

* Change frontend
* Change rules
* Add new games
* Add bots
  without rewriting everything.
