# Flow Run Statuses

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab/flow-run-statuses
> Captured directly from rendered HTML: 2026-08-14

When a flow runs, you can view its status on the flow Runs
        tab.

It will have one of the following statuses, which will indicate whether it is pending,
            running, or finished.

        Pending
- Queued: The flow has not started; it is waiting to be
                          executed by the flow scheduler.
Running
- In Progress:The flow is actively running.
- Suspended: The flow is waiting on an external item, such as
                          an action processor/cache writer or user task. Typically, a suspended flow
                          is either awaiting an action to complete or awaiting a task to be resolved
                          or canceled.
Finished
- Success: The
                          flow finished in an expected way.
- Failed: The flow author defined a path that intentionally
                          stopped the flow run in a failed state.
- Exception: The flow encountered an exception that was not
                          accounted for, so the flow run did not finish in an expected way. This is
                          typically when an action cancels or there is a runtime error with flow
                          expressions. However, it could include other situations, such as an issue
                          with the engine itself.
- Canceled: The flow run was stopped before it finished. This
                          is typically when a user chooses to cancel the flow early.
