# Performance Considerations

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/flows/flow-authoring/performance-considerations
> Captured directly from rendered HTML: 2026-08-14

Reference the platform's technical memory limits to ensure
        optimal system performance and stability. Exceeding them can cause flow errors.

| Item |  |
| --- | --- |
| A single data object per workspace |  |
| Memory Limits | 2 MB |
| A type of data object per workspace (for example, Employees) |  |
| Memory Limits | 20 GB |
| An action input |  |
| Memory Limits | 5 MB |
| File size |  |
| Memory Limits | 1 GB |
| A flow |  |
| Memory Limits | 2.5 GB Note: Note that the flow memory limit is for the flow until it completes. Looking up data and calling an action both add to a flow’s memory footprint. |

| Item | Memory Limits |
| --- | --- |
| A single data object per                                 workspace | 2 MB |
| A type of data object per                                 workspace (for example, Employees) | 20 GB |
| An action input | 5 MB |
| File size | 1 GB |
| A flow | 2.5 GBNote: Note that the flow                                     memory limit is for the flow until it completes. Looking up data                                     and calling an action both add to a flow’s memory footprint. |
