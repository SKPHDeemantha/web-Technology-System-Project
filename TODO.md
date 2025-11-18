# TODO: Implement Pagination for Users Table

## Pending Tasks
- [ ] Add global variables for currentPage and itemsPerPage in users.js
- [ ] Modify renderUsersTable to accept page and itemsPerPage parameters, slice the filtered users array accordingly
- [ ] Create renderPagination function to dynamically generate pagination HTML based on total users, current page, and items per page
- [ ] Update initUsersTable to initialize pagination after rendering the table
- [ ] Add event listeners for pagination buttons (previous, next, page numbers) to change page and re-render table and pagination
- [ ] Ensure pagination works with filtering by resetting currentPage to 1 when filter changes
- [ ] Test the pagination functionality to ensure it works correctly
