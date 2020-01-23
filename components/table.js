import React, { useRef } from 'react'
import BootstrapTable from 'react-bootstrap/Table'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Pagination from 'react-bootstrap/Pagination'
import { useTable, usePagination } from 'react-table'
import { useDebouncedCallback } from 'use-debounce'

// Let's add a fetchData method to our Table component that will be used to fetch
// new data when pagination state changes
// We can also add a loading state to let our table know it's loading new data
function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  onRowClick,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
      pageCount: controlledPageCount,
    },
    usePagination
  )

  const textSearch = useRef(null)

  const [onSearch] = useDebouncedCallback(() => {
    fetchData({ pageIndex: 0, pageSize, search: textSearch.current.value })
  }, 750)

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize })
  }, [fetchData, pageIndex, pageSize])

  // Render the UI for your table
  return (
    <Row>
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}
      <Col xs={{
        span: 3,
        offset: 9
      }} className="mb-2">
        <Form.Control ref={textSearch} type="text" placeholder="Search" onChange={onSearch} />
      </Col>
      <Col xs={12}>
        <BootstrapTable striped bordered hover size="sm" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {(page.length < 1 && !loading) ? <tr>
              <td className="text-center" colSpan="10000">No results</td>
            </tr> : page.map((row, i) => {
              prepareRow(row)
              return (
                <tr onClick={() => onRowClick(row.original['_id'])} {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
            {loading && (
              // Use our custom loading state to show a loading indicator
              <tr>
                <td className="text-center" colSpan="10000">Loading...</td>
              </tr>
            )}
          </tbody>
        </BootstrapTable>
        {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
        <Pagination className="float-right">
          <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
          <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />
          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
        </Pagination>
      </Col>
    </Row>
  )
}

export default Table