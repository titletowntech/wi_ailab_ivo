# Add a Cache Event Trigger

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-cache-event-trigger
> Captured directly from rendered HTML: 2026-08-14

Use a Cache Event trigger to run a flow when a given data
        object has a Create, Update, or Delete event.

Your integration must have a way to modify cache data
            to complete these steps. For a list of ways to do this, see [Cache](https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/key-concepts#concept-fd11042c-1c39-4c41-b02d-a0af679b8660--en__cache_section) in Key Concepts.
1. In the flow builder, select Add Trigger.The Edit Trigger page opens.
2. In the Trigger type field, choose Cache Event.
3. In the Connector field, choose the connector that contains the cache event you want to use to define the trigger.
4. In the Trigger field, select the data object you want to use to define the trigger.

                      Note:  To avoid excessive flow runs,
                          changing the value of fields with leading underscores do not trigger change
                          detection and will not trigger a cache event. This includes Vista UD tables
                          structured as `_custom_fields`.

  Adding new properties entirely, however,
                                  *will* trigger change detection from the schema update on all
                              records, potentially still triggering large numbers of flow
                          runs.
5. In the Subscribed Events field, choose the events to subscribe to for the selected trigger.The options are Create, Update, and Delete.
6. In the Event Origin field, choose the origins of the data to subscribe to for the selected trigger.
7. To limit your flow to run only when relevant
                      conditions are satisfied, enter a JavaScript expression in the Filter Expression
                      field.
                  For details, see [JavaScript Trigger Filters](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-a-cache-event-trigger#concept-67bc1ab5-a762-495d-bcef-294db7d9ef2c--en). By
                      default, the filter is set to evaluate as true, meaning the flow will trigger
                      for all events until you define a custom expression.
8. Select Save.The Edit Trigger page closes.
9. Save the trigger as follows:
  - Select Save and Deploy to Staging.
  - Select the arrow and Save Draft Version.
The trigger is added to your flow. Next, you
            can continue setting up your flow by adding [Flow Steps](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps).

## JavaScript Trigger Filters

You can write a JavaScript expression that evaluates to
        determine if a `CacheChangeEvent` should trigger a flow.

JavaScript filters allow you to apply advanced logic directly within your workflow
            configuration. By evaluating multiple conditions such as `>` or
                `<` comparisons, regular expression checks, and complex
                `AND`/`OR` logical strings in a single block, you can
            precisely control execution paths based on real-time data.

Implementing these filters improves overall system efficiency and
            streamlines your workflow design. Because the filtering occurs at the trigger layer, you
            eliminate the need for a separate, initial conditional step inside your flow. This
            reduces execution costs, minimizes processing overhead, and keeps your execution history
            clean and easier to audit.

There are several common use cases for using JavaScript expressions in cache event
            triggers.

- Value-based filtering: You can deploy value-based filtering to restrict
                      flow execution to instances where specific payload fields meet strict criteria.
                      For example, by evaluating incoming data fields like
                          `flow.trigger.data`, the system can dynamically verify if a
                      status is active or if a balance is greater than zero before proceeding.
- Configuration-driven logic:
                      Filters support configuration-driven logic for dynamic execution eligibility.
                      Compare incoming cache data against your registration's specific configuration
                      settings using `flow.config()` to
                      ensure your workflows adapt automatically to changing environmental
                      variables.

### Using Filter Expressions

For the flow to run, the expression must return a truthy value,
                meaning it resolves to `true` or a
                valid object/value rather than `false`, `null`, or
                    `undefined`. If an expression
                does not explicitly return a value, an error is surfaced in the UI.

            Within your expression, you can use the following APIs:
- `flow.trigger.data`: The event payload
                              containing the current data from the cache change
- `flow.trigger.event`: Event metadata (such as
                                  `CacheChangeType` or
                              `DataObjectPath`)
- `flow.config()`: The registration's configuration
                              values

For an example, you could use this expression to trigger the flow only when an item's
                status is Open.

```javascript
return flow.trigger.data.Status === 'OPEN';
```

When a cache event occurs, the expression is evaluated against the
                following rules.

- Evaluates to True (or Truthy): The flow triggers and
                          executes successfully.
- Evaluates to False (or Falsy): The flow is skipped. It will
                          silently bypass processing and generate an internal system log, but no
                          execution record is created on the Flow Runs page.
- Invalid JavaScript/Runtime Error: The script throws an
                          exception. This halts processing and displays as a trigger error directly on
                          the Flow Runs page for debugging.

### Filter Expression Constraints

To prevent runtime errors and ensure platform stability, your JavaScript expressions
                execute within an isolated, high-performance sandbox governed by strict limits.

Expressions must completely resolve within 250 milliseconds or
                else they will time out. Additionally, the execution sandbox is limited to 5MB of memory. Avoid heavy data allocations or
                complex nested loops.

### Best Practices

Follow these best practices to ensure your filters resolve to a clean true/false
                state rather than throwing a runtime exception.

- Always Use Explicit Returns. Your code block functions like a standard
                      JavaScript function body. You must explicitly use the return keyword to pass
                      your truthy or falsy result back to the engine. Omitting return causes the
                      expression to evaluate as undefined (falsy), meaning the flow will never run.
- Code Defensively with Optional Chaining. Cache payloads can have
                          variable data structures depending on the system event. To prevent your
                          script from throwing a runtime error due to missing nested properties, use
                          JavaScript optional chaining (`?.`).

  - Unsafe: `return flow.trigger.data.Account.Status ===
                                        'Active';` (Throws an error if Account is null or
                                    missing)
  - Safe: `return flow.trigger.data.Account?.Status ===
                                    'Active';` (Safely evaluates to undefined instead of
                                crashing your trigger)

### Viewing Filtered Runs

To view flow runs skipped by the trigger's filter expression,
                navigate to the flow's Runs tab and select
                    Filtered Runs.

This open the Filtered Runs window, which you can search by Cache ID or data range.
                Select a run's Cache ID to view its [Object Record Detail](https://help.trimble.com/doc/app-xchange/app-xchange/data-explorer/cache-explorer/object-record-detail).
