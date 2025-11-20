# Analytics XML Fetch TODO

- [x] Update fileHandling/analyticsfetch.php to return XML data instead of JSON
  - [x] Change header to application/xml
  - [x] Generate XML structure with userRoles, topCommunities, activityTrends
- [ ] Update assets/js/admin/analytics.js to parse XML response
  - [ ] Change fetch to parse XML instead of JSON
  - [ ] Extract data from XML elements
- [ ] Test the XML endpoint for valid XML response
- [ ] Verify analytics load correctly in browser with XML data
