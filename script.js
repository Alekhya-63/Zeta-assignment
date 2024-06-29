const rowsPerPageSelect = document.getElementById("rowsPerPage");
let rowsPerPage = parseInt(rowsPerPageSelect.value, 10);
let currentPage = 1;
let data = [];
let filteredData = [];
let sortOrder = 'asc';
let sortColumnIndex = null;

async function fetchData() {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const json = await response.json();
    return json;
}

window.onload = async function () {
    data = await fetchData();
    filteredData = data;
    renderTable();
    updatePageInfo();
};

function renderTable() {
    const tableBody = document.querySelector("#dataTable tbody");
    tableBody.innerHTML = "";

    if (sortColumnIndex !== null) {
        sortData();
    }

    const start = (currentPage - 1) * rowsPerPage;
    const end = Math.min(start + rowsPerPage, filteredData.length);
    const pageData = filteredData.slice(start, end);

    pageData.forEach(row => {
        const tr = document.createElement("tr");
        const columns = [
            row.name.common,
            row.capital ? row.capital.join(", ") : '',
            row.region,
            row.population,
            row.area
        ];
        columns.forEach(cell => {
            const td = document.createElement("td");
            td.textContent = cell;
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}

function sortTable(columnIndex) {
    if (sortColumnIndex === columnIndex) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
        sortOrder = 'asc';
        sortColumnIndex = columnIndex;
    }
    renderTable();
}

function sortData() {
    filteredData.sort((a, b) => {
        const cellA = getColumnValue(a, sortColumnIndex);
        const cellB = getColumnValue(b, sortColumnIndex);
        if (typeof cellA === 'string') {
            if (cellA.toLowerCase() < cellB.toLowerCase()) return sortOrder === 'asc' ? -1 : 1;
            if (cellA.toLowerCase() > cellB.toLowerCase()) return sortOrder === 'asc' ? 1 : -1;
        } else {
            if (cellA < cellB) return sortOrder === 'asc' ? -1 : 1;
            if (cellA > cellB) return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });
}

function getColumnValue(row, index) {
    switch (index) {
        case 0: return row.name.common;
        case 1: return row.capital ? row.capital.join(", ") : '';
        case 2: return row.region;
        case 3: return row.population;
        case 4: return row.area;
        default: return '';
    }
}

function filterTable() {
    const filter = document.getElementById("filterInput").value.toLowerCase();
    filteredData = data.filter(row => {
        return (
            row.name.common.toLowerCase().includes(filter) ||
            (row.capital && row.capital.join(", ").toLowerCase().includes(filter)) ||
            row.region.toLowerCase().includes(filter) ||
            row.population.toString().includes(filter) ||
            row.area.toString().includes(filter)
        );
    });
    currentPage = 1;
    renderTable();
    updatePageInfo();
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePageInfo();
    }
}

function nextPage() {
    if (currentPage * rowsPerPage < filteredData.length) {
        currentPage++;
        renderTable();
        updatePageInfo();
    }
}

function updatePageInfo() {
    document.getElementById("page-info").textContent = `Page ${currentPage} of ${Math.ceil(filteredData.length / rowsPerPage)}`;
    document.querySelector(".pagination button:nth-child(1)").disabled = currentPage === 1;
    document.querySelector(".pagination button:nth-child(3)").disabled = currentPage * rowsPerPage >= filteredData.length;
}

function changePerPage() {
    rowsPerPage = parseInt(rowsPerPageSelect.value, 10);
    currentPage = 1;
    renderTable();
    updatePageInfo();
}
