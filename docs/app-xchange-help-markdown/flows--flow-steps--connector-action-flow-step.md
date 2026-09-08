# Connector Action Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step to interact with the API of an external system, as implemented by connector
        builders.

In a flow, this step creates an action, then a job processes the action, and
            then the data goes to the connector. For more information, see [Actions](https://help.trimble.com/doc/app-xchange/app-xchange/flows/actions). There a few things to keep in mind
            when beginning to leverage this flow step:

1. It is recommended to use the Definition link that appears
                  when selecting a specific action to view the connector-defined schema.
2. Action inputs have a limit of 5MB.
3. For some actions, you can disable real-time processing, although in most cases you
                  should keep this enabled.

The connector then processes this data according to the action path
            identified in the flow step details. For example, if you are integrating ProjectSight and Vista job phases, you can use the Upsert v2 connector to update
                Vista with changes in ProjectSight.

In the example screenshot below, the connector action will update job
            phase data from the current system (ProjectSight) if the job phase already exists in Vista, or insert the job phase if it does not
            exist in Vista. The configuration will be
            specific to the connector action, but will typically include all the fields for the
            relevant data object.

## Video

You can watch a video explanation of this flow step on Trimble Learn: [Connector Action Flow
                    Step](https://learn.trimble.com/learn/courses/8957/app-xchange-flow-steps-introduction-2025/lessons/56339/connector-action-flow-step).

            Note: You must have a [Trimble ID](https://apim.viewpointplatform.com/help/v1/contents/urn:contentId:accountservices_001:accountservices:accountservices)
                        to view Trimble Learn
                        courses.

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

Step Detail

- Connector:
                          Select the connector (the third-party system) you want to post the data to.
                          The list of connectors includes all of the third-party systems involved in
                          the integration.
- Action Path: Choose what data you want to post, specific to
                          the connector that you selected. Action paths are based on the capabilities
                          of the connector and appear in the UI in a common format: [connector module]
                          > [data object] > [action]. For more information, see [Common Connector Action Types](https://help.trimble.com/doc/app-xchange/app-xchange/flows/actions#reference-631ca62e-77a7-4d57-8da1-b661d7527251--en).
- Enable Retry Policy: This
                          option is off by default. Toggle this option to set a schedule for retrying
                          failed actions. For example, you can enable the retry policy if an action
                          fails because of a timeout. The retry policy provides this kind of error
                          more time to resolve itself. However, the retry policy is unlikely to help
                          if you suspect a more complex underlying issue like bad data.

## Retry
                    Policy

This section only displays if you toggle on the
                    Enable Retry Policy
                option. Retry policies run additional attempts in a 24-hour window. If this window
                passes and the action still fails, the flow will move on to the next step.

The retry action feature allows users to automate
                retrying an action. This assists with known issues that occur in some target
                systems. For example, this feature is practical when adding a new batch entry for a
                batch that is still in use by an end user. With the feature disabled, the action
                would fail and create a user task. With the feature enabled, we can target that
                failure and retry automatically. This feature is not intended to replace an
                immediate retry policy, as it has a minimum wait time of 30 minutes.

To set up the retry policy, enter values in the
                following fields:

- Error Condition: In this field, enter the values that cause
                          the error you want to resolve with a retry. You can access the raw API
                          response using the code `flow.mapItem().result?` for more advanced error handling. Keep
                          in mind that this code must evaluate to a boolean value when using this
                          within the Error Condition.

  For example, you can use `flow.mapItem().result?.code ===
                              'Unexpected Error'` to check if the API response indicates an
                          Unexpected Error and trigger a retry based on that. This code can properly
                          handle a response like this one.

  ```javascript
  "result": {
    "code": "Unexpected Error",
    "errors": [
      {
        "text": "PO already in use by 4/24 batch # 2827 - Batch Source: AP Entry ",
        "source": [
          "PO"
        ],
        "details": {}
      },
      {
        "text": "PO already in use by 4/24 batch # 2827 - Batch Source: AP Entry ",
        "source": [
          "POItemLine"
        ],
        "details": {}
      }
    ]
  }
  ```

   To find the correct values for your custom logic, refer to the
                      connector's action definition and the schema of the failed response.
- Exponential Backoff: This option is off by default. Toggle
                          this option on to double the interval between each attempt. For example, for
                          an interval of one hour, exponential backoff will retry the action after one
                          hour, two hours, four hours, eight hours, etc.
- Interval: Define how frequently you want to retry the
                          action. Choose an interval between 30 minutes and 24 hours.
- Attempts: Enter the number of times you want to retry the
                          action at the interval you defined. The maximum number of attempts for any
                          time interval is five.

## Configuration

Depending on what data you post, you can further refine
                and customize flow step properties.

- Wait For Response: This option is on by default. In
                          general, you want to keep Wait For Response enabled, as it pauses the flow
                          and waits for the action to complete before continuing on to the next step.
- Use Existing Body: This option is off by default. When
                          toggled, this lets you define properties in a previous flow step, and then
                          point to that other step (typically a map step). In other words, you use the
                          existing body of a previous step.

The Configuration section is also where you define
                action properties. The properties listed depend on the connector and action path you
                choose in the Step Detail section—the property values are mapped to the system to
                which you are posting data. For details about property values, see [Common JavaScript Code Examples](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/common-javascript-code-examples).

            Tip: Avoid adding hardcoded
                values when defining a property. If you need to translate data between connectors,
                use a [Map JSON List or Object step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step) before the Connector Action Step.

To include additional properties beyond the ones that
                are required, select the Include checkbox and enter a value to add the property to the
                configuration.

Connector actions that take objects or arrays will allow you to use the
                    Add Item button to expand, or use an Array
                    Map to specify an list or object and map that list or object to
                input properties. For more information, see [Map JSON List or Object Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step).

## Step Outputs

The output of the connector action varies depending on
                the type of connector action executed, but it is usually the response from the
                third-party system. For example, the potential outputs of an add action are that the
                data is added or the action fails. Similarly, the potential outputs of a delete
                action are that the data is deleted or the action fails. You can confirm the outcome
                of a connection action by referencing its step status. These are the possible
                statuses a step can have:

- QUEUE_ACTION_SUCCESSFUL: Occurs when the action is queued
                          successfully (only occurs when Wait For Response is off).
- ACTION_HANDLED_SUCCESSFUL: Occurs when the action is
                          handled successfully (only occurs when Wait For Response is
                          on).
- ACTION_HANDLED_CANCELED: Occurs when a queued action fails
                          to complete, such as in the following scenarios:

  - The parent flow run is terminated by a user.
  - The associated workspace is deleted.
  - The action remains in a queued state for 14 days.

                      Note: When an action is canceled, the parent flow fails
                          with an Exception status. This prevents flows from reporting a Successful
                          status when an underlying action did not complete. For more information, see
                              [Flow Run Statuses](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab/flow-run-statuses).
- ACTION_HANDLED_FAILED: Occurs when any of the following
                          conditions are met.

  - Data is entered in the wrong type, which
                                    does not match the required schema for the action.
  - A string is improperly formatted.
  - A bad request is returned from the
                                    API.
  - The action is closed as Failed (only
                                    occurs when Wait For
                                        Response is on).

It is easy to author a flow where there are two possible
                statuses a step can end up in ACTION_HANDLED_SUCCESSFUL or ACTION_HANDLED_FAILED,
                where the flow only continues if the status is ACTION_HANDLED_SUCCESSFUL. To handle
                the ACTION_HANDLED_FAILED status you can or need to remove the status value from the
                step dependency, and then keep in mind subsequent steps will need to inspect the
                status are react accordingly. For example, if you wanted to use the Email flow step
                on a failed action, you would not want to make that step dependent on a successful
                action.

Trigger Other Flows
                    on Action Completion

You can use a completed action to trigger another flow. When
                setting up the trigger, choose the trigger type based on what you want the flow to
                do. Trigger types include Cache Write, Action Close Out, and On Demand. For more
                information about when to choose each trigger type, see [Triggers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers).
