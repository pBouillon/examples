import { computed, Injectable, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { delay, Subject, tap } from "rxjs";

const MODAL_ANIMATION_DURATION_IN_MS = 400;

export type ModalState = {
  isOpen: boolean;
  isAnimating: boolean;
  animationState: "opening" | "closing" | "idle";
};

@Injectable()
export class ModalStore {
  readonly #state = signal<ModalState>({
    isOpen: false,
    isAnimating: false,
    animationState: "idle",
  });

  readonly isOpen = computed(() => this.#state().isOpen);
  readonly isAnimating = computed(() => this.#state().isAnimating);
  readonly animationState = computed(() => this.#state().animationState);
  readonly canClose = computed(() => this.isOpen() && !this.isAnimating());

  readonly #openModal$ = new Subject<void>();
  readonly #closeModal$ = new Subject<void>();

  constructor() {
    this.#openModal$
      .pipe(
        takeUntilDestroyed(),
        tap(() =>
          this.#state.set({
            isOpen: true,
            isAnimating: true,
            animationState: "opening",
          }),
        ),
        delay(MODAL_ANIMATION_DURATION_IN_MS),
        tap(() =>
          this.#state.update((state) => ({
            ...state,
            isAnimating: false,
            animationState: "idle",
          })),
        ),
      )
      .subscribe();

    this.#closeModal$
      .pipe(
        takeUntilDestroyed(),
        tap(() =>
          this.#state.update((state) => ({
            ...state,
            isAnimating: true,
            animationState: "closing",
          })),
        ),
        delay(MODAL_ANIMATION_DURATION_IN_MS),
        tap(() =>
          this.#state.set({
            isOpen: false,
            isAnimating: false,
            animationState: "idle",
          }),
        ),
      )
      .subscribe();
  }

  open(): void {
    if (!this.isOpen() && !this.isAnimating()) {
      this.#openModal$.next();
    }
  }

  close(): void {
    if (this.isOpen() && !this.isAnimating()) {
      this.#closeModal$.next();
    }
  }
}
