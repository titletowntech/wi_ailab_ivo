# Test a Flow

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/test-a-flow
> Captured directly from rendered HTML: 2026-08-14

Resolve issues with your flow by performing and evaluating
                test runs.

Follow these best practices when performing and evaluating test runs to resolve
                        issues with your flow.

A flow must have at least one trigger and flow step to run.

## Set a Flow to Inactive

When
                                testing a flow, set it to inactive to avoid accidental triggers on a
                                flow that is not yet ready to handle data.

To set a flow to
                                inactive, open the flow, open Settings and make sure the
                                        Is Active option is toggled off.Note: A flow with an On Demand trigger that
                                        does not have a schedule defined cannot be set to
                                        inactive.

You can see if a flow is already
                                inactive by referencing the tag next to its name in the flow
                                editor,

## Trigger the Flow

A flow runs when its trigger conditions are met. For more information
                                about trigger conditions, see [Triggers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers). You
                                can test your flow to see its behavior when triggered. You can also
                                filter for record sets to use to trigger your flow.

## Trigger Types and Testing

An
                                        On
                                        Demand The easiest option to trigger your flow
                                during testing; it just requires selecting Run.

The other trigger types, Cache Event,
                                        Action Close
                                        Out, and Work Request Batch
                                        Read, all require an event to trigger your
                                flow.

Search for
                                Record Sets to Test Your Flow
1. In the flow builder,
                                                  navigate to the [Data tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-data-tab).
2. In the Quick Searches
                                                  dropdown, select the option beneath Trigger.
3. Either select Add
                                                    Filter to further refine records, or
                                                  use the records listed in the Results table.
Manually Run a
                                Flow

A flow must be
                                published in order to run, and it will run depending on its trigger.
                                Flows with Cache Event, Action Close Out, or Work Request Batch
                                Ready triggers run automatically, whereas flows with an On Demand
                                trigger must be run manually.

To
                                manually run a flow, do the following:

1. Make sure the flow is
                                                  active. Open the flow, go to Settings, make sure Is
                                                    Active is toggled on.
2. Make sure the flow is
                                                  published. Open the flow and select Publish.
3. Make sure the flow has an On
                                                  Demand trigger type.
4. From the Flow builder,
                                                  select Run and confirm that you want to run
                                                  the flow.

## Test the Flow’s Posting Actions

When testing your flow, before you make requests to the target
                                system, it is a best practice to first test with a sandbox instance
                                of the target system. This is to avoid interacting with live data
                                and to help you learn more about how the system’s API works.

1. Log into the target system and view the data
                                                  you are acting on.
2. Back in the flow builder, select the
                                                    Runs tab.
3. Select one of the run results to view the run
                                                  details, and select Output.
4. Verify that your flow is posting data and that
                                                  actions complete as intended.

## Test for Other Flow Outputs

Some flows will not result in
                                performing an action or posting data. A flow result may consist of
                                creating a task, sending an email, or ending with a Stop
                                step.

View
                                Tasks
1. Go to the Tasks page for your workspace. Make
                                                  sure a task was created.
2. Alternatively, go to the
                                                  flow builder page, select the Runs tab, and view the Run Details
                                                  for the flow. This section indicates any artifacts
                                                  created by the flow.

View Emails Sent as a
                                        Result of a Flow

1. Send emails to yourself
                                                  during testing so you can see how they look when
                                                  sent.
2. Go to the flow builder page,
                                                  select the Runs tab, and view the Run Details
                                                  for the flow. See the recipient(s) of the emails and
                                                  other details.

View Stop
                                        Flow Step Results

As a best practice, you should include a [![stop flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7dd53f6c-9a33-4411-a4cc-3d407c16d6c7.svg) Stop Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/stop-flow-step) at the
                                end of each flow you write. Stop steps allow flow authors to provide
                                information about results and custom messages indicating the status
                                of a flow run.

1. To
                                                  view Stop step flow output, go to the Runs
                                                  tab.
2. Select a flow run status for details.
3. If applicable, select Outcome to view more
                                          result details.
