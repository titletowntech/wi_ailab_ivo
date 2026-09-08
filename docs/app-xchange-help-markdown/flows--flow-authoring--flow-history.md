# Flow History

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/flow-history
> Captured directly from rendered HTML: 2026-08-14

The flow builder's ![flow history icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/65a729db-df28-40c9-a8b3-4bb1fcfab5c8.svg) History menu allows users to revert to any previously
                saved version of a flow, regardless of whether they are on staging or
                main.

No saved changes are discarded when you revert to a
                        previous version. The current flow will still exist in the flow history.
                        There is no limit to how many versions can be contained in the history.

Select any version to see its flow steps. Several
                        icons indicate the deployment status of these flows.

- The paper icon is a draft not saved
                                          to staging or main.
- The flask icon is the current
                                          version on staging.
- The crown icon is the current
                                          version on main.
- The arrow icon is the previous main
                                          version. Use this to revert any changes and send the current
                                          main version to draft.

## Revising a Flow

The History tab is an essential tool
        for revising flows.

When investigating an error from a past flow run, you can
            use the History tab to view the specific flow version used for
            that particular run. Use the Runs tab to see which flow was used during the failed
            run.

For example, this flow was run with version 67048:

## Republish a Previous Version of a Flow

You can choose to revert back to any of the previous versions
        listed in the flow's history.

1. In the ![flow history icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/65a729db-df28-40c9-a8b3-4bb1fcfab5c8.svg) History menu of a flow, select the version you want to
                      republish.
2. Select Deploy to
                      Staging.
                  A pop-up notification confirms this was successful.
3. Select Promote to
                      Main.
4. Select OK in the Promote to
                      Main window.
The flow is reverted back to a previous version.
