# Tasks

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/tasks
> Captured directly from rendered HTML: 2026-08-14

Tasks are a way for users to identify issues in flow steps and
        fix them. This can be useful when data is incorrectly mapped or an action fails.

Tasks are created using the [Create User Task Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-user-task-flow-step).
            When a Create User Task step is executed, a task is created.

Tasks display a title, workflow details, create date, and description.
            Handling tasks follows the same basic process, although the process will vary depending
            on how the flow was written.

## Resolve a User Task

Follow these basic steps to resolve user tasks.

1. Depending on the workspace type, select ![integration workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/476c5b53-43e4-4db2-8d78-2a882a193df2.svg) Integration Workspaces or ![automation workspace icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/4bd37e33-bd30-44e4-8645-f6304e42159b.svg) Automation Workspaces.The workspace
                      opens.
2. Open the workspace's ![Work icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6eb809c2-a47d-4978-9767-e02f6eaed087.svg) Work > ![Tasks icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bb623d54-43ef-4fe0-8944-5bc23541b8fd.svg) Tasks tab.
                  The Tasks page
                      opens.
3. Select the task you want to resolve.

                  The task window opens and
                      displays the task details.
4. Make the necessary changes to the flow step data
                      in the Updated input (JSON) field.

                  The updated value is passed as the output to the suspended Create User
                      Task step that created the task.
5. Select Complete at the
                      bottom of the task window to resume the suspended step. Alternatively, you can
                      cancel the flow.
Once these steps are completed, the task closes
                automatically.
