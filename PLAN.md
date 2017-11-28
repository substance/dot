# Document Repository

The basic idea is to use one change-log to maintain
a repository with multiple documents or resources.
Resources can be of different type, each of them coming from
a different source. E.g. they could be a Substance document,
a data folder, or even a data-base. Each of them must provide
a means for versioning. The repository version can be seen
as a tuple of versions of all the resource, very much like
git it works with submodules.

# Milestone 1

Scope:
- a repository contains only one Substance Document resource (Texture/JATS4M)
- it should be possible to 'checkout' a working copy at a specific version

Technical considerations:
- the repository is seeded using a fixture (no generalized CLI)
- the main focus is on navigating through time
  being able to checkout a specific version
- it is not important how the index is serialized.
  The easier the implementation, the better. 

Tasks:
- a seed script to setup the initial repository
- a script that allows to traverse the index updating the
  working copy accordingly




# Milestone X

Considered scenario:
- repo as in Milestone 1
- now there are two collaborators: one is the owner, and one a collaborator
- the repository index is sync'd via file-system (locally)
- both users can edit the document at the same time
- pull-requests are written constantly, and
  merges are done instantly

Technical considerations:
- the shared repository and both clones are seeded using a fixture (no generalized CLI)
- synchronization is done via bundler (watching via chokidar)
- merges 
- each editor is watching for the respective changes updating
  the working copy (not CLI but real-time via editor)

Implementation:
- seed script to setup the initial repository
- seed scripts to setup a clone for the owner and one collaborator
- synchronization script that keeps the clone in sync with the repository index in a shared folder
- editor that writes loads the working copy master + local changes
- mechanism to extract the difference of the working copy with the shared index
    -> TODO: need be more specific
- mechanism to update the local working copy (while the editor is open)
- documentation and diagrams documenting the approach
