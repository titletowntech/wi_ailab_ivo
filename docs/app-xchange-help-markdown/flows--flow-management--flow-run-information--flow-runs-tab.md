# Flow Runs Tab

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab
> Captured directly from rendered HTML: 2026-08-14

View a flow’s progress and run results on the Runs tab. You
        can also select each individual flow run to view additional details.

Open a flow and select Runs to access the flow's Runs page. On this page, you can view flow
            run history and details.

You can also perform the following tasks on the flow run
            status page:

- Enable automatic refresh on the flow run history using the
                      Auto Refresh toggle.
                  This is helpful for monitoring active flows.
- Manually refresh the flow run history. Select the refresh
                      icon.
- Cancel all active and queued flows. Select
                          Terminate All.
                      This requires at least one flow that is queued or in progress and the Flow Author permission.
- Cancel a flow if it is still running. Select the red
                          cancel icon. This
                      requires the Flow
                          Author permission.
- Re-run a finished flow with the same trigger data.
                      Select the blue play
                          icon. This requires the Flow Author permission.Note: This flow will run as the
                          currently published version, which is not necessarily the same as the
                          version that ran to get the existing run status.
- If a flow has a Cache Event Trigger with a filter expression, you can select
                      Filtered Runs to view flow runs skipped by the trigger's
                  filter expression. For more information, see [JavaScript Trigger Filters](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-cache-event-trigger#concept-67bc1ab5-a762-495d-bcef-294db7d9ef2c--en).

## Viewing Filtered Runs

To view flow runs skipped by the trigger's filter expression,
                navigate to the flow's Runs tab and select
                    Filtered Runs.

This open the Filtered Runs window, which you can search by Cache ID or data range.
                Select a run's Cache ID to view its [Object Record Detail](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/object-record-detail).

## Flow Run History

When you select the Runs
                tab, you can view the following categories of run history data: Overall, Last Week,
                Last Day. This data includes details about the run statuses. For more information
                about statuses in general, see [Flow Run Statuses](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab/flow-run-statuses).

Overall

This section displays the statistics for the entire history of
                the flow. As you can see in the screenshot above, there have been a total of 6,741
                flow runs, with only one run left unfinished. An unfinished flow will have one of
                the following statuses:

- Queued
- Suspended
- In progress
Last Week

This section reports the status for the past seven days of flow
                runs. The statistics reported here ignore unfinished flows, therefore these stats
                are aggregated from flows that have a terminal status, one of the following:

- Finished
- Failed
- Exception
- Canceled
Last Day

This section is very similar to the Last Week section, but it
                instead reports flow run status details from the past 24 hours.

Filter Flow Run Results

Filtering is needed in order to be able to search for past flow
                runs. You can choose from the following parameters to filter flow runs:

- Status
- Action Status
- Task Status
- Start or End Date

For example, you could filter for flow runs with a
                status of Exception in a
                custom date range:

Flow Runs

In this final section on the Runs tab, you can see an overview of
                each flow run. This includes details such as:

- Flow status
- Flow start and finish dates / times
- Flow definition version used
- Flow result message
- Actions queued / completed
- Task queued / completed

Example of a flow that completed
                successfully:

Example of a flow that failed:

The actions and tasks
                progress bars are color coded. You can hover over the bars to see a breakdown of the
                values. For example:

## Run Details/Visualization

Select a flow run to open the Run Details page. This shows you
                the status details of the flow run, like when it started and the outcome, and code
                visualization to help determine where a flow run may have failed. You must be a flow
                author in order to see the visualization.

Status

The status displays these run details. Certain details may have links to additional
                data. Select the blue text to view this data.

- Started: The date the flow started.
- Version: The version of the flow that ran. Select the
                          info icon to compare against the current versions on
                      staged and main.
- Actions: Displays any actions completed.
- Work Items: Displays any work items created or
                      resolved.
- Last updated: The date the flow was last updated.
- Emails: Displays any emails created.
- Tasks: Displays any tasks created.
- Finished: The date the flow finished.
- Outcome: Displays if any actions are required due to the
                      flow failing or stalling out.
- Trigger: Displays the trigger event.
Run Details

Select the success or exception to see the details of the run.
                This will show you the success of each step and any action failures. This
                information is only available for 30 days.

Example of run details for a flow run that failed:

To
                see more, such as the JSON for each action, task, or outcome, select the link next
                to these categories.

VisualizationVisualization of a flow
                can help determine where a flow run may have failed. If a step failed, you’ll see an
                error tag on the step.Note: If the flow
                    contains sensitive data, you may not have permission to see the
                    visualization.

- Select the trigger to see trigger event info and
                          data. This includes the trigger event info and trigger data. You won’t see
                          any information for on-demand triggers, as there’s no event that starts the
                          flow run.
- Select a step to see the step’s input and
                          output. For a failed step, the output displays what went wrong. The flow visualization each flow run as a
                                  numbered iteration. Five iterations are displayed by default,
                                  prioritizing iterations that produced a code exception. To view more
                                  iterations, select Show All. The total amount of exceptions is
                                  displayed at the top of the visualization.

  You can select an individual
                                  iteration to view the segment of code that produced the exception.
                                  Typically, a code change will fix all repeated exceptions. However,
                                  if you need to view additional iterations for further debugging,
                                  select Download
                                          JSON to view the full run details if the flow is
                                  not marked Sensitive.
Actions

Hover over the bar to see a breakdown of actions succeeded,
                pending retry, failed, and queued.

Select the
                number of actions next to the bar for more details on each. The Actions window will
                open, displaying all of the actions posted during the flow’s run. This area allows
                you to filter and view details about each action. You can filter actions by the
                following statuses:

- Queued
- Successful
- Failed
- Processing

View an action’s input and output by selecting the
                Plus sign to the left of it. Additionally, select View Job Logs to see details on
                the processor that processed the action.

For
                example, an Action window with successful actions listed:

Tasks

Hover over the bar to see a breakdown of tasks succeeded and
                queued.

Select the number of tasks for more
                details on each. The task tab shows all of the tasks created during the flow’s run.
                View the following information about tasks:

- Title: The title given to the step in the flow’s
                          definition.
- Description: This data is supplied in the step’s definition
                          for the flow, similar to the title.
- Status: The terminal status of the task: either Completed or Canceled.
- Finished By: The email of the user who resolved or canceled
                          the status
- Created: Time stamp the task was created during the flow
                          run
- Completed: Time stamp when the task was resolved or
                          canceled.

Select the task to see the values that created the
                task, the time it was resolved, and the updated data after the task completed. For
                more information, see [Tasks](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/tasks).

Email

Select the value to view the emails sent during the flow run. You
                can see the following information:

- Name: Name of the email step
- Sent To: All recipient email addresses
- JSON snippets that provide more context

Example of email details:
