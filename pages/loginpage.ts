import { expect, type Page } from "@playwright/test";

import { username, password } from "../data/credentials.json";

export class LoginPage {
  private readonly page: Page;

  private readonly usernameField = "#username";
  private readonly passwordField = "#password";
  private readonly submitButton = "button:has-text('Sign in')";

  constructor(page: Page) {
    this.page = page;
    return this.validate();
  }

  /**
   * Validate that the login page loaded successfully
   * @returns {LoginPage} The current instance for method chaining
   */
  private validate(): LoginPage {
    expect(this.page.locator(this.usernameField)).toBeTruthy();
    return this;
  }

  /**
   * Log into the application with the given credentials
   * @param {string} [user] - The username to log in with (default to local data if null)
   * @param {string} [passwd] - The password to log in with (default to local data if null)
   * @returns {Promise<void>}
   */
  async login(user?: string, passwd?: string): Promise<void> {
    await this.page.locator(this.usernameField).fill(user ?? username);
    await this.page.locator(this.passwordField).fill(passwd ?? password);

    await this.page.locator(this.submitButton).click();
  }
}
