# Account & Privacy Center (Guest v1)

The My China area now contains a guest-mode privacy center with a local-data summary, backup action, migration preview, and privacy status.

- Shows whether a trip exists and counts city, attraction, experience check-ins, favorites, and profile configuration.
- Records the timestamp/version of the last initiated JSON export locally. This is a bookkeeping timestamp, not proof that the user retained the downloaded file.
- Export remains a v2 JSON backup.
- Import refreshes the summary after restoring data.
- Reset removes the privacy metadata along with existing My China local data.
- No authentication, remote upload, cloud sync, or account deletion endpoint is connected.

## Privacy limitation
This prototype stores data in browser local storage. Users sharing a device/browser profile may be able to access it. A future account implementation must provide authenticated access, secure session handling, server-side deletion, and clear backup/download verification.
