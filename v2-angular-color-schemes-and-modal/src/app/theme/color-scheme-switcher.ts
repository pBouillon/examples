import { ChangeDetectionStrategy, Component, computed, inject } from "@angular/core";

import { IconMoon, IconSun } from "../icons";
import { ThemeService } from "./theme.service";

@Component({
  selector: "app-color-scheme-switcher",
  imports: [IconMoon, IconSun],
  template: `
    <a [href]="'#' + nextTheme()" [attr.aria-label]="nextThemeLabel()" (click)="switchTheme()">
      @switch (currentColorScheme()) {
        @case ("light") {
          <app-icon-moon />
        }
        @case ("dark") {
          <app-icon-sun />
        }
      }
    </a>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorSchemeSwitcher {
  readonly #themeService = inject(ThemeService);

  readonly currentColorScheme = this.#themeService.currentColorScheme;
  readonly nextTheme = this.#themeService.nextColorScheme;

  readonly nextThemeLabel = computed(() =>
    this.nextTheme() === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
  );

  switchTheme(): void {
    this.#themeService.switchTheme();
  }
}
