import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  afterNextRender,
  booleanAttribute,
  effect,
  inject,
  input,
  output,
} from "@angular/core";

import { ModalStore } from "./modal.store";

@Component({
  selector: "app-modal",
  template: `
    <dialog #dialog (click)="overlayClicked($event)" [open]="store.isOpen()">
      <article>
        <header>
          <button aria-label="Close" rel="prev" (click)="close.emit()"></button>
          <h3>Confirm your action!</h3>
        </header>

        <p>
          Cras sit amet maximus risus. Pellentesque sodales odio sit amet augue finibus
          pellentesque. Nullam finibus risus non semper euismod.
        </p>

        <footer>
          <button class="secondary" (click)="close.emit()">Cancel</button>
          <button (click)="close.emit()">Confirm</button>
        </footer>
      </article>
    </dialog>
  `,
  providers: [ModalStore],
  host: {
    "(document:keydown.escape)": "handleEscapeKey()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly #htmlEl: HTMLElement = inject(DOCUMENT).documentElement;
  protected readonly store = inject(ModalStore);

  readonly open = input.required({ transform: booleanAttribute });
  readonly close = output();

  constructor() {
    effect(() => {
      const shouldOpen = this.open();
      if (shouldOpen !== this.store.isOpen()) {
        shouldOpen ? this.store.open() : this.store.close();
      }
    });

    effect(() => {
      const state = this.store.animationState();
      const isOpen = this.store.isOpen();

      // Remove all modal classes first
      this.#htmlEl.classList.remove("modal-is-open", "modal-is-opening", "modal-is-closing");

      // Add appropriate classes based on state
      if (isOpen) {
        this.#htmlEl.classList.add("modal-is-open");
      }
      if (state === "opening") {
        this.#htmlEl.classList.add("modal-is-opening");
      } else if (state === "closing") {
        this.#htmlEl.classList.add("modal-is-closing");
      }
    });

    afterNextRender(() => {
      const scrollBarWidth = this.#getScrollBarWidth();
      this.#htmlEl.style.setProperty("--pico-scrollbar-width", `${scrollBarWidth}px`);
    });

    inject(DestroyRef).onDestroy(() => {
      this.#htmlEl.style.removeProperty("--pico-scrollbar-width");
      this.#htmlEl.classList.remove("modal-is-open", "modal-is-opening", "modal-is-closing");
    });
  }

  #getScrollBarWidth(): number {
    if (typeof window === "undefined") return 0;
    const hasScrollbar = document.body.scrollHeight > window.innerHeight;
    return hasScrollbar ? window.innerWidth - document.documentElement.clientWidth : 0;
  }

  handleEscapeKey(): void {
    if (this.store.canClose()) {
      this.close.emit();
    }
  }

  overlayClicked(event: MouseEvent): void {
    if (event.target === event.currentTarget && this.store.canClose()) {
      this.close.emit();
    }
  }
}
