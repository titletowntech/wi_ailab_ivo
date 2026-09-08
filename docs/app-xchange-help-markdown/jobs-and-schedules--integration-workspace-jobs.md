# Integration Workspace Jobs

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/integration-workspace-jobs
> Captured directly from rendered HTML: 2026-08-14

An integration's ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs page enables you to manage the schedules that run
        jobs and services.

The ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs page of an automation has two sections:
            Schedules and Services.

Important: It is not recommended to
            create or edit services and schedules within customer workspaces. These actions should
            be reserved for testing or specific use cases where a unique deployment configuration is
                required.

If you modify a schedule's cadence (start date, time,
                time zone, and interval) locally, these values are not overwritten by future
                integration syncs. While this protects client-specific customizations and prevents
                accidental job triggers, it means global updates to scheduling intervals must be
                applied manually at the individual workspace level.

To add
                a service to an integration, see [Add Services to a Feature](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features/add-services-to-a-feature).

## Schedules

The Schedules section displays a list of all schedules registered to and created
                within the integration workspace.

Integration Schedules are organized by feature status: Active, Onboarding, and
                Maintenance. If applicable, you may also see an unmanaged Workspace Schedules
                section.

To add a new schedule, see [Schedule a Job](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/integration-workspace-jobs#task-5cd3ebe2-0ef3-4d50-bb29-7f4ffa4957b1--en).

To refresh your view of schedules, select the refresh
                icon.

You can Activate or Inactivate
                Maintenance or Onboarding schedules, but once the feature is Active, the schedule’s
                activity is set by the feature.

To run a schedule manually, select the play button icon.

Select any schedule to edit or delete it. If the schedule is managed by the
                integration, you cannot change the jobs to run, only the cadence.

For details about the global
                                scheduling logic, see [Schedule Logic](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules#concept-e2510d0e-18a5-461c-bf9a-8edb92c5cf35--en__section_schedule_logic).

## Services

The Services section displays a list of all services registered to the integration
                workspace.

            To add a new service, select Add Service.Note: The services available are based on the connectors used in
                    the automation.Once you add a service, make sure to select it and choose the specific data objects you want that service to cache.

To run a service manually, select the play button icon.

Select any service to configure or delete it. If the service is
                managed by the integration, you cannot change it.

## Schedule a Job

Follow these steps to schedule a job within an integration or
                automation workspace.

        Your use
            account must have Integration
                Author permissions to complete this task.
                For details about the global
                                scheduling logic, see [Schedule Logic](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules#concept-e2510d0e-18a5-461c-bf9a-8edb92c5cf35--en__section_schedule_logic).
1. Open your workspace then select
                                          the ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab.
2. Select Add Schedule.
                                  The Add Schedule window displays.
3. Populate the following fields:

  - Description:
                                                      Enter a descriptive name for the schedule.
  - Start date:
                                                      Select the schedule's start date using the date
                                                      picker.
  - Start time:
                                                      Select the schedule's start time using the time
                                                      picker.
  - Time zone:
                                                      Select the schedule's time zone from the
                                                      dropdown.
  - Interval:
                                                      Enter a number indicating the number of times the
                                                      job will run for the unit of time you select in
                                                      the next field.
  - Interval Type:
                                                      Select from the dropdown a unit of time for the
                                                      interval from these options.
    - Once
    - Minute
    - Hour
    - Day
    - Month
    Note: Schedules cannot
                                                      run more often than every 15 minutes.
4. Choose at least one of the following. You may add multiple jobs
                                          of each type to a schedule.

  - Select Add Service then
                                                    choose the service from the dropdown.
  - Select Add Flow then choose
                                                    the on-demand flow from the dropdown.

                                  The added jobs display on the schedule
                                          table.
5. If you added multiple jobs to the schedule table, change their
                                          sequence numbers in the Seq column to
                                          determine their run order. Select the checkbox under the
                                                  Skip wait? column to make a
                                          job run as soon as the schedule triggers. Select the
                                                  trash icon to remove a
                                          job.
                                  All jobs with the same sequence number will run in parallel
                                          (at the same time). The jobs with the lowest sequence number
                                          run first, followed by the next number, until all jobs have
                                          run.
6. Select Save.
The schedule is created. It displays on the ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab of the workspace.
