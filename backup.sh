#!/bin/sh

SCRIPTDIR=`dirname $0`
TOPDIR=`cd $SCRIPTDIR; pwd`
BACKUPDIR="$TOPDIR/backups"
FROMDIR="$TOPDIR/neo4j-db"

install -d -m 755 "$BACKUPDIR"
LATEST_BACKUP=`cd "$BACKUPDIR"; ls -1 | sort -u -n | tail -n 1`
NEW_BACKUP=`date '+%s %Y-%m-%d %H:%M:%S'`

echo "latest backup: $LATEST_BACKUP"
echo "new backup: $NEW_BACKUP"

if [ -n "$BACKUPDIR/$LATEST_BACKUP" ] && [ -d "$BACKUPDIR/$LATEST_BACKUP" ]; then
	LINK_DEST="$BACKUPDIR/$LATEST_BACKUP"
else
	LINK_DEST="$FROMDIR"
fi

echo rsync -aP --link-dest="$LINK_DEST"/ "$FROMDIR"/ "$BACKUPDIR"/"$NEW_BACKUP"/
rsync -aP --link-dest="$LINK_DEST"/ "$FROMDIR"/ "$BACKUPDIR"/"$NEW_BACKUP"/
