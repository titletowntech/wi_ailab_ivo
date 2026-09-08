# Example App Xchange Flow

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/example-app-xchange-flow
> Captured directly from rendered HTML: 2026-08-14

View a visual example of a flow that adheres to flow-building
                best practices. This example creates a Vista Job from a Procore Project. You can request access to this and other demo flows in your customer portal.

Note the following features and best practices:

1. The flow is [triggered](https://help.trimble.com/doc/app-xchange/app-xchange/flows/triggers#concept-651a6542-bf68-481e-933c-ae1df32d7843--en__h.3w4c8s3eq7s_l) by a change
                                                    to a Projects data object in Procore.
2. A [![Map JSON List or Object flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/9749a832-2992-447b-947c-edd7bfd5481d.svg) Map JSON List or Object flow
                                                  step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/map-json-list-or-object-flow-step)
                                                    assists with transformation or generation of
                                                    properties.
3. A [![Lookup flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/bd42191a-44f4-46fa-8ef5-0c3be2cf51aa.svg) Lookup flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/lookup-flow-step) with a
                                                    [![Conditional flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/17129c7d-c321-4dc7-8c44-e67c5260d596.svg) Conditional flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/conditional-flow-step) is
                                                    used to choose create or update which avoids
                                                    exceptions and assumptions.
4. All paths of the flow end in a [![stop flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/7dd53f6c-9a33-4411-a4cc-3d407c16d6c7.svg) Stop Flow step](https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-steps/stop-flow-step) with
                                                    appropriate status.

![example App Xchange flow to create a Vista Job from a Procore Project](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/300b58b8-34a7-486e-9199-f8c3361bbeff.png)
