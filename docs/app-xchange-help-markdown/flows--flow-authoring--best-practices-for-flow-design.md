# Best Practices for Flow Design

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/best-practices-for-flow-design
> Captured directly from rendered HTML: 2026-08-14

Follow these best practices below when building a flow to
        ensure it is robust and capable of running and moving data even in unique and potentially
        unforeseen circumstances.

If you have questions about anything on this page, please email your App Xchange platform enablement manager. When
            designing your flow, keep it narrowly targeted to necessary objects and related actions.
            Unrelated actions should be triggered from different flows.

## Stability and
                Reliability

Code Exceptions

When a flow run throws an exception, it terminates immediately.
                This prevents any subsequent steps from running and removes your ability to employ a
                    [![stop flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7dd53f6c-9a33-4411-a4cc-3d407c16d6c7.svg) Stop Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/stop-flow-step) to inform a user of the
                processing status. As such, this is considered an incomplete flow.

The flow UI employs a code formatter and does some basic
                validation when publishing, but code is not compiled until run time, so code
                exceptions can still occur. The step that threw the exception and the exception will
                be called out in the flow run UI. Thoroughly test your code to expose and resolve
                these exceptions.

These common scenarios will
                generate an exception:

- Trying to access data that does not exist in the
                          step context
- Typos in your code
- Null reference errors
- Invalid step references
Handle Connector Action Failures

A [![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step) step can fail to post data for a
                number of reasons. It is highly recommended that you employ a [![Conditional flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/17129c7d-c321-4dc7-8c44-e67c5260d596.svg) Conditional flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/conditional-flow-step) after the Connector Action step
                to inspect the output for failures. In the case where it does fail, use a Stop step
                to set a result status and a result message if desired. Additionally, you can send
                notifications outside of the platform by using an [Email step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/email-flow-step) or a
                Connector Action step to close out an action if your connector supports it.

Blind Connector Action Steps

When using a ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step, do not assume that an object does or does
                not exist in the target system. Instead, use a ![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step prior to the Connector Action step to
                determine if the object exists, and then use a ![Conditional flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/17129c7d-c321-4dc7-8c44-e67c5260d596.svg) Conditional flow step to employ the proper action in a Connector
                Action step.

## Efficiency

Each Service Contains a Single Object to Cache

When adding a service to a workspace, select only a single object for each service.
                This allows for managing dependencies of objects in a job schedule.

Flows are typically triggered from cache writing actions. To
                ensure that jobs exist before triggering flows that would update job phases, set the
                priority in the job schedule to have the service containing the job cache write
                before the job phases. If both objects were written to the cache from the same
                service, you would not be able to control the order and job phases could be written
                before jobs.

Only
                Cache Required Objects

It is expected that only
                required objects are being cache written to the App Xchange platform. Once you have completed building your
                flows, remove services for any objects that are no longer needed.

Set Appropriate Cadence
                Schedules

Consider the cadence of cache updates
                and set schedules to the largest frequency that still supports the integration. For
                example, equipment may only be needed to sync once per day while equipment usage may
                need to be synced once per hour. This cuts down on unnecessary processing.
                Additionally, consider how long it takes a schedule to complete and ensure that the
                schedule frequency is at least that long. For example, if it takes 20 minutes for
                equipment to cache write and all triggered flows to run, set the schedule frequency
                to 25 minutes.

Constrain Lookups and Filter Results

Use the
                Filter Expressions section of the ![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step to limit the amount of data returned.
                Additionally, use the Properties section to limit returned fields to only the fields
                necessary to process data in subsequent steps. In the example below, we are looking
                up Vista jobs that have a JobStatus = 1
                (open) and returning only the JCCo, Job, and KeyID of each Job found.

Do Not
                    Pass Excessive Data Between Flows or Into Foreach Steps

When using a [![For Each in a List flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/410c8c81-be4f-4a60-9ffb-d6197b39d984.svg) For Each in a List flow
                                        step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/for-each-in-a-list-flow-step) or the [![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/call-a-flow-step), limit the amount of data that
                is passed to the input of the step. This pairs with the constrained and filtered
                Lookup step concept, where the output of the lookup is often used as the input to a
                For Each in a List step. There is no hard and fast rule on size, but the smaller the
                dataset, the more efficient the step will be.

## Support

Use Stop Steps to Surface Failed Processing

The flow tooling has the ability to infer success or fail status
                of a flow run; however, this can be confusing to users as the platform's definition
                of a successful run is often different from a user’s perspective. By default, the
                platform considers any flow run that does not throw an exception as a successful
                run.

Consequently, the following scenarios are
                considered a successful run by the platform:

- A flow run that does not perform any
                          actions.
- A flow run that successfully posts data to a
                          target system.
- A flow run that attempts to post data to a
                          target system and fails for any reason.
- A flow run that exits due to a Stop step
                          executing with no result status defined.

Since users typically equate success with data
                moving from a source system to a target system, we want to provide messaging when a
                flow run ends without performing a successful action. Employing Stop steps at exit
                points of a flow provides you the opportunity to set a result status and a result
                message. Additionally, you can send notifications outside of the platform by using
                an ![Email flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a19b793b-b771-4d25-8d0f-604e21735936.svg) Email flow step or a ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step to close out an action if your connector
                supports it.

Thoroughly Document Configurations

Configurations should be documented for how they are expected to be used, where the
                information for the value should come from, and if they are required. Take the
                perspective of training a new support person. What would you want them to know, and
                what information would set them up for success?

Use Consistent Patterns and Naming
                Conventions

It is highly recommended that you use
                consistent naming patterns throughout your integration. This will enhance the
                readability and supportability of your product. Flows and steps allow many
                characters and even emojis.

- Flows: Consider naming
                      flows with the convention `<feature><source system><source
                          object><operation> to <target system><target
                          object><operation>` (for example, *erpCompanies : Vista HQ Company Parameters (CUD) to ProjectSight Erp Companies
                      (CUD)*). Longer names are not always better. If you have many flows that have
                      lengthy names, the flow list will look like a wall of text and make it difficult
                      to find what you are looking for.
- Steps: Consider naming
                      steps with the convention
                          `<action><system><object>` (for example, *Lookup Vista Job* or *Update Vista Employee*).
                      Avoid shorthand if possible. Steps are referenced by the Step Id that you can
                      see below each step name. The flow tooling will automatically generate the ID
                      and make sure it is unique across your flow.

Outcome Messages

Consistent formatting of success and failure messages
                makes it easier to support an integration. Consider the target of your messaging as
                well. More technical messages are fine for internal users or support teams, but not
                as helpful for customers.
