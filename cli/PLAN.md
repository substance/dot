# `dot` Command Line Interface

`dot` is something like `git` but for collaborative
editing of `substance` documents. 
Synchronization can be done using `hypercore` and `hyperdiscovery`,
or other means for file synchronizations.

In the beginning, `dot` can only be used for sharing
a HTML document. Later on, we want to allow
other content, i.e. custom `substance` schemas and more
flexible repository layouts (e.g. including assets).

## `dot init`

Should be used to initialize a new repo. In contrast
to `git`, the only way to subscribe to an existing document
is to `dot clone`

The user will be the Master, being the only one allowed
to alter the `master.log`.

## `dot clone`

Should be used to replicate and subscribe to an existing document. 

## `dot adduser`

The owner of a document can add users, storing their public key
in the meta data. Only a registered user can submit pull requests.

Q: how can we ensure that only this user can append to the
corresponding feed (`<user-id>.pr`)?

## `dot reset`

Resets the document to the currently master version.
There is no `checkout`, and `reset` means `reset --hard`.

## `dot pull`

Pulls the latest changes and updates the local pending changes
accordingly.

In contrast to `git`, this is always a `pull --rebase`

## `dot push`

Submit the local pending changes as a pull request.
In contrast to `git`, this does not write to `master` directly.

## `dot log`

Shows the `master` history.

## `dot status`

Shows a pending pull-request and local changes which have
not been proposed a pull-request.

## `dot edit`

Opens the editor (in an electron shell).

# Open Questions

- how can we ensure that a specific user can only
  only alter the feeds they are allowed to?
  E.g. only the Master user should alter the `master.log`

- How does a working-copy as opposed to a bare repository look like?

```
doc-1 /
  document.html    --    the local version of the document
  .dot /           --    managed using dot cli
    config         --    local config (local user name, origin)
    meta /         --    content of the 'bare' repo (which needs to be sync'd)
      users.json   --    users (changed only by owner)
      master.log   --    history of changes (append-only, changed only by owner)
      user1.pr     --    pull-request file for each user (append-only, changed only by user)
      ...
```

- How can we use `dat` or `hypercore` to sync the `meta` folder?

- How can we make `dot` work with arbitrary substance models and seeds?

  We could allow to provide a plugin consisting of one JS bundle exposing
  an exporter, an importer, and a seed

- How to maintain assets along with the document?

  One idea would be to provide an 'add-only' dat stream. I.e. an asset can not be removed. Otherwise we would need to sync the dat / asset store and the substance doc version. 
