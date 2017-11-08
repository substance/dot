# Decentralized Collaborative Document Editing

## Mission

Developing an OT based protocol that allows for a decentralized implementation.

## Proposal

The core of the Document is a shared ChangeLog - being an incremental representation of a document’s content:

```
V 0
U1 change-1 { … serialized change … }
U1 change-2 { … }
…
U1 change-10 { … }
V 1
U2 change-X { … }
U2 change-Y { … }
…
U2 change-Z { … }
V 2
```

The first and the last line are always Version Bumps.
Between Version Bumps there are document changes of only a single user.
There are multiple changes as we consider offline-scenarios, too, where many changes are gathered before they are actually sent to  the Master.

Every user has their own file of pending changes (Pull Request):

```
V 1
U1 change-11 { … }
U1 change-12 { … }
U1 change-13 { … }
```

A User’s pending changes are submitted to the Master for merge, but are only accepted if they are based on the latest version of the document (Fast-Forward merges only).
If the User’s changes are based on an earlier version they first need to rebase their changes considering the changes applied in the meantime.

This workflow can be done either automatically, manually, or semi-automatically.

Technically the problem can be solved in different ways, using a file-system, dat.js, or DB and websockets, for instance.

### Example: Concurrent Editing

User A and B are starting both with Document being in version 10.

**master**:

```
V 1
… 
V 10
```

**A.pr**:

```
V 10
A a1 { … }
A a2 { … }
A a3 { … }
```

**B.pr**:

```
V 10
B b1 { … }
B b2 { … }
```

User A is considered first for merge (arbitrary choice by Master)

**master**:

```
… 
V 10
A a1 { … }
A a2 { … }
A a3 { … }
V 11
```

By watching the common history, User A knows that his changes have been merged. He removes the applied changes from the list of pending changes. He bumps the local state to V 11

**A.pr**:

```
V 11
```

User B on the other hand knows now, that he will not be considered for merge as long he does not rebase the changes to V 11. He uses a1-a3 to rebase b1-b2, and also updates his documnet accordingly (using OT rebase)

**B.pr**: 
(after rebasing using a1..a3

```
V 11
B b1 { … }
B b2 { … }
```

Now the Master can consider the changes of B, as they are based on the latest version.

**master**:

```
… 
V 11
B b1 { … }
B b2 { … }
V 12
```

User A sees the merge and applies them to his local document bumping to V 12 (empty list of changes).

At the same time User B removes the changes from the list of pending changes and bumps to V 12.


## Protocol

The protocol should be platform agnostic as not needing bi-directional communication. It should derive actions just by analysing the state of shared files. 
The Master publishes a master log file and subscribes to user files which can be seen as pull-requests. Each user publishes their pull request and subscribes to the master log.

There are only two cases which need to be considered

1. Merge: the Master detects a change of one of the user files. If and only if the version in the user files is the same as in master, it merges the changes to the master and bumps/increments the version.

> Note: with two concurrent changes, the first would get merged, but the second ignored, because by then the master version would have been incremented already.

2. Pull-Rebase: A user detects a change of master. If there is a change done by a different user, it applies the foreign change, and rebases the local changes. If there is a change of the very same user, the change gets removed from list of pending changes. The local version gets bumped to the latest master.

# Getting Started

```
git clone https://github.com/substance/dot
cd dot
npm install
npm start
```

Then open `http://localhost:4002/test`.
Open the Inspector to step through the example.

# Why 'dot'?

Maybe:
- because its short
- decentralized operational transformation
- document editor using `dat.js`
- like `git` but for documents
