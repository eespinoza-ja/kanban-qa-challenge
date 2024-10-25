class KanbanPage {
  constructor(page) {
    this.page = page;
    this.firstColumnTasksSelector =
      '//*[@id="app"]/main[1]/div[1]/div[2]/div[1]/div[1]/div[1]/section[1]/div[2]/article';
    this.secondColumnTasksSelector =
      '//*[@id="app"]/main[1]/div[1]/div[2]/div[1]/div[1]/div[1]/section[2]/div[2]/article';
    this.subtasksSelector =
      '//*[@id="app"]/div[2]/div[1]/div[1]/div[2]/div[1]/label';
    this.statusCombo =
      '//*[@id="app"]/div[2]/div[1]/div[1]/div[3]/div[1]';
    this.firstStatus =
      '//*[@id="app"]/div[2]/div[1]/div[1]/div[3]/div[1]/div[3]/div[1]';
    this.optionsMenu =
      '//*[@id="app"]/div[2]/div[1]/div[1]/div[1]/div[1]/div[1]';
    this.editOption =
      '//*[@id="app"]/div[2]/div[1]/div[1]/div[1]/div[1]/div[2]/div[1]/p[1]';
    this.saveChangesButton = 'button:has-text("Save Changes")';
    this.taskNameSelector = "";
    this.taskTextSelector = "";
    this.subtaskNumber = 0;
  }

  async navigate() {
    await this.page.goto("https://kanban-566d8.firebaseapp.com/");
  }

  async chooseCardWithIncompleteSubtasks() {
    const secondColumnTasks = this.page.locator(this.secondColumnTasksSelector);
    const secondColumnTasksCount = await secondColumnTasks.count();
    for (let i = 0; i < secondColumnTasksCount; i++) {
      const subtaskTextLocator = secondColumnTasks.nth(i).locator("//p");
      const subtaskText = await subtaskTextLocator.textContent();
      const taskCompleted = subtaskText.charAt(0);
      const totalTasks = subtaskText.charAt(5);

      if (taskCompleted != totalTasks) {
        await secondColumnTasks.nth(i).click();
        this.taskName = await secondColumnTasks
          .nth(i)
          .locator("//h3")
          .textContent();
        this.taskText = subtaskText;
        break;
      } else {
        continue;
      }
    }
    return secondColumnTasksCount;
  }

  async completeSubtask() {
    const subtasks = this.page.locator(this.subtasksSelector);
    const subdtasksCount = await subtasks.count();
    for (let i = 0; i < subdtasksCount; i++) {
      const subtaskTextLocator = subtasks.nth(i).locator("//span");
      const classValue = await subtaskTextLocator.getAttribute("class");

      if (!classValue.includes("line-through")) {
        await subtasks.nth(i).click();
        this.subtaskNumber = i;
        break;
      } else {
        continue;
      }
    }
  }

  async moveCardToFirstColumn() {
    await  this.page.locator(this.statusCombo).click();
    await  this.page.locator(this.firstStatus).click();
  }

  async verifySubtaskStrikedThrough() {
    const subtasks = this.page.locator(this.subtasksSelector);
    const subtaskTextLocator = subtasks
      .nth(this.subtaskNumber)
      .locator("//span");
    const classValue = await subtaskTextLocator.getAttribute("class");
    const hasLineThrough = classValue.includes("line-through");
    return hasLineThrough;
  }

  async closeCardEditPage() {
    await this.page.locator(this.optionsMenu).click();
    await this.page.locator(this.editOption).click();
    await this.page.click(this.saveChangesButton);
  }

  async verifyCompletedSubtasksCount() {
    const firstColumnTasks = this.page.locator(this.firstColumnTasksSelector);
    const newTaskText = await firstColumnTasks
      .last()
      .locator("//p")
      .textContent();
    return newTaskText.trim() === this.taskText.trim();
  }

  async verifyCardMoved() {
    const firstColumnTasks = this.page.locator(this.firstColumnTasksSelector);
    const cardName = await firstColumnTasks
      .last()
      .locator("//h3")
      .textContent();
    return cardName.trim() === this.taskName.trim();
  }
}

module.exports = KanbanPage;
