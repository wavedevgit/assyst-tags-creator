# Assyst types

Types for assyst eval javascript context.

## Structure

-   `index.d.ts`
    Global type exports used across the Assyst eval environment.

-   `fetch.ts`
    Custom fetch type definitions tailored for Assyst's runtime behavior.

-   `ImageScript.d.ts`
    Type definitions derived from the `imagescript` npm package.
-   `discord/*`
    Types of discord objects, used generally for typing `globalThis.message`.

## Notes

This package targets a non-standard JavaScript runtime used by Assyst. Some APIs may differ from standard Node.js or browser implementations.

## Licenses

This project includes or derives code from third-party libraries under the following licenses.

### @happyenderman/assyst-tag-types

Licensed under the GNU General Public License v3.0 (GPL-3.0).

License:
https://github.com/wavedevgit/assyst-tags-creator/blob/main/LICENSE

### imagescript

Licensed under:

-   GNU Affero General Public License v3.0 (AGPL-3.0-or-later)
-   MIT License

SPDX: AGPL-3.0-or-later OR MIT

License:
https://github.com/matmen/ImageScript/blob/master/LICENSE
