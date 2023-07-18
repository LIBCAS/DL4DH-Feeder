# Changelog

## v1.4.0

- OpenAPI documentation improments with OpenIDConnect authorization
- Bibliography - genre added, page routing fix, fetch timeout changed
- Refactoring backend classes
- Export dialog teiParams fix
- Export name to payload
- History GET and DELETE endpoint
- History elements can be named
- Write a number of found documents when a search query is saved

## v1.3.0

- parent and self linking updating fix
- internal parts list and tabs display
- refactoring bibliographic mods parsing
- design responsiveness
- multiview context
- donators image
- hint and search params refactoring
- nametag highlighting
- login required to save filters
- accordion padding
- TeiParams as lists
- translations for exports and print added
- next and previous periodical title added
- vertical page orientation word highlighting
- new streams: SOLR, SOLR_PLUS, FOXML
- negative queries fix
- user info dialog
- date filter limitations changed
- UTF-16 detection and refetching OCR stream
- memory limits improvements
- zoomify image center fix
- timestamp to search history
- contact info configurable
- search through pages
- back button update
- parentPid to Solr index
- a lot of small fixes

## v1.2.1

- upgrade spring dependencies 
- cache configuration
- optimization of Kramerius collections loading through cache 

## v1.2.0

- refactoring search api with new search service
- add old fields to solr scheme for backward compatibility
- index root document with all enriched data
- FIX search with a lot of enriched publications

## v1.1.0

- export endpoint with format inside request payload
- homepage info with basic text
- disable menu link to a user account
- documents import from Kramerius+ with pagination
- feed api performance improvement
- hardbreak if there is a loop while importing new publications
- filter sort option LAST_ENRICHED
- search history, pagination, sorting, nametags parsing
- fill export name with first name of publication
- TEI export nametag attributes
- audit model with createdAt and updatedAt fields
- FIX typos and nullables
- FIX generate export button
- FIX export format style
- FIX download of enriched pages from Kramerius+

## v1.0.0
- released first official public version for reviewers

## v0.7.0
  - exports:
    - items selected for export are saved in local storage
    - nested periodicals exporting added
    - button for checking ALTO streams availability of all selected publications in bulk export dialog
  - publication detail: 
    - main filter (from "homepage") can be turned on/off when searching another publication in detail view/multiview
    - FIXED - https://github.com/LIBCAS/DL4DH-Feeder/issues/33
    - OCR mode now remembers fontsize (zoom factor) when navigating to other page
    - toolbar shows only relevant buttons in each mode (OCR / zoomify mode)
  - pub. bibliography info:
    - fixed order (same as it is in Kramerius) of biblio items - for non periodical publications
    - author dialog added (with roles and dates)
  - search history API with optional save
  - delete unpublished documents during synchronization
  - solr schema extended with `facet_author` and `model_path` fields 

## v0.6.2

- enrichment checkbox added in list view (https://github.com/LIBCAS/DL4DH-Feeder/issues/16)
- select all / deselect all (https://github.com/LIBCAS/DL4DH-Feeder/issues/14)
- biblio_mods stream parsing added (biblio info on side panel)
- another translations added
- optimized check query for enrichment flag
- advanced filter through solr edismax parser
- FIX: search while used nameTag hinter

## v0.6.1

- homepage visited and newest enriched publication tiles added
- multilanguage support and translations added

## v0.6.0

- export selected pages (JSON and CSV)
- export selected publications
- added searching in set of records on the left sidebar
- basic OCR mode in zoomify view added
- Feed API (custom, newest, mostdesirable)
- export parameters as text column in database
- FIX: search api - do not group root pid, list as a facet to show all results

## v0.5.1

- zoomify:
  - words highlighting added
  - preloading static image improved
  - not found message fix - it's hidden when vector layer is loading
- periodicals
  - supplements routing  fix
  - monograph unit / bundle tile styling fix
- enriched publication tile styling changed
- model and enrichment tags added to publication detail view
- new Kramerius+ export API integration
- FIX: searching in a set of records initial value fix

## v0.5.0

- collections and browse pages added with sorting and filtering
- share functionality and dialog added
- print functionality and dialog added
- searching within publication with / without nameTag hinting
- responsiveness for very small screen resolutions improved (in search/browse part of the web)

## v0.4.1

- tooltips login improved and positioning
- collections draft
- top bar refactoring
- FIX: url link to Kramerius
- FIX: TEI export parameters
- FIX: export download button styling
- FIX: hide nameTagFilter if empty

## v0.4.0

- authentication:
  - sign out integration
  - top bar menu information about logger in user
  - top bar menu for export only for logged in user
  - FIX: refresh token
- exports:
  - all parameters and formats available from Kramerius+ with different options for enriched and not enriched publication
  - fetching number of publication pages
  - sorting, pagination, publication name, new columns and detail of an export in a modal
  - chips used as parameters during export request
  - FIX: downloading of successful exports
  - FIX: notification shows immediately after submitting an export request
- sidebar:
  - localstorage used for storing information about opened sections
  - improved rendering - do not needed to rerender while moving to another page
  - nameTag filter with autocompleted hinting
- item endpoint - information about enrichment
- Kramerius item DTO
- extend of an export object with publication name, format, params
- prepared tooltip component for showing a help text and buttons
- FIX: CORS problems with keycloak

## v0.3.1

- side menu for smaller screens
- view for periodicals
- exports history with download option
- UI publication export
- virtual scrolling for JSON stream
- sorting DESC in graph view
- library name as home button
- FIX: background for page /about
- FIX: removed pagination in graph view

## v0.3.0

- user authentication with keycloak
- exports enriched publications for authenticated users
- language codes to names
- year filter - get minimum and maximum from available filters
- nametag categories names
- improved dialog for nametag filters
- graph axis x correction
- zoomify animation during rotation
- improved streams dialog design
- JSON stream for item and children
- implementation of publication's structure page for periodicals
- openapi documentation version, title and url fix behind a reverse proxy
- test for text extraction from ALTO
- UX: static image before loading tiles
- FIX: side panels hiding
- FIX: zoom and zoom buttons

## v0.2.1

- facets for enrichment and years
- facets for nametag entities
- UI: nametag icons in top search box
- UI: different style for enriched publication
- UI: information page
- FIX: nametag dropdown searchbox texts
- FIX: automatic import publications from Kramerius+

## v0.2.0

- integration to Kramerius+ API for publications
- search on enriched publications
- sorting of search results
- thumbnails load and cache improvements
- UI: tiles, pagination, tables redesign
- UI: exports options mockup
- UI: viewer for periodicals
- UI: zoomify fullscreen and rotations
- FIX: fonts and minor bugs

## v0.1.0

- initial version of the application
- search endpoint
- integration to Kramerius API
- thumbnails and streams endpoints
