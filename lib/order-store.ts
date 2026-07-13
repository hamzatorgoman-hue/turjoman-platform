"use client";

import { useSyncExternalStore } from "react";
import { EVENTS, track } from "./analytics";
import { setPlace } from "./monitoring";
import {
  EMPTY_DRAFT,
  buildOrderRequest,
  validateDraft,
  type OrderContext,
  type OrderDraft,
  type OrderErrors,
  type OrderField,
  type OrderRequest,
} from "./order";
import {
  submitOrderRequest,
  type OrderFailure,
  type SubmittedOrder,
} from "./services/order-service";
import {
  openWhatsApp,
  releaseWhatsAppWindow,
  reserveWhatsAppWindow,
  type WhatsAppWindow,
} from "./services/whatsapp-service";
import { detectPlatform } from "./whatsapp/link";

/**
 * Same lifecycle as every scene before it.
 *
 *   idle      → the founder is filling the form (or a send failed and can be retried)
 *   selecting → the request is in flight
 *   handoff   → the database has the order; `submitted` holds its id
 *
 * The store is the only thing in the app that knows an order can be *sent*. It
 * talks to the service layer and to nothing else — no component, and no store,
 * ever imports Supabase.
 *
 * `request` is deliberately not set until the insert succeeds: the scene shows
 * its confirmation when `request` exists, so it can only ever appear after the
 * order is genuinely in the database. An optimistic confirmation is a lie with
 * good intentions.
 *
 * WhatsApp is opened only after the order is stored, and only ever through the
 * WhatsApp service. The window is reserved during the click — see that file for
 * why — and closed again if the order never lands.
 */
export type OrderPhase = "idle" | "selecting" | "handoff";

export type OrderState = {
  draft: OrderDraft;
  errors: OrderErrors;
  /** Only fields the founder has left are marked, so the form never scolds early. */
  touched: Partial<Record<OrderField, boolean>>;
  /** Set only once the order is actually stored. */
  request: OrderRequest | null;
  submitted: SubmittedOrder | null;
  /** The last failure, typed. Shown in the form's existing error presentation. */
  failure: OrderFailure | null;
  /** Where the conversation was opened, when it was. */
  whatsappUrl: string | null;
  phase: OrderPhase;
};

const INITIAL: OrderState = {
  draft: EMPTY_DRAFT,
  errors: {},
  touched: {},
  request: null,
  submitted: null,
  failure: null,
  whatsappUrl: null,
  phase: "idle",
};

let state: OrderState = INITIAL;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function set(next: OrderState) {
  state = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): OrderState {
  return state;
}

function getServerSnapshot(): OrderState {
  return INITIAL;
}

export function useOrder(): OrderState {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Re-validate only what the founder has already left: correct as you go, never nag. */
function visibleErrors(
  draft: OrderDraft,
  touched: OrderState["touched"],
): OrderErrors {
  const all = validateDraft(draft);
  const errors: OrderErrors = {};
  for (const key of Object.keys(all) as OrderField[]) {
    if (touched[key]) errors[key] = all[key];
  }
  return errors;
}

export function setOrderField(field: OrderField, value: string) {
  const draft = { ...state.draft, [field]: value };
  set({
    ...state,
    draft,
    errors: visibleErrors(draft, state.touched),
    failure: null,
    phase: state.phase === "handoff" ? "handoff" : "idle",
  });
}

export function touchOrderField(field: OrderField) {
  const touched = { ...state.touched, [field]: true };
  set({ ...state, touched, errors: visibleErrors(state.draft, touched) });
}

async function send(
  request: OrderRequest,
  reserved: WhatsAppWindow,
  context: OrderContext,
) {
  const result = await submitOrderRequest(request);

  if (result.ok) {
    // The order is stored. Everything from here is the channel, not the record.
    setPlace({ reference: result.data.order.reference });

    track(EVENTS.orderSaved, {
      reference: result.data.order.reference,
      package: context.packageId,
    });

    const handoff = openWhatsApp(result.data.whatsapp, reserved);

    if (handoff.ok) {
      track(EVENTS.whatsappOpened, {
        reference: result.data.order.reference,
        platform: detectPlatform(),
      });
    } else {
      track(EVENTS.orderFailed, { failure_code: handoff.error.code });
    }

    set({
      ...state,
      request,
      submitted: result.data.order,
      // A WhatsApp that would not open is worth saying out loud: the founder has
      // been told the order is saved, and would otherwise sit waiting for a
      // conversation that never opened.
      failure: handoff.ok ? null : handoff.error,
      whatsappUrl: handoff.ok ? handoff.data.url : null,
      phase: "handoff",
    });

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent<{ order: OrderRequest; record: SubmittedOrder }>(
          "turjoman:order-submitted",
          { detail: { order: request, record: result.data.order } },
        ),
      );
    }
    return;
  }

  // A failed send returns the founder to a form they can fix and retry.
  track(EVENTS.orderFailed, { failure_code: result.error.code });
  releaseWhatsAppWindow(reserved);

  set({
    ...state,
    request: null,
    submitted: null,
    failure: result.error,
    errors: result.error.fields ?? state.errors,
    touched:
      result.error.code === "validation"
        ? { projectName: true, fullName: true, phone: true, notes: true }
        : state.touched,
    phase: "idle",
  });
}

/**
 * Validate, then submit through the service layer.
 *
 * Returns the first invalid field so the caller can move focus there — an error
 * nobody can find is not an error message. The send itself is fired and awaited
 * in the background; the store publishes the outcome.
 *
 * A second call while a send is in flight is ignored, so a double click cannot
 * create two orders even though the button is only disabled once the order is
 * confirmed.
 */
export function submitOrder(
  context: OrderContext,
  // Kept so the calling scene needs no change. The confirm beat used to be a
  // timer; it is now the round trip itself, which is both real and honest.
  _options?: { reduceMotion?: boolean },
): OrderField | null {
  if (state.phase === "selecting") return null;

  const errors = validateDraft(state.draft);
  const invalid = (Object.keys(errors) as OrderField[])[0] ?? null;

  if (invalid) {
    // Field *names* only. Which fields founders get wrong is a design signal;
    // what they typed into them is none of our business.
    track(EVENTS.validationFailed, {
      invalid_fields: (Object.keys(errors) as OrderField[]).join(","),
    });

    set({
      ...state,
      errors,
      touched: { projectName: true, fullName: true, phone: true, notes: true },
      failure: null,
      phase: "idle",
    });
    return invalid;
  }

  const request = buildOrderRequest(state.draft, context);

  track(EVENTS.orderSubmitted, { package: context.packageId });

  // Reserved here, synchronously, while the founder's click is still live: a
  // window opened after the round trip is a pop-up, and browsers block those.
  const reserved = reserveWhatsAppWindow();

  set({
    ...state,
    errors: {},
    request: null,
    submitted: null,
    failure: null,
    whatsappUrl: null,
    phase: "selecting",
  });
  void send(request, reserved, context);

  return null;
}

export function resetOrder() {
  set(INITIAL);
}
