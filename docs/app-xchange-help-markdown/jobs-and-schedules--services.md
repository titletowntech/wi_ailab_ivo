# Services

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/services
> Captured directly from rendered HTML: 2026-08-14

Services handle the input and output of data between App Xchange and other applications.

For services to function, you must add the connectors for those services to
            your workspace. While services can be added to a workspace directly, adding services via
            the workspace's ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab with a standard integration is not
            recommended, as this desynchronize the jobs from the integration definition.

The two types of services are:

- Cache writer service: Replicates data onto the App Xchange platform. Cache writer services
                  also provide useful logging information, which can be found on the [Cache Write Logs](https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/job-history/cache-write-logs) page. A cache writer is a
                  managed service, as you manually add the cache writer to the feature or workspace
                  and enable the data object to be cache written with a toggle per object. Best
                  practice is to add a new cache writer service per object.
- Action Processor
                      services: Typically send data to an external system. An action
                  processor is an unmanaged service that is automatically added as the result of a
                  flow run via [Real Time Action Processing (RTAP)](https://help.trimble.com/doc/app-xchange/app-xchange/glossary#task-6d078b8b-f2f3-4da6-ab91-65602513eed7--en__RTAP) and
                  typically does not need to be added manually.

The managed services on the ![Jobs icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/09d86dda-0fd5-4de0-b1d2-8e270426ccbf.svg) Jobs tab are registered to the workspace from the integration definition.

Unmanaged services were either manually added to the workspace or created
            through flows that use real-time action processing, like the ![Connector Action flow step icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/55ea75b4-e53b-4201-92e5-1bcb588a542d.svg) Connector Action flow step.

To add a service to an integration, see [Add Services to a Feature](https://help.trimble.com/doc/app-xchange/app-xchange/integrations/integration-builder/add-features/add-services-to-a-feature).
