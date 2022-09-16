# Changelog

## v0.5.0 (upcoming)

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
