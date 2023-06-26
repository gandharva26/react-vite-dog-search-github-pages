import { useState, useMemo } from "react";
import { sortRows, filterRows, paginateRows } from "./Helpers";

export const Table = ({ columns, rows, selectedElementsArray }) => {
  const [activePage, setActivePage] = useState(1);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ order: "asc", orderBy: "breed" });
  const rowsPerPage = 10000;

  const filteredRows = useMemo(
    () => filterRows(rows, filters),
    [rows, filters]
  );
  const sortedRows = useMemo(
    () => sortRows(filteredRows, sort),
    [filteredRows, sort]
  );
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage);

  const count = filteredRows.length;
  const totalPages = Math.ceil(count / rowsPerPage);

  const [selectedElements, setSelectedElements] = useState([]);

  const handleSearch = (value, accessor) => {
    setActivePage(1);

    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }));
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };
        delete updatedFilters[accessor];

        return updatedFilters;
      });
    }
  };

  const handleSort = (accessor) => {
    setActivePage(1);
    setSort((prevSort) => ({
      order:
        prevSort.order === "asc" && prevSort.orderBy === accessor
          ? "desc"
          : "asc",
      orderBy: accessor,
    }));
  };

  const clearAll = () => {
    setSort({ order: "asc", orderBy: "id" });
    setActivePage(1);
    setFilters({});
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column) => {
              const sortIcon = () => {
                if (column.accessor === sort.orderBy) {
                  if (sort.order === "asc") {
                    return "⬆️";
                  }
                  return "⬇️";
                } else {
                  return "️↕️";
                }
              };
              return (
                <th key={column.accessor}>
                  <span>{column.label}</span>
                  <button onClick={() => handleSort(column.accessor)}>
                    {sortIcon()}
                  </button>
                </th>
              );
            })}
          </tr>
          <tr>
            {columns.map((column) => {
              return (
                <th>
                  <input
                    key={`${column.accessor}-search`}
                    type="search"
                    style={{ maxWidth: "15vh" }}
                    placeholder={`Search Here`}
                    value={filters[column.accessor]}
                    onChange={(event) =>
                      handleSearch(event.target.value, column.accessor)
                    }
                  />
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {calculatedRows.map((row) => {
            let html = "";
            return (
              <>
                <tr key={row.id}>
                  {columns.map((column, index) => {
                    if (column.format) {
                      return (
                        <td key={column.accessor}>
                          {column.format(row[column.accessor])}
                        </td>
                      );
                    }

                    if (index == 4) {
                      return (
                        <td key={column.accessor}>
                          <img
                            style={{ width: "100px", height: "100px" }}
                            src={row[column.accessor]}
                          />{" "}
                        </td>
                      );
                    }
                    return (
                      <>
                        <td key={column.accessor}>{row[column.accessor]}</td>
                      </>
                    );
                  })}

                  <input
                    onChange={(e) => {
                      if (e.target.checked === true) {
                        setSelectedElements([...selectedElements, row.id]);
                      } else {
                        setSelectedElements(
                          selectedElements.filter((elem) => elem != row.id)
                        );
                      }
                      console.log(selectedElements);
                    }}
                    style={{
                      border: "2px dashed #fff",
                      display: "block",
                      background: "#000000",
                      height: "50px",
                    }}
                    name={row.id}
                    type="checkbox"
                    value={row.id}
                  />
                </tr>
              </>
            );
          })}
        </tbody>
      </table>

      {count < 0 && <p>No data found</p>}

      <div>
        <p>
          <button onClick={clearAll}>Clear All</button>
        </p>
      </div>

      <button onClick={() => selectedElementsArray(selectedElements)}>
        Submit Selections
      </button>
    </>
  );
};
