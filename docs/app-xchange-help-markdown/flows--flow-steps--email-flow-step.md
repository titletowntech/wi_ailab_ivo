# Email Flow Step

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/email-flow-step
> Captured directly from rendered HTML: 2026-08-14

Use the ![Email flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/a19b793b-b771-4d25-8d0f-604e21735936.svg) Email flow step to send an email to one or more email
        addresses.

This flow step is useful if you want to send notifications when a
            previous flow step fails, or just before ending a flow with a status of Failed. It is
            the primary way to notify someone without requiring them to log in and view a [dashboard](https://help.trimble.com/doc/app-xchange/app-xchange/dashboards).

You can also create a flow with just the Email step, then use the
                [![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/call-a-flow-step) to call the Email step. This is
            useful when you frequently send flow result emails to the same addresses in the Email
            step, and you may want to combine this process with a [custom input
                schema](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers/add-an-on-demand-trigger).

## Video

You can watch a video explanation of this flow step on Trimble Learn: [Email Flow Step](https://learn.trimble.com/learn/courses/8957/app-xchange-flow-steps-introduction-2025/lessons/56344/email-flow-step).

            Note: You must have a [Trimble ID](https://apim.viewpointplatform.com/help/v1/contents/urn:contentId:accountservices_001:accountservices:accountservices)
                        to view Trimble Learn
                        courses.

## Step Inputs

In the Edit Step menu, you can add details
                about the step configuration as needed for your flow.

Step Detail

- Emails: Enter the email addresses to which the email will
                          be sent. You can enter a maximum of 25 comma-separated email addresses. You
                          can also enter an expression that outputs an array of email addresses.
- Attachment: Enter an expression that returns a file to
                          attach. This field accepts [file pointers](https://help.trimble.com/doc/app-xchange/app-xchange/flows/file-pointers) as well as the output of a
                              [![Create Delimited File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7a89e0da-bfa7-4764-894f-fe6e20a12105.svg) Create Delimited File flow
                                          step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-delimited-file-flow-step) or [![Create Text File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/f0a72cc0-2885-4ac1-8fa1-b4c652109a73.svg) Create Text File flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-text-file-flow-step).
- Subject: Enter the subject of the email. This can be an
                          expression or string.
- Body: Enter the content of the email. This can be an
                          expression or string. The email body will adhere to a string in properly
                          formatted HTML.
![Email flow step inputs](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/c8483385-0944-49a6-802f-5ae8502d05a0.png)

## Step Outputs

The output of the Email step is the sent email. You may see one of the
                following statuses after running the Email step.

- Successful: Occurs when the email is sent successfully.
- Failed: Occurs when the email fails to send.

## Example Use Case

Use the Email step to receive notification of a step’s
                completion. This works well with the [![Conditional flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/17129c7d-c321-4dc7-8c44-e67c5260d596.svg) Conditional flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/conditional-flow-step).

You can also create a flow with just the Email step,
                then use the [![call a flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/2d9d2732-0e01-4be9-b69a-51d6be026153.svg) Call a Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/call-a-flow-step) to call the Email step. This is
                useful when you frequently send flow result emails to the same addresses in the
                Email step.

If you create a flow with the Map to format data found
                in the workflow processing and generate a file (typically a .csv file) from the data
                in the [![Create Delimited File flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7a89e0da-bfa7-4764-894f-fe6e20a12105.svg) Create Delimited File flow
                                        step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/create-delimited-file-flow-step), you can email that file in the
                Email step.
