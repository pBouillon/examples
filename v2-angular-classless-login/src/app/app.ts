import { ChangeDetectionStrategy, Component, ElementRef, viewChild } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <main #mainRef>
      <h1>Sign in</h1>

      <form>
        <input
          type="text"
          name="login"
          placeholder="Login"
          aria-label="Login"
          autocomplete="username"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          aria-label="Password"
          autocomplete="current-password"
          required
        />

        <fieldset>
          <label for="remember">
            <input type="checkbox" role="switch" id="remember" name="remember" />
            Remember me
          </label>
        </fieldset>

        <button type="submit">Login</button>
      </form>
    </main>
  `,
  host: {
    "(window:resize)": "onResize()",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly mainRef = viewChild.required<ElementRef<HTMLElement>>("mainRef");

  onResize(): void {
    const mainRef = this.mainRef();
    if (mainRef) {
      mainRef.nativeElement.style.minHeight = `${window.innerHeight}px`;
    }
  }
}
