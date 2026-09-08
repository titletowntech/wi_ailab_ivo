# Create Your First Flow

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/getting-started/create-your-first-flow
> Captured directly from rendered HTML: 2026-08-14

This exercise guides you through the steps to build your
        first flow without the need for any connectors. It will help familiarize you with the core
        components of a flow and how they interact.

You must have the Flow
            Author account role to create a flow.For more detailed instructions, see [Creating a Flow](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/creating-a-flow).
1. Create the flow.
  1. Within a workspace, navigate to the
                                    ![flows icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/6527fef5-240b-4327-8e72-7357efa67678.svg) Flows tab and select Add Flow.
                            App Xchange opens the Add Flow window with
                                    Create New
                                selected.
  2. Provide a descriptive name for your flow.
                                This usually includes the connectors involved and the goal of the
                                flow.
  3. Select Add.
2. Add the [trigger](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers).
  1. Choose Add Trigger in the
                                flow builder.
  2. Select On-Demand for the
                                trigger type.
  3. Select Save at the bottom of
                                the window.
3. Add the first step.
  1. Select Add Steps in the flow
                                builder.
  2. In the Name field, enter
                                    Map
                                    Variables.
  3. Leave the ID field blank. This
                                field is generated automatically.
  4. Select [![Map JSON List or Object flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/9749a832-2992-447b-947c-edd7bfd5481d.svg) Map JSON List or Object](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step) from the
                                    Type field
                                drop down list. You can also enter the flow name to search for the
                                flow.
  5. In the List or Object field,
                                enter `return
                                    flow.trigger.data;`

    - [return] tells
                                          the engine that this is the value to output for this expression.
                                          Our code is a single line, but the expression window couldhold
                                          large blocks of code.
    - [flow.trigger.data] refers to the trigger
                                          object. For this flow, the trigger is an empty object, but it
                                          could be defined differently - such as a custom input schema, or a changed object in the cache.
    - [;] each line
                                          ends with the semi-colon.
  6. In the Property Name field,
                                enter emailAddress. This property will be available as an output of the map step.
  7. In the Value field, enter
                                    `return
                                    ['youremail@yourdomain.com'];` and use your email
                                address.The square brackets denote that
                                this is an array. You can add other email addresses by enclosing them in
                                straight single quotes and separating the values with a comma within the
                                brackets.
  8. Select Add Item to add a new
                                property beneath the first property.
  9. Name this new property subject. Enter
                                    `return 'Test
                                    Email';` for the value.
  10. Add a new property and name it body. Enter `return 'Hello world';` for
                                the value.
  11. Select Save at the bottom of
                                the step window.
4. Add the second step.
  1. Add a new step by selecting the plus sign
                                under the Map
                                    Variables step you just created.
  2. Name this step Send Email and select
                                a step type of [![Email flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a19b793b-b771-4d25-8d0f-604e21735936.svg) Email](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/email-flow-step).
  3. Change the Emails field to an
                                expression by selecting the first icon. Enter `return
                                    flow.step('map-variables').output[0].emailAddress;`.

    - [flow.step] is
                                          a code helper that refers to another step.
    - [('map-variables')] identifies the step
                                          reference. The value inside the single quotes is the step-id
                                          from the Map step. App Xchange generates the step-id
                                          automatically and ensures that each step has a unique value. If
                                          you need to check the step ID, review the step name in the Steps
                                          list. The step ID is displayed under the step name.
    - [output[0]]
                                          refers to the first object of the step output. Many step outputs
                                          will be an array of objects even if there is only one or
                                          none.
    - [emailAddress]
                                          refers to the property whose value we want to use.
  4. Skip the Attachment section. You can
                                include a single attachment on an email step, but you will not use it in
                                this sample flow.
  5. In the Subject expression
                                field, enter `return
                                    flow.step('map-variables').output[0].subject;` in the
                                    Subject
                                expression box.
  6. In the Body expression
                                field, enter `return
                                    flow.step('map-variables').output[0].body;`.
  7. Select Save at the bottom of
                                the step window.
5. Save and run the flow.
  1. Select Save and Deploy to
                                    Staging.
  2. Select Run in the upper
                                right corner. The Run
                                    Flow? window opens.
  3. Select Run to confirm. The
                                    Runs tab
                                of the flow opens with your flow in the Queued status.
  4. Toggle Auto Refetch to
                                refresh the status every five seconds and see the results of the flow
                                run.
6. Review the flow run.
  1. When the flow status updates to Success, you will see
                                the email in your inbox.
  2. In App Xchange, select the successful flow run to see
                                the Run
                                    Details page.You will see that one email was
                                sent.
  3. Select 1 Email Sent to view
                                the code version of the email.
7. Manage the flow configuration.When you hardcode email addresses in a
                      flow step, it can be inconvenient for troubleshooting and updating the step. Now
                      you will set up a configuration to hold one or more email addresses and modify
                      our flow step to use those values instead of using the hardcoded email
                      address.
  1. Navigate to the Edit tab of the flow
                                you just created.
  2. Select Manage
                                Configurations.
  3. Select Add
                                Configurations.
  4. Enter the following values into the
                                appropriate fields. Leave the remaining fields blank.

    - Key:
                                              emailAddresses
    - Title:
                                              Email
                                              Addresses
    - Description:
                                              One or more
                                              email addresses
    - Required:
                                          Leave unchecked
    - Type: Select
                                              Multiple Text
                                              Items from the dropdown
  5. Select Save.
  6. Select Save and Deploy to
                                    Staging.
  7. Select the configure icon in the upper
                                right.
  8. Select Add Item and enter
                                your email address in the field. Repeat this to add additional email
                                addresses.
  9. Select Save.
  10. Select X to exit this
                                window.
  11. Select the Send Email
                                step.The flow step drawer
                                opens.
  12. In the Emails expression
                                field, enter `return
                                    flow.config.emailAddresses;` replacing what is already in
                                there.In this code we add the Key from
                                our Configuration to `flow.config`. Because we defined the Configuration type as
                                Multiple Text Items, it will be interpreted as an array of strings which
                                is what the Emails expression field expects.
  13. Select Save at the bottom of
                                the window.
  14. Choose Save and Deploy to
                                    Staging.
  15. Select Promote to
                                Main.
Your flow is complete and deployed on the main
            branch. It can now be used within your workspace. Now you know how to create an on demand flow, map properties for later use, send and email, and leverage a flow configuration.
