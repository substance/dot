# Decentralized Version Control for Structured Documents

`dot` will be tool for decentralised version control of structured
documents, as opposed to `git`, which is for files (particularly good for text files).

A bare repository can essentially be seen as a single main log, bearing
incremental information about resources being added, removed, or updated.
Every single resource needs to be versionable in itself. This is similar to
`git submodules` in that a change in a `submodule` needs to be reflected as 
an update in the parent repository.

A cloned repository consists of an index and a working copy. The index contains
the bare version of the repository, i.e. the main log, and local changes which form the candidate for the next version update.
The working copy on the disk represents the check-out of the main log. When the user open an editor they will see the local changes, similar to what text editors do.

## The Index

The **Index** is the part of the repository consisting only of incremental changes forming the history of the repository
incremental changes. This history is expressed as a log file, which could look like so:

```
V 0
<time> <user1> manifest add { id: "doc1", loc: "document.xml", type: "texture" }
<time> <user1> manifest add { id: "sheet1", loc: "sheet.xml", type: "stencila-sheet" }
<time> <user1> manifest add { id: "assets", loc: "assets", type: "folder" }
<time> <user1> doc1 <...initial changes...>
<time> <user1> sheet1 <...initial changes...>
<time> <user1> assets <...initial changes...>
V 1
```

It consists of blocks of changes forming a sequence of versions.
Every change represents one line in the log.

## The Working Copy

The **Working Copy** is the collection of physical files as of a specific version of the repository. As opposed to the index, these files do not bear any
information about the history, being only a snapshot of the repository at a specific point in time.

## CLI

`dot` shall serve as a command-line interface as well as a library.
The CLI should offer some basic functionality:
- `init`: initialize a repo
- `checkout`: checkout a specific version
- `log`: see the history
- `status`: see local changes
- `clone`: clone a repo from an existing source

In contrast to `git` editing must be done using a dedicated application, e.g. Texture or Stencila, as opposed to a simple text-editor. Otherwise, we will not
be able to record changes incrementally. In the future, we may want try to derive changes from the working-copy files, too.

## Plugins

To be able to create working-copy files from the index, `dot` needs to be
provided with plugins that are capable of:
- importing files by creating initial changes
- updating files by interpreting changes
- inverting a change
- rebasing a change
