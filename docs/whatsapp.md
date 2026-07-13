# WhatsApp

## The rule

**Supabase is the source of truth. WhatsApp is a channel.**

An order exists because it is in the database. The conversation is how the studio and the founder pick it up afterwards — and if WhatsApp never opens, the order is still real, still stored, and still has a reference the studio can find it by.

## Architecture

```
OrderScene ──► order-store ──► order-service ──► POST /api/orders
                   │                                    │
                   │                                    ├─► order-repository ──► Supabase (INSERT ... RETURNING *)
                   │                                    │
                   │                                    └─► whatsapp/message.ts  ← built from the STORED ROW
                   │                                            + env number
                   │                                    ◄── { order, whatsapp: { number, message, reference } }
                   ▼
              whatsapp-service ──► whatsapp/link.ts ──► opens the conversation
```

| File | Role |
| --- | --- |
| `lib/whatsapp/message.ts` | Builds the message. Pure, server-safe, takes a **stored order**. |
| `lib/whatsapp/link.ts` | Builds every WhatsApp URL in the codebase. Nothing else ever assembles one. |
| `lib/services/whatsapp-service.ts` | Client-side. Decides *how* to open the conversation on this device, and reports honestly when it cannot. |

No component builds a URL. No component knows the number exists.

## The message is built from the row, not the form

The message is assembled **on the server, from what Postgres returned after the insert** — not from the payload the browser sent.

That matters: by then the phone has been normalised to `+9665…`, every choice has been checked against the ids we actually offer, and the check constraints have run. Anything the client claimed and the database rejected is, correctly, not in the message. A tampered payload cannot put a fake package or a fake price in front of the studio.

```
السلام عليكم، أرسلت طلبًا عبر منصة ترجمان.

رقم الطلب: TRJ-1A2B3C4D
المشروع: …
الاسم: …
الجوال: +9665…

النشاط: متجر
الشخصية: فاخر
الأسلوب: بسيط
الاتجاه: الاتجاه الأساسي
الباقة: الاحترافية (600 ريال)

ملاحظات: …            ← only when the founder wrote some

تم إنشاء هذا الطلب عبر منصة ترجمان.
```

It is written in the founder's voice, because the founder is the one sending it.

## The order reference

The primary key is a uuid: correct for a database, useless in a chat. Nobody reads one out loud and nobody re-types one.

So the database also generates a short reference — `TRJ-1A2B3C4D` — in the table's own default, so every row has one, including any written by hand in the SQL editor. That is the number the studio and the founder say to each other.

## Why the window is reserved during the click

A window opened after an `await` is not attributable to the founder's click, and every browser blocks it as a pop-up. So:

1. **During the click** (synchronously, inside `submitOrder`) the store reserves a blank tab.
2. The order is submitted and stored.
3. **Only then** is that already-open tab pointed at WhatsApp — no new window is opened, so there is nothing to block.
4. If the order **fails**, the reserved tab is closed again. The founder never sees it.

If the reservation itself was refused, the service makes one honest second attempt, and if that is blocked too it returns a typed `blocked` failure rather than pretending.

## Device support

| Platform | Link |
| --- | --- |
| iPhone / Android | `https://wa.me/<number>?text=…` — hands off to the installed app, falls back to WhatsApp Web when there isn't one |
| Desktop | `https://web.whatsapp.com/send?phone=…&text=…` — wa.me on desktop is an extra hop through an interstitial |

WhatsApp being *absent* is not something a web page can detect. It doesn't need to: both links degrade to WhatsApp Web on their own.

## Failures

Typed, like everything else. `config` (no number configured) and `blocked` (the browser refused) are both surfaced through the form's **existing** error presentation — the same `role="alert"` line already approved for submission failures. Every message begins by confirming the order *was* saved, because it was:

> تم حفظ طلبك، لكن المتصفح منع فتح واتساب…

A WhatsApp failure never marks the order as failed, and never hides the confirmation panel.

## Environment

```
WHATSAPP_BUSINESS_NUMBER=966546040520
```

Server-only, E.164 without the `+`. The number is not a secret — it is on the studio's storefront — but it is not hardcoded either: it changes, and the code should not.
