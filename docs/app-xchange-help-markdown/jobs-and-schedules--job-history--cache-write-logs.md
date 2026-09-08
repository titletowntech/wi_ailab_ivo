# Cache Write Logs

> Source: https://help.trimble.com/doc/app-xchange/app-xchange/jobs-and-schedules/job-history/cache-write-logs
> Captured directly from rendered HTML: 2026-08-14

The cache writer service outputs in the ![Job History icon](https://help.trimble.com/dist/suf/product-guides/heretto/app-xchange/en/app-xchange/02d2e899-a51b-47cb-b3dd-8aff9c5df5ca.svg) Job History tab contains useful logging information.

## Change Detection Log

The change detection log keeps track of all the records passed through a
        connector to the cache to regulate and filter data traffic sent to the App Network. If the
        system identifies that the data brought from the cache writer is identical to what is
        already stored in the cache, it will not pass it through. This system is used by default,
        but note that there may be situations in which it is not used, such as with an incremental
        data reader. The change detection log tracks these change statuses.

- Unchanged:
            The cache does not need to be changed.
- Inserted:
            A new record is detected that needs to be added to the cache.
- Updated:
            The record exists in the cache but has changed in the target system and needs
            updating.
- Deleted:
            The record no longer exists in the source connection and will be removed from the
            cache.

In the log example below, two records are identified as unchanged and
        one object record is identified as to be deleted.

`11/19/2024 @ 11:21 am / CacheWriterServiceSqlite      Change detection system
          determined that there were 0 new records, 0 updated records, 2 unchanged records, and 1
          deleted records for object of type <{connector}/{module}/{object}>.`

## App Network Sync Summary Log

Once the data has been sent to the App Network, the App Network displays the sync operations executed against the cache. In the example below, the record deleted from the target system was successfully deleted from the cache.

`11/19/2024 @ 11:21 am / CacheWriterServiceSqlite      App
          Network sync summary for "{connector}/{module}/{object}"      Inserts: 0 successful, 0 no
          change, 0 failed      Updates: 0 successful, 0 no change, 0 failed      Deletes: 1
          successful, 0 no change, 0 failed`

The `no change` counter indicates if the sync
        operation made any change to cache. There could be scenarios where the change detection
        system identifies a change needed, but the cache is already synchronized. This could happen
        if the cache has already been updated from an action output writing new data to the cache, a
        later cache write might see the data already exist and will show as an Update: no
        change.

While the change detection system helps limit unnecessary data movement, actual changes to the cache, from actions or cache writer service and App Network sync summary, trigger flows as cache events.

## Additional Cache Log Examples

Example 1: First Cache Write Run

`Change detection system determined that there were 3 new records, 0 updated
          records, 0 unchanged records, and 0 deleted records for object of type
          <{connector}/{module}/{object}>.        App Network sync summary for
          <{connector}/{module}/{object}>.       Inserts: 3 successful, 0 no change, 0 failed
          Updates: 0 successful, 0 no change, 0 failed       Deletes: 0 successful, 0 no change, 0
          failed`

The cache detection system will mark all records retrieved as new records since there is no previous tracking stored. Due to this, the App Network identifies that all records were inserted successfully into the cache.

Example 2: Cache Write Without Changes in Target System

`Change detection system determined that there were 0 new records, 0 updated records,
          3 unchanged records, and 0 deleted records for object of type
          <{connector}/{module}/{object}>.        App Network sync summary for
          <{connector}/{module}/{object}>.       Inserts: 0 successful, 0 no change, 0 failed
          Updates: 0 successful, 0 no change, 0 failed       Deletes: 0 successful, 0 no change, 0
          failed`

The change detection system detects that there are no changes in the records obtained in this run and therefore does not send any changes to be applied to the App Network.

Example 3: Update Records With Out-of-Date Change Detection

`Change detection system determined that there were 3 new records, 0 updated records,
          0 unchanged records, and 0 deleted records for object of type
          <{connector}/{module}/{object}>.        App Network sync summary for
          <{connector}/{module}/{object}>.       Inserts: 0 successful, 0 no change, 0 failed
          Updates: 0 successful, 3 no change, 0 failed       Deletes: 0 successful, 0 no change, 0
          failed`

The change detection system might identify data as new that is already synchronized, most likely from an action output, so data is sent and compared for updating. App Network identifies the data as already complete and subsequently reports there were three updates with no changes.

Example 4: Delete Data With Out-of-Date Change Detection

`Change detection system determined that there were 0 new records, 0 updated records,
          3 unchanged records, and 1 deleted records for object of type
          <{connector}/{module}/{object}>.        App Network sync summary for
          <{connector}/{module}/{object}>.       Inserts: 0 successful, 0 no change, 0 failed
          Updates: 0 successful, 0 no change, 0 failed       Deletes: 0 successful, 1 no change, 0
          failed`

Similar to Example 3, change detection may identify a delete or insert as new when it has already been accomplished. In this example, the deletion of a record had been executed in both the target system and the cache. When the write cache is run, the change detection system sends the instruction to delete a record. The App Network cache executed this instruction, but it did not cause any change in the cache since this record was already deleted.
