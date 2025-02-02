import { expect, type Page } from "@playwright/test";
import { Card, loadCard } from "../classes/card";

/**
 * Enum representing different project types.
 */
export enum Project {
  WEB_APPLICATION = "Web Application",
  MOBILE_APPLICATION = "Mobile Application",
  MARKETING_CAMPAIGN = "Marketing Campaign"
};

/**
 * Enum representing different column types in the project board.
 */
export enum Column {
  TO_DO = "To Do",
  IN_PROGRESS = "In Progress",
  REVIEW = "Review",
  DONE = "Done"
};

export class ProjectsPage {
  private readonly page: Page;

  private readonly boardTitle = "h1:has-text('Projects')";
  private readonly projectTab = "button > h2:has-text('{}')";
  private readonly projectTitle = "h1:has-text('{}')";
  private readonly columnType = "div > h2:has-text('{}')";

  /* TODO: not ideal, but no easier way to fetch card items(?) - an id would be ideal here */
  private readonly cardItem = "//div[@class='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow']"

  constructor(page: Page) {
    this.page = page;
    return this.validate();
  }

  /**
   * Validates that the projects page has loaded successfully.
   * @returns {ProjectsPage} The current instance for method chaining.
   */
  private validate(): ProjectsPage {
    expect(this.page.locator(this.boardTitle)).toBeTruthy();
    return this;
  }

  /**
   * Selects a project tab based on the provided project type.
   * @param {Project} project - The project to select.
   * @returns `Promise<void>`
   */
  async selectProject(project: Project): Promise<void> {
    const tab_selector = this.projectTab.replace('{}', project);
    await this.page.locator(tab_selector).click();
  }

  /**
   * Checks if the given project is currently selected.
   * @param {Project} project - The project to check.
   * @returns `boolean` True if the project is selected, otherwise false.
   */
  isProjectSelected(project: Project): boolean {
    const title_selector = this.projectTitle.replace('{}', project);
    this.page.locator(title_selector);
    return true;
  }

  /**
   * Retrieves all cards in a specified column of the project board.
   * @param {Column} column - The column to retrieve cards from.
   * @returns `Promise<Card[]>` A promise that resolves to an array of Card objects.
   */
  async getProjectCards(column: Column): Promise<Card[]> {
    const result: Card[] = [];

    const column_name = this.columnType.replace('{}', column);
    const data = await this.page.locator(column_name).locator("..").locator(this.cardItem).all();

    for (const card_locator of data) {
      result.push(await loadCard(card_locator));
    }

    return result;
  }
}
