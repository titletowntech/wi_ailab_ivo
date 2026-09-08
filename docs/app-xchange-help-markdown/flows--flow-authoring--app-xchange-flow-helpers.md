# App Xchange Flow Helpers

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/app-xchange-flow-helpers
> Captured directly from rendered HTML: 2026-08-14

The App Xchange
        flow engine uses the following helper code snippets to help you access data when writing
        flows.

Helpers are organized by the namespaces they access. Hence, they have
            a common structure, wherein `workspace.info()` gives you information about the workspace and `flow.info()` gives you information about the
            flow. For additional details, see [Helpful Coding Tips](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/common-javascript-code-examples#concept-6a289f06-04af-4d38-ba2c-9d6e27fd8d34--en__section_helpful_coding_tips).

workspace

`info()`

Access data of the Flow Workspace: `workspace.info()`

Access the Workspace id: `workspace.info().id`

Access the Workspace name: `workspace.info().name`

appNetwork

`fileUrl(fileId:
                string)`

Generate an App Network file url: `appNetwork.fileUrl('fileGuid')`

`legacyFileUrl(fileId:
                string)`

Generate a Legacy App Network file url: `appNetwork.legacyFileUrl('fileGuid')`

flow

`info()`

Access flow info: `flow.info()`

Access the flow registration ID: `flow.info().registrationId`

Access the flow URL: `flow.info().url`

`config`

Access the flow's configuration: `flow.config`

Access a property on the flow's configuration: `flow.config.myProperty` || `flow.config[myProperty]`

`loopItem()` / `mapItem()`

Access item data one item up. These helpers can be used
            interchangeably as needed. See [Map JSON List or Object Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step)
            and [For Each in a List Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/for-each-in-a-list-flow-step).

        Note: If you put a Map step in a loop, both `loopItem()` and `mapItem()` return the same value.

`trigger`

Access the flow's trigger event:`flow.trigger.event`

Access the flow's trigger data: `flow.trigger.data`

Check if the flow run was triggered by a cache record create
            event: `flow.trigger.isCacheCreate()`

Check if the flow run was triggered by a cache record update
            event: `flow.trigger.isCacheUpdate()`

Check if the flow run was triggered by a cache record delete
            event: `flow.trigger.isCacheDelete()`

Check if the flow run was triggered by an action closed out
            as successful: `flow.trigger.isActionSuccess()`

Check if the flow run was triggered by an action closed out
            as failed: `flow.trigger.isActionFail()`

`todo`

Force an exception with a message intended for your future self:
                `flow.todo('message')`

`step(stepId: string)`

Access a property on the output data of a previously
            executed step: `flow.step("step-id").output.JobCode`

        Access the action response of a previously executed step:
                `flow.step("step-id").actionResponse`Note: This places you at the "Content" nested property of the
                schema. You can access further properties as normal, e.g. `flow.step("step-id").actionResponse.status`

Access the action request of a previously executed step:
                `flow.step("step-id").actionRequest`

Check if a previously executed step has an action status of
            Success: `flow.step("step-id").isActionSuccess()`

Check if a previously executed step has an action status of
            Fail: `flow.step("step-id").isActionFail()`

Check if a previously executed step has an action status of
            Queue Action Success: `flow.step("step-id").isQueueActionSuccess()`
