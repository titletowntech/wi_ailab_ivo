# Add a Callable Flow Template to an Integration

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows/add-a-callable-flow-template-to-an-integration
> Captured directly from rendered HTML: 2026-08-14

Follow these steps to add a callable flow template to a
        feature in a customized customer deployment.

        You must have a functional integration feature
            with a flow to complete these steps. You must also have already made a flow callable in
            your dev environment. For instructions and requirements, see [Make a Flow Callable](https://help.trimble.com/doc/app-xchange/app-xchange/flows/callable-flows/make-a-flow-callable).
        Combining the callable flow capability with the flow
            template capability is practical when you already have the use case of a callable flow
            (with or without a [custom input
                schema](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-an-on-demand-trigger)) and want it to be customizable per workspace deployment.Note: As with non-callable [flow
                    templates](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-templates), once a flow template is synced and deployed to a customer
                workspace, it will *not* receive updates from the integration template. If you
                need to make a change in the workspace, you must copy the flow steps to manually
                update the workspace flow.
1. Select ![integration builder icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/1c7a8835-4b43-44d9-b185-65f81e433104.svg) Integration Builder then select the ![Features icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/5e698285-0c3d-409a-837c-7adeaa044a56.svg) Features tab.
2. Select the feature you want to add a callable flow template to then select
                          Add Flow
                      Template.
                  The Add/Create Flow Template
                      window opens.
3. Choose one of the following options.

  - Create: Create a template
                            from a flow that already exists.
  - Use Existing: Adds a
                            reference to an existing template in a different feature.Note: You can add search criteria
                                in the Search Flows or Workspace fields to filter the flows that
                                display.
4. If you chose Use Existing, select the
                      checkbox for the flow you want to use.
5. Select Save.
                  Your callable flow is
                      displayed in the Flow Templates section.
6. In your integration feature, select your main
                      flow.
                  The flow opens.
7. Add a new ![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step where appropriate, then select the flow
                      template you previously added.
Related information

- [Flow Templates](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-templates)
- [Add Flow Templates to a Feature](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-templates#task-dc923f85-6b8e-43ad-a8d9-f0226e5e2c8a--en)

## Pass Data from a Parent Flow to a Callable Flow

If you need to pass data from a parent flow to a callable
        flow, you can define a custom schema.

Here is an example schema to start with.

```javascript
{
"$schema": "http://json-schema.org/draft-07/schema",
"$id": "http://example.com/example.json",
"type": "object",
"required": [
"JCCo",
"Job"
],
"properties": {
"JCCo":

{ "type": "integer", "title": "Vista JCCo" }
,
"Job":

{ "type": "string", "title": "Vista Job" }
}
}
```

When passing data back to a parent flow from a callable
            flow, you must use the ![stop flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7dd53f6c-9a33-4411-a4cc-3d407c16d6c7.svg) Stop Flow step. Use the Result Details section of this step to
            define what is sent back to the parent flow. This section can function like a Map step
            if you add a property and the Select Array Map. You can also create a single property
            and then write code in the value to determine what you want to pass back.

It is best practice to create a property called result,
            then build it to the desired shape. The above example sends an object back to the parent
            flow. You can then reference these values in subsequent steps using
                `flow.step('call-a-flow-step-id').output.result.success`.
