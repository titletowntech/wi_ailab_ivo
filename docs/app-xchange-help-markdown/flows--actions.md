# Actions

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/actions
> Captured directly from rendered HTML: 2026-08-14

Find additional context about actions and troubleshooting
        guidance.

Actions are at the core of all flow steps that interact with data objects,
            especially the [![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step), which is the primary way in which
            data is transformed on a target system. These actions are defined by connector builders,
            and thus, have many variations on their use. To inform your use, navigate to the
            relevant connector, module, data object, and action to view the description and
            schema.

Technically, actions are queued for processing by an Action Processor Service,
            but for the end user, [Real Time
                Action Processing](https://help.trimble.com/doc/app-xchange/app-xchange/glossary#task-6d078b8b-f2f3-4da6-ab91-65602513eed7--en__RTAP) provides a seamless experience.

## Working with Actions After They Run

An action doesn't just execute and disappear. Once it runs, it creates a record that
                you can monitor, inspect, and even use to trigger other flows. This section covers
                where to find and how to use actions after they've been initiated.

- Monitor its status in a flow run: To quickly see if an action succeeded
                      or failed as part of a specific flow, you can open the flow and reference its
                      Runs tab. For more information, see [Flow Runs Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab).
- Inspect the technical details: The Action Explorer is your primary tool
                      for deep-dive troubleshooting. It allows you to inspect the raw input and output
                      data of a specific action, which is essential for debugging. For more
                      information, see [Action Explorer](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/action-explorer).
- Audit the system-wide action history:
                      Behind the scenes, every action is executed by a job. To see a complete
                      historical log of all actions processed by the system (outside the context of a
                      single flow run), use the Job History page. This is essential for auditing and
                      seeing system-wide trends. For more information, see [Jobs and Schedules](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules).
- Trigger new flows on completion: You can
                      use a completed action to trigger another flow. When setting up the trigger,
                      choose the Cache Event trigger type. For more information about triggers, see
                          [Triggers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers).Note: Connector Action operations
                          should (and usually do) cache write data to ensure the cache stays in sync
                          with data changes instead of waiting for a scheduled cache write. But it is
                          the connector developer's responsibility to program the action outcome, so
                          in rare cases, it may not be in use for your cached
                          data.

## Connector Action Troubleshooting

For most errors, such as when an action has failed unexpectedly,
                the first troubleshooting step is to view the schema in app and compare the input
                and output with the required schema.

If this process is insufficient to identify the problem, use View Job Logs to take you to the
                    ![action explorer icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/eef8e106-1862-4454-b22b-eae7aa476425.svg) Action Explorer view of the specific action.

For example, you must use the View Job Logs to
                troubleshoot the common connector action error, "The service that dequeued this
                action is no longer running."

## Common Connector Action Types

When you configure a Connector Action step in a flow, the
        connector's available actions display in a standard path format that tells you what they do
        and what data they affect: [connector module] > [data object] > [action].

When you configure a ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step, the connector's available actions display
                in a standard path format that tells you what they do and what data they affect:
                [connector module] > [data object] > [action].

            Note: For a more comprehensive understanding
                of how a connector action works, you can view its schema by selecting Definition in the flow step
                configuration.

The available actions depend on the capabilities of the connector, and can expand
                over time. While there can be hundreds of unique actions across different
                connectors, most of them fall into a few common categories.

This guide serves as a glossary for these common action types. Use it to quickly
                understand the purpose of an action and select the right one for your workflow.

- Add/post/create: Create new records or items in the target
                          application. Add actions can apply to specific files.
- Delete/remove: Delete or remove data.
- Change/update/patch/put/replace: Change and update generally modify existing data.
                          Patch partially updates existing data. Put and replace usually replace the
                          entire existing record.
- Upsert: Conditionally update data by adding if the data is
                          new and updating if the data already exists.
- Get/query: Retrieve data. Many get connector actions indicate
                          different information to fetch, such as get invoices.
- Send: Transmit data to the target system. Unlike
                          add/post/create, a send action can target an external entity such as an
                          email address.
- Add row/change row: Create new records or modify records on
                          a table or grid of data.
- Process payment batch: Process multiple payment batches at
                          once.
- Refresh cache/refresh many: Refresh cache updates a single
                          entry within a cached data object on the platform. Refresh many updates
                          multiple entries within a cached data object on the platform. For example,
                          in Vista Cost Details, Refresh
                          Cache updates the cost details for a single job, while Refresh Many updates
                          the cost details for multiple individual jobs.
- Run: Execute a process or task, such as running a change
                          order report.
- Cancel: Stop a process or task executed by a run step. For
                          example, this can be used to disable auto-posting.
- Lock/unlock: Control access to resources, preventing concurrent
                          modifications.
