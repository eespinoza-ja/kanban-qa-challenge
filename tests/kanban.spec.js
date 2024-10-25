const { test, expect } = require("@playwright/test");
const KanbanPage = require("../pages/KanbanPage");

test("Edit a Kanban card to mark a subtask as complete and move the card to the first column", async ({
  page,
}) => {
  test.setTimeout(5000);
  const kanbanPage = new KanbanPage(page);

  // Navigate to the Kanban app
  await kanbanPage.navigate();

  // Locate an unfinished task
  const secondColumnTasksCount =
    await kanbanPage.chooseCardWithIncompleteSubtasks();

  // Validate if there are tasks in the second column
  if (secondColumnTasksCount > 0) {
    // Complete a subtask
    await kanbanPage.completeSubtask();

    // Move the card to the first column
    await kanbanPage.moveCardToFirstColumn();

    // Verify that the subtask is striked through
    const hasLineThrough = await kanbanPage.verifySubtaskStrikedThrough();
    expect(hasLineThrough).toBe(true);

    // Close the card editing page
    await kanbanPage.closeCardEditPage();

    // Verify that the number of subtasks completed is correct
    const completedSubtasksDifference = await kanbanPage.verifyCompletedSubtasksCount();
    expect(completedSubtasksDifference).toBe(false);

    // Verify that the card was moved to the correct column
    const moveCardToFirstColumn = await kanbanPage.verifyCardMoved();
    expect(moveCardToFirstColumn).toBe(true);
  }
});
