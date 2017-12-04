# Projects

## VCS - Iteration I <a id="vcs-iteration-1"></a>

- Issue Tracker: [Project 1](https://github.com/substance/dot/projects/1)
- Background: [Decentralised Vesion Control System](vcs.md)
- **Topic: Simple Editing**
- Consider a scenario with a single user using `Texture`
- The user starts with an empty folder
- The user calls `texture init .` to seed the folder with a blue-print layout:
  ```
  document.xml (JATS4M)
  entities.json (EntityDB)
  assets/ (Folder)
  ```
- The user opens the editor using `texture .`
- The user changes the document, which marks the local version as unsaved
  -> need to detect if the working copy is in sync with the index (including local changes)
- Saving the document writes the local changes to the working copy
- The user can see local changes using `dot status`

Goals:
- a simple way to create an empty Texture document
- ability to persist local changes and update the working copy

No-Goals:

- a generalized `dot` CLI
- seeding the index with an existing working copy
- ability to do versioning (commits, checkout)

## VCS - Iteration II <a id="vcs-iteration-2"></a>

- Background: [Decentralised Vesion Control System](vcs.md)
- **Topic: Versioning**
- Consider same scenario as in Iteration I
- The user starts with a seeded Texture document
- The user has applied local changes
- The user can create a new version using `dot commit -m <msg>`
- The user can see the version history using `dot log`
- The user can checkout different versions using `dot checkout <version>`

Goals:
- ability to create versions and checkout the working copy
  for specific versions

## VCS - Iteration III <a id="vcs-iteration-3"></a>

- Background: [Decentralised Vesion Control System](vcs.md)
- **Topic: Ingestion**
- Consider the same scenario as in Iteration II
- The user starts with a folder with this structure:
  ```
  document.xml (JATS4M)
  entities.json (EntityDB)
  assets/ (Folder)
  ```
- The user calls `dot init --format texture .`
- Rerunning `dot init` in the same folder should be prevented

Goals:
- ability to start versioning with an already existing Texture document
- ability to register a `dot` plugin supporting the Texture repository layout.

No-Goals:
- custom repository layout with automatic resource type detection
