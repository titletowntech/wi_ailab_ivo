# Add an On-Demand Trigger

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-an-on-demand-trigger
> Captured directly from rendered HTML: 2026-08-14

Use an on-demand trigger to run a flow manually, called by
        other flows, or on a schedule. You can also enable a custom input schema.

1. In the flow builder, select Add Trigger.
                  The Edit Trigger page opens.
2. In the Trigger type, choose On-Demand.
3. In the input schema type field, choose one of the following.

  - Select this option to run the flow without any additional input. If you
                                select this option, you may add weekly or monthly schedules to run the
                                flow by selecting Add Item in the schedules
                                section.

                            Note: Times do not account for daylight saving, so you
                                may see an hour discrepancy throughout the year.
  - Select
                                    Custom schema to run the flow
                                using custom input fields. If you select this option, you must define
                                these custom input fields using a JSON snippet.

    Note: Values entered will be
                                compared as text strings. Filters cannot contain code, such as a
                                reference to a flow config.

    For
                                example, this code creates the following
                                fields:

    ```javascript
    {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://tenna.si.ryvit.com/app/v1/object/sites.json",
    "type": "object",
    "properties": {
    "emailAddress": {
    "title": "Email Addresses",
    "description": "=\"someone@somewhere.com\" or [\"someone@somewhere.com\", \"someoneelse@somewhere.com\"]",
    "oneOf": [

    {"type": "string"}
    ,
    {"type": "array", "items": {"type": "string"}}
    ]
    },
    "context":

    { "type": "object", "title": "", "description": "" }
    },
    "required": ["emailAddress", "context"]
    }
    ```

    In this example, the custom input
                                field allows you to define who you emailed and what the description
                                says.
4. Optional: select Add Item under
                          Schedules to run this flow on a schedule.
                      Alternatively, add the flow to a schedule under Jobs for
                      additional scheduling capabilities (this option is preferred).
5. Select Save.
                  The Edit Trigger page closes.
6. Save the trigger as follows:

  - Select Save and Deploy to
                                Staging.
  - Select the arrow and Save Draft
                            Version.

        The trigger is added to your flow. Next, you
            can continue setting up your flow by adding [Flow Steps](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps).
