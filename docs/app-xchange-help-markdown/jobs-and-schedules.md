# Jobs and Schedules

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules
> Captured directly from rendered HTML: 2026-08-14

A job is a catch-all term for the flows and services that can
        be scheduled.  A schedule is a rule that dictates when and how often specific jobs should
        execute.

You can manage both jobs and schedules from a workspace's ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab. The two are grouped together so you can
            move from creation to execution seamlessly.

A workspace's ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab is slightly different depending on whether
            it is part of an Integration or an Automation workspace, but both pages enable you to
            manage the schedules that run jobs and services. For context-specific explanation of
            each ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs page, see:

- [Automation Workspace Jobs](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/automation-workspace-jobs)
- [Integration Workspace Jobs](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/integration-workspace-jobs)

Regardless of the workspace type,  schedules globally follow the same
            logic.

## Schedule Logic

- A schedule's actual start time is determined by the moment the
                              schedule is created or activated in a specific workspace.
- To protect client-specific needs, local edits to a schedule are
                              persistent. If you modify a schedule's cadence in a customer workspace,
                              those specific fields are no longer overwritten by global integration
                              syncs.
- When a schedule is first activated, the interval decreased, or if the start time is
                              moved back, the system automatically identifies schedule as
                              behind and instantly runs its jobs to catch up.
- Updating the jobs within a schedule does not force an immediate
                              run. Modified jobs will execute during the next naturally scheduled
                              interval.
- Schedules are calculated based on time elapsed since the last
                              run, rather than a fixed "wall clock" time. This means while the
                              shorthand description might say every day at 2pm,
                              this will vary with daylight savings time.

## Scheduling Best Practices

- Prevent Data Collisions: Stagger schedules so they never access the same data at the same time to avoid database locks.
- Buffer for Cache Writes: Set start times further apart than the duration of your longest cache write to ensure data is fully committed.
- Sequence Related Tasks: Group dependent tasks into a single schedule to force them to run in the correct order.
- Separate Management Types: Keep managed and unmanaged schedules in separate
                          workspaces to avoid logic conflicts.
- Prioritize Schedules over Manual Runs: Prefer schedules for production tasks. They have built-in protections against concurrent writer errors that manual runs lack.
- Isolate Large Data Loads: Use dedicated schedules for large initial data
                          loads to prevent long run times from delaying routine operations.
