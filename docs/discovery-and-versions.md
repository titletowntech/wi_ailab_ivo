# Discovery Log and Flow Versions

Two customer-workspace features that answer "why does this flow look like this?" and "how do
I get back to what it looked like before?"

Both live in the customer workspace at `/workspace?customer=<KEY>` — the discovery log on its
own **Discovery** tab, version history behind the **Versions** button in the header.

## Discovery log

What the customer asked for, what their fields mean, and what they do not want brought in.
Each entry is a note or an imported transcript; inside an entry, the concrete asks are tagged
as **decisions** so the log can be filtered and driven from rather than only re-read.

```text
customers/<customer>/
  workspace/discovery.json      # the log
  input/context/<file>          # the original imported transcripts
```

Originals stay under `input/context/` with the other externally supplied evidence; the
extracted text and the reviewer's tagging live in `discovery.json`.

### Entry shape

```json
{
  "id": "2026-09-09T14-02-11-000Z",
  "date": "2026-09-09",
  "title": "Discovery call",
  "source": "transcript",
  "sourceFile": "customers/KNA/input/context/2026-09-09-discovery-call.docx",
  "body": "Cody: We really only need equipment and jobs to start...",
  "decisions": [
    { "category": "service", "statement": "Only equipment and jobs to start", "object": "", "field": "", "status": "applied" },
    { "category": "exclude", "statement": "Do not bring rental fields", "object": "equipment", "field": "", "status": "open" }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

`source` is `transcript`, `note`, `meeting`, or `email`. Entries are stored newest first.

### Decision categories and status

| Category | For |
| --- | --- |
| `service` | A source object or feature the customer wants synced |
| `field` | What a field actually means, especially a custom one |
| `include` / `exclude` | Data they do or do not want brought into IVO |
| `rule` | A business rule that changes flow logic |
| `question` | Something unresolved that blocks a mapping or flow decision |

`status` is `open` (recorded, not yet reflected in the flows), `applied` (reflected), or
`rejected` (decided against). **`open` is the working queue** — it is the "history of changes
required" this log exists to keep. The tab's counters and the per-entry badge track it, and
the category and status filters narrow the list to entries containing a matching decision.

### Importing a transcript

Import accepts `.txt`, `.md`, `.vtt`, `.srt`, and `.docx`. Text extraction is done locally
with no dependencies:

- **`.docx`** is read as the ZIP archive it is; the text comes from `word/document.xml`.
- **`.vtt` / `.srt`** drop cue numbers and timings, keep `<v Speaker>` attribution, and
  collapse the repeated lines rolling captions produce.
- A leading `YYYY-MM-DD` in the filename becomes the entry date, since transcript exports are
  usually named for the meeting.

Importing only extracts and files the text. **Nothing is tagged for you** — the reviewer
decides what counts as a decision, which keeps the generated-versus-approved split intact.

## Flow versions

```text
customers/<customer>/workspace/versions/<id>.json
```

Each file is a complete workspace snapshot plus metadata. There is one history, not two:
approvals are versions of kind `approval`, and the review dialog's approval history is that
subset.

| Kind | Created when |
| --- | --- |
| `session` | Automatically as you edit. Draft saves are debounced per keystroke batch, so consecutive edits fold into one version — a new session starts after 30 idle minutes or once a checkpoint or approval intervenes. A save that changes nothing creates no version. |
| `checkpoint` | You name one deliberately, optionally citing the discovery entry that motivated the change. Also written automatically around a restore. |
| `approval` | Workspace approval. |

### Restoring

Select a version to see how each flow compares with the current draft — added, deleted,
changed, or unchanged — then restore either a single flow or the whole workspace.

A restore is bracketed by two automatic checkpoints: `Before restoring <version>` and
`Restored ... from <version>`. **The state you restored away from is never lost**, so a
restore is itself undoable.

Anything restored returns to `needs-review`, both the workspace and the affected flows. A
restored flow carries no approval it had in the past — the reviewer approves the flow as it
now stands.

## Why these two features belong together

The App Xchange platform has no flow export, no import, and no backup — flow configuration
lives only in the platform's cache. The version history is the backup that does not otherwise
exist, and the discovery log is the record of why each change was made. A checkpoint that
cites a discovery entry ties the two together: the version shows what changed, the entry
shows who asked for it and when.
