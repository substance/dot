import { DocumentNode, Document, without } from 'substance'

/*
  This schema is used to describe a repo with multiple
  resources that may have different sources, and types.
  E.g. Substance documents, Dat archives, SQL database with
  changelog, folder with assets, etc.

  This is kind of a meta-versioning approach,
  similar to how git submodules work.
  I.e. to bring a change in one of the resources into the
  repository, the version of the resources needs to be bumped
  via a change in the repository.

  The file structure could look like this
  ```
  .dot/
    repo/
      index.log  <=> synced (somehow)
      prs/
        <user>.pr  => Users only push their PR,
        ...           Master User, syncs all of them
    config

  working-copy:
  doc.xml           -> JATS4M
  sheet1.xml        -> Stencila Sheet
  sheet2.xml        -> Stencila Sheet
  data.csv          -> Generated from subscribed data-set (read-only)
  assets/           -> Folder or Dat
  ```
*/

// A resource that has a Substance Data schema
export class SubstanceDocumentResource extends DocumentNode {}

SubstanceDocumentResource.schema = {
  type: 'document',
  schemaName: 'string', // Substance Document type
  schemaVersion: 'string',
  version: 'string', // sha
  location: 'string', // checkout (file or folder)
}

export default class Repository extends Document {}
