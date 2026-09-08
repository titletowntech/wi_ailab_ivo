# Flow Exceptions and Failures

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/flow-exceptions-and-failures
> Captured directly from rendered HTML: 2026-08-14

There are several scenarios in which a flow can fail or
        produce an exception.

## Flow Exception

A flow completes with an Exception status when it
                encounters a code error that it cannot resolve. For instructions on how to fix the
                error, see [Diagnose a Flow Exception](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/flow-exceptions-and-failures#concept-e5ca7698-c1b3-4a96-a776-3261752560fb--en).

## Failed Flow

A flow can only have a failed status by using a stop step to set that
                status. When trying to understand why a flow has ended with a failed status, first
                start at the Runs tab of a flow. Often a flow author will provide an output message
                detailing why the flow was stopped with a failed status.

If there is no output message, select the flow run to see what steps were
                run and follow the logic path that ends with the stop step.

Flow authors typically set a failed status if they determine that data
                needed to process an action is missing or in an improper format. In this case,
                correct the source data and rerun the flow.

A Failed status is also often set after a connector
                action step has returned an error message. The returned error message will need to
                be evaluated and appropriate actions taken to resolve it.

## Canceled Flow

Only an App Xchange user can cancel a flow and give it a
                    Canceled status. Use the activity log in the workspace
                and filter by the Flow Terminated activity. Expand the event
                to see what flow was terminated and by which user.

## Long Running Flow

There are many reasons why a flow could be in an In
                    Progress or Queued status for a long time.
                The definition of a long time will be different for each observer and flow.

If you feel your flow has been in an In Progress or
                    Queued status for too long, use this line of questions to
                triage possible issues before contacting support.

- Is the flow actually running long, or does it just seem that way?
                          Compare the current run time against previous run times.
- Has there been a change to the flow definition or data that could
                          cause the extended run time?
- Are there other flows running in the workspace? If the flow is in a
                          queued status, this is likely the issue.
- Is there a platform incident? Check [https://status.appxchange.trimble.com/](https://status.appxchange.trimble.com/).

If the answer to all of the above is no, then submit a support
                ticket by sending an email to [xchange_support@trimble.com](https://help.trimble.com/doc/app-xchange/app-xchange).

## Rerun a Service

As a general rule, App Xchange users should not run services. If a flow
                terminates with a Failed, Exception,
                or Canceled status, resolve the reason for the termination,
                then manually rerun the flow using the Data tab.

A [![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step) queues up the defined action.
                The App Xchange platform processes
                those actions, but in rare cases, the processing fails and leaves the action queued.
                The only way to clear these queued actions is to rerun the action processor service.
                This can be dangerous to do depending on the timing. If too much time has elapsed
                since the initial run, the object may have already been written to the target system
                with updated data. Re-running the flow manually could update it with an old data
                state.

## Diagnose a Flow Exception

Follow these steps to identify the code causing a flow exception so you can make the
                necessary corrections.

You must be have Flow Author permissions to complete these steps.

1. Navigate to the flow run that has
                                          an Exception status.
2. Select the flow run and open the
                                          Run Details page.
3. Select the
                                                  Exception link in the header
                                          of the run details.

                                  This opens a panel with details about the exception and
                                          which step has the code that caused the
                                          Exception.
4. Correct the code and select
                                                  Save and Deploy to
                                          Staging.
5. Test your revised code to see if
                                          the exception has been resolved.
6. Select Promote to
                                                  Main.

The flow exception is resolved.
