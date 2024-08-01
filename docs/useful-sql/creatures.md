## Creatures Sql

Get Heroic Creature Entries for a Map

```sql
SELECT DISTINCT c.entry,c2.name, c2.entry, cr.map, cr.Comment, cr.zoneId
from creature_template c  join creature_template c2 on c.difficulty_entry_1 = c2.entry
join creature cr on cr.id1 = c.entry

where cr.map = 543
```


