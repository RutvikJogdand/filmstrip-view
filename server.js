const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
let items = [];

fs.readFile('./data/extendedTemplate.json', (err, data) => {
    if (err) {
        console.error("Failed to read data file:", err);
        return;
    }
    items = JSON.parse(data);
});

// Pagination function
function paginate(array, page_size, page_number) {
    --page_number;  // because pages logically start with 1, but technically with 0
    return array.slice(page_number * page_size, (page_number + 1) * page_size);
}

// Route to get paginated items
app.get('/items', (req, res) => {
    if (!items.length) {
        return res.status(503).send('Data is not yet loaded. Please try again later.');
    }
    const { page = 1, pageSize = 4 } = req.query; // Default page is 1 and pageSize is 4
    const paginatedItems = paginate(items, parseInt(pageSize), parseInt(page));
    res.json({
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        data: paginatedItems
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
