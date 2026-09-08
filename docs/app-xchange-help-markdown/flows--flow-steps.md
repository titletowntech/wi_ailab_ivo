# Flow Steps

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps
> Captured directly from rendered HTML: 2026-08-14

Flow steps define specific functions that accomplish a variety
        of tasks within a flow.

Flow steps carry out the actual work of a flow, and there are a variety of
            different types of flow steps. Steps can perform independent functions, or they can work
            with other steps.

For example, if you want to confirm that an RFI exists, you could use a Lookup
            flow step to check that an RFI ID exists. If you want to confirm that the RFI ID matches
            a given range of IDs before proceeding with the flow, you could pass the output of the
            Lookup flow step to a Conditional flow step, where you compare it against an array of
            expected IDs.

To add flow steps to your flow, see [Add or Edit Flow Steps](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow/add-or-edit-flow-steps).

## Processing Flow Data

Flow data is processed in the App Xchange flow engine. The step drawer UI
                (the Edit Step window) is a visual tool for writing the JSON that is passed into the
                flow engine.

The flow engine processes the flow and its steps. All steps have access to
                the flow’s trigger data, event info, and any steps that have previously run.

Some steps are more complex than others. For example, in a Parse CSV File
                to JSON Step, you supply it with the file contents. However, in a Connector Action
                step, you will need to write more code.

## Validate that a Flow is Working

Flow writing is a lot like programming. Start small and test as you go. In
                most situations, you can run the flow and check the flow run results to verify that
                the step input and output are what you expect. For more information, see [Test a Flow](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/test-a-flow).

When steps fail, the entire flow will typically fail, and you’ll see an
                error in the flow run result. For more information about what to do when a flow
                fails, see [Troubleshoot a Flow](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/troubleshoot-a-flow). For more information about
                flow run results, see [Flow Runs Tab](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-management/flow-run-information/flow-runs-tab).
