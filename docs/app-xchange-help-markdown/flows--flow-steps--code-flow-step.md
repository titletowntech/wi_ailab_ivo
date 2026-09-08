# Code Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/code-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Code flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/acca7101-c79c-4777-9085-8520c957c022.svg) Code flow step to execute custom JavaScript for advanced data manipulation and custom logic that isn't
        covered by other standard flow steps.

This step gives you powerful control to transform your data. For
            instance, you can recreate the logic of existing steps like Map, Filter, or Group By
            with your own modifications, or you can create an entirely new function tailored to your
            specific needs.

However, the Code step cannot replace other steps that interact with external resources
            like connectors, files, or the internet. Therefore, you cannot use it to recreate steps
            like Lookup (references a connector), Email (needs internet), or Create Text File
            (interacts with files).

## Step Inputs

In the Edit Step menu, you can add details about the step
                configuration as needed for your flow.

Step
                    Detail

- Code: Enter an expression to be executed when the Code step
                          runs. You can use the flow API within the expression to access data from
                          other steps.

## Step Outputs

The output of the Code step is the value that is
                returned by your JavaScript using the `return` statement. If your
                script contains a syntax error or fails during execution, the step will fail and the
                flow will stop. The resulting error message will provide details about the issue in
                your script.

## Example Use Case

For an example of how to use the Code step, consider a scenario
                where a previous step in your flow called `'lookup-bamboo-hr-employees'` has retrieved a list of employee records.
                You want to process that list, combining each employee's preferred, middle, and last
                name into a single, clean "Full Name" format for use in subsequent steps. While this
                step could technically be achieved by a [Map JSON List or Object Flow Step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step), it is
                more simply achieved by the Code step. To accomplish this step, enter the following
                expression into the Code
                field:

```javascript
let employees = flow.step('lookup-bamboo-hr-employees').output;

// Get a list of employee names in the format [preferred name] [middle name] [last name]
let fullNames = employees.map((employee) => {
  let employeeFullName = `${employee.preferredName} ${employee.middleName} ${employee.lastName}`;
  return employeeFullName;
});

return fullNames;
```

You can then pass along the Full Name value for each employee.
