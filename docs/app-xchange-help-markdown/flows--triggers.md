# Triggers

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers
> Captured directly from rendered HTML: 2026-08-14

A trigger defines what causes a flow to run.

Each flow requires exactly one trigger, which starts the first flow step when
            the criteria for the trigger are met. There are four types of flow triggers, each of
            which has multiple use cases.

- Action Close Out
- Cache Event
- On-Demand
- Work Request Batch Ready

## Action Close Out Trigger

An action close out trigger runs a flow on the success or failure of a
                connector action. You can also use an action close out trigger to run a flow on
                either a successful or failed run. It is common practice to send a close out to the
                source system on the success of an action or to remediate the data so an action can
                be retried on failure.

For instructions on adding an action close out trigger,
                see [Add an Action Close Out Trigger](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-an-action-close-out-trigger).

## Cache Event Trigger

A Cache Event trigger runs a flow as soon as a
                    Create, Update, or Delete occurs on a chosen
                connector's data object.

Completed actions also cache write data. In situations
                where data is maintained bidirectionally, it is important to set the Event Origin to indicate where
                the data was changed. Select the name of the connector to indicate changes made
                directly to the data from the external system. Select App Xchange to indicate changes made to the data
                via an internal action from the platform. This will prevent loops where you update
                one system and then immediately update the other system.

To optimize performance and control execution volume, Cache Event triggers leverage
                JavaScript filter expressions for conditional execution. You can write an expression
                that evaluates each incoming cache event to determine if the flow should
                trigger.

For instructions on adding a Cache Event trigger, see
                    [Add a Cache Event Trigger](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-cache-event-trigger).

For details about the expression syntax, available APIs,
                and execution rules, see [JavaScript Trigger Filters](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-cache-event-trigger#concept-67bc1ab5-a762-495d-bcef-294db7d9ef2c--en).

## On-Demand Trigger

An on-demand trigger can operate in several ways. It can be run manually,
                scheduled to run at an interval of your choosing, or, when used within a called
                flow, it may be run from inside another flow. It may also have a custom input of
                data.

Of these scenarios, on-demand triggers are most commonly used for callable
                flows. They can simplify flow writing and make flows more reusable. For more
                information, see [Callable Flows](https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows).

For example, imagine an integration that sends many different types of data
                between two systems, and one of the systems requires each of these data types to
                respond with a message on success or failure.

In this scenario, writing one called flow allows you to call that flow in
                each of the other data syncs. This reduces the number of steps in each flow and
                allows you to manage any issues with that close-out logic in one place.

You can even edit the input schema on the trigger. For example, if you want
                an on-demand flow to send an email to receive context details or error messages.

For instructions on adding an on-demand trigger, see [Add an On-Demand Trigger](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-an-on-demand-trigger).

## Work Request Batch Ready Trigger

The work request batch ready trigger runs when a batch of work requests
                reaches a state where they are ready to process. This trigger is commonly used when
                writing flows that combine work request cache events into a single batch. See [Work Tracking](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/work-tracking) for more details.

You can customize this trigger in several ways. You can define a certain
                type of work request to trigger the batch, the target status for these work
                requests, and set a batch size limit. You can also configure the timeout length
                after which the flow will automatically run.

This trigger outputs an array of work requests. See below for an example of
                a typical JavaScript output array.

```javascript
{
  "WorkspaceId": 784,
  "WorkRequestKey": "vistaEmployee-Batch-44228814",
  "WorkRequestDefinitionKey": "vistaEmployee",
  "WorkItemCollectionKey": "vista/pr/2/employees",
  "WorkItemType": 1
}
```

The output array of a Work Request Batch Ready trigger includes the
                following values:

- WorkspaceId: The unique identifier for the workspace where
                          the work request is being processed.
- WorkRequestKey: The unique identifier for the specific work
                          request batch.
- WorkRequestDefinitionKey: Defines the type or category of
                          the work request.
- WorkItemCollectionKey: Defines the collection of work items
                          associated with the work request.
- WorkItemType: Defines the type of work item.

For instructions on adding a work request batch ready trigger, see [Add a Work Request Batch Ready Trigger](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-work-request-batch-ready-trigger).
