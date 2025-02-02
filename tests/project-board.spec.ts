import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/loginpage';
import { ProjectsPage, Project, Column } from '../pages/projectspage';
import { Card } from '../classes/card';

import ProjectBoardTests from "../data/test_scenarios.json"

ProjectBoardTests.forEach(({ column, project_type, text, tags }) => {
  test(`Validating card title ${text} for the ${project_type} in ${column} with and Tags: ${tags}`, async ({ page }) => {
    await page.goto("/");

    await test.step("Log into the application with default credentials", async () => {
      const loginPage = new LoginPage(page).validate();
      await loginPage.login();
    });

    const projectsPage = await test.step(`Change project to ${project_type}`, async () => {
      const projectsPage = new ProjectsPage(page).validate();
      const projectType = Project[project_type];

      await projectsPage.selectProject(projectType);
      expect(projectsPage.isProjectSelected(projectType)).toBeTruthy();

      return projectsPage
    });

    await test.step("Find and validate the text and tags", async () => {
      const columnType = Column[column];
      const card = (await projectsPage.getProjectCards(columnType)).find((card: Card) => card.getTitle() === text);

      expect(card).toBeDefined();
      expect(card!.getTags()).toEqual(tags);
    });
  });
});
