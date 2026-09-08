# Set Up Integration Jobs and Schedules

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/set-up-integration-jobs-and-schedules
> Captured directly from rendered HTML: 2026-08-14

Follow these steps to create schedules that run jobs at a
    specific interval and sequence.

    Your use
            account must have Integration
                Author permissions to complete this task.A job is a catch-all term for the flows and services
      that can potentially be scheduled. Because one of the most common things to do with jobs is
      schedule them, both jobs and schedules are accessed from the same page.

When you
        view Jobs as part of an Integration via Integration Builder in your Account, you are setting
        up generic processes.

Create schedules that run jobs at a specific interval
        and sequence. Schedules define how often and in what order these jobs need to run in order
        to keep data up-to-date in an integration. You can create multiple schedules that will run
        particular services at different times.

To customize a schedule post sync,
        see [Integration Workspace Jobs](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/integration-workspace-jobs).

To add a schedule at the integration level:

1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder and open the ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab.
2. Select Add Schedule and fill in the following fields:

  - Name: Name the schedule
                  based on its function.
  - Interval: Enter a number
                  indicating the number of times the job will run for the unit of time you select in the
                  next field.
  - Interval Type: Choose the
                  unit of time for the interval. For example, Hour.
  - Active on Sync: Toggle
                  this switch on to have the job start running once the integration definition is synced
                  with a workspace.
3. Select either Add Service or Add Flow and choose from the dropdown
            list.

  The list of services populates from the services currently added to
              integration features.

  The only flows that can be run on a schedule are on-demand flows
              that have no input schemas.
4. Select Add.
5. After choosing a service or flow, enter the Sequence number, indicating the order that the job will run.

  If you want multiple jobs to run at the same time, enter the same
              sequence number for those jobs. All jobs with the same sequence number will run in
              parallel (at the same time). The jobs with the lowest sequence number run first,
              followed by the next number, until all jobs have run.
6. Enter additional services or on-demand flows and their respective sequence numbers as needed for that schedule, then select Save.
7. To edit a schedule, select the gear icon next to the schedule name. This opens the Edit Schedule window.

  - To remove a service or flow, select the X in the upper corner.
  - To remove an entire schedule, select the trash can Delete icon, then confirm your deletion.

You can also set up jobs and schedules at the workspace level from the
          ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab. Integration schedules can be modified in each
        workspace to fit the needs of different customers.
