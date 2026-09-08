# Troubleshoot a Flow

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/troubleshoot-a-flow
> Captured directly from rendered HTML: 2026-08-14

A flow might fail for a variety of reasons. Understanding the
        various types of error messages can help you isolate the problem and fix it.

The first step when troubleshooting a flow is viewing the error messages in the
            Runs tab. In general, errors can be grouped into the following categories:

- Step input validation
- Script evaluation
- Downstream dependency failure

## Step Input Validation

This type of error
                occurs when the input is invalid for the particular flow step.

The input of a flow step is dynamic, so you won’t always know
                what the input is going to be until you run the step. A step can fail if it receives
                incorrect input values, and it will produce an error message indicating what aspect
                of the input is invalid.

For example, a [![Combine Delimited Files flow step icon flow step](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/cda872bb-a69a-4d0b-97e7-661f90ce70b5.svg) Combine Delimited Files flow
                                                step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/combine-delimited-files-flow-step) may attempt to combine files,
                but it will fail if the input does not point to any files.

## Script Evaluation

This type of
                error occurs when a flow step has an issue evaluating and executing a script.

Scripts do the actual data transformations, and they power many aspects of
                a flow run. This is because the main purpose of a flow is to take in data and
                transform it so that it can integrate into a target system. Therefore, script
                execution errors are common while setting up a flow.

For example,
                this is a script error that is the result of trying to evaluate a script as an input
                to a map step:

This is because the input script is an invalid
                format:

Another type of script evaluation error occurs when the script being
                executed has an error in it. These are more difficult to troubleshoot, as you first
                need to understand what is wrong with the script before you can attempt to fix
                it.

For example:

In this case, the flow step tried to access a property (length) on
                an undefined object. The script looked like this:

You
                can determine that the undefined object is the property records, as that is
                where the length property is supposed to pull data from. This means that the
                flow’s trigger data does not contain the property records. Validate that by
                looking at the flow’s trigger data in the Run Details JSON:

This
                shows there is no data in the flow’s trigger, which is what is causing the undefined
                object error in this case.

To fix this issue, you need to determine
                if it is normal in this instance for the trigger data to be empty.

- If no data is expected, then you can fix the
                          script using [JavaScript falsy
                              logic](https://developer.mozilla.org/en-US/docs/Glossary/Falsy). For example, input something such as:

- If the flow’s trigger should contain data, then you should stop the
                          flow with a Stop Flow step and appropriate messaging that describes the
                          issue. For example, add a Conditional step with a nested Stop step to stop
                          the flow if the trigger data contains no records:

This would set the flow up to display
                the following run result:

## Downstream Dependency Failure

This type of error comes up when there is an issue in a flow dependency,
                not the flow itself.

Flow steps often interface with APIs, so it is possible for a failure to
                happen at the flow step level due to that dependent API failing. In general, this
                type of error is not permanent and will resolve if the flow is run a second
                time.

This is why it is important to follow [Best Practices for Flow Design](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/best-practices-for-flow-design) and test
                your flows to make sure they are robust and execute with expected results. If a flow
                encounters a downstream dependency error, the flow must be able to run again and not
                duplicate data. If applicable, you can also improve the resiliency of your flow by
                enabling a [retry policy](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/connector-action-flow-step#concept-0878a520-e442-4c7e-864c-71dcc26aefd5--en__retry_policy) for interactions with external systems.

To troubleshoot downstream dependency errors, look at the error message and
                determine if the flow should be re-run. All interactions with dependencies should
                have retry policies in place, but it is possible to see a dependency error even with
                those policies. The error message will indicate which status code the dependency
                returned, and you can take action based on that.
