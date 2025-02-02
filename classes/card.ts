import { type Locator } from "@playwright/test";

export class Card {
  /* relative to the base Locator on the Card */
  static readonly TitleLocator = "h3";
  static readonly DescriptionLocator = "p";

  /* TODO: not ideal, but no easier way to fetch tag items(?) */
  static readonly TagLocator = "//div//span[contains(@class, 'px-2 py-1 rounded-full text-xs font-medium')]";

  constructor(
    private title: string,
    private description: string,
    private tags: Array<string>
  ) { }

  /**
   * Gets the title of the Card
   * @returns `string` The card title
   */
  getTitle(): string {
    return this.title;
  }

  /**
   * Gets the description of the Card
   * @returns `string` The card description
   */
  getDescription(): string {
    return this.description;
  }

  /**
   * Gets the tags of the Card
   * @returns `Array<string>` The card tags
   */
  getTags(): Array<string> {
    return this.tags;
  }
}

/**
 * Loads a Card from a Playwright Locator
 * @param {Locator} base - The base locator for the card
 * @returns `Promise<Card>` A Promise resolving to a Card instance
 */
export async function loadCard(base: Locator): Promise<Card> {
  const cardTitle = (await base.locator(Card.TitleLocator).textContent()) ?? "";
  const cardDescription = (await base.locator(Card.DescriptionLocator).textContent()) ?? "";

  const cardTags = await Promise.all(
    (await base.locator(Card.TagLocator).all()).map(async (tagLocator) =>
      (await tagLocator.textContent()) ?? ""
    )
  );

  return new Card(cardTitle, cardDescription, cardTags);
}
