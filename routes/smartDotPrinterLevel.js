
const express = require("express");
const connection = require("../config/db");
const router = express.Router();
const cors = require('cors');
const multer = require("multer");
const fs = require('fs');
const { base64StringToBlob } = require("blob-util");

const app = express();
app.use(cors());

// Helper function for database queries to avoid repeated try-catch blocks
const queryDB = async (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// Route to add category name
router.post('/smartDotPrinter/labelCategories/add', async (req, res) => {
    try {
        const categoryName = req.body.categoryName;
        const subCategoryName = req.body.subCategoryName || [];
        const sql = `INSERT INTO smartdotalllevelcategories (allCategories, subCategories) VALUES (?, ?)`;
        const result = await queryDB(sql, [categoryName, JSON.stringify(subCategoryName)]);
        res.json(result);
    } catch (err) {
        console.error("Error inserting category name and subcategories:", err);
        res.status(500).json({ error: "An error occurred while inserting category name and subcategories." });
    }
});

// Route to update category name
router.put('/smartDotPrinter/labelCategories/update/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const updatedCategoryName = req.body.updatedCategoryName;
        const sql = `UPDATE smartdotalllevelcategories SET allCategories = ? WHERE id = ?`;
        const result = await queryDB(sql, [updatedCategoryName, categoryId]);
        console.log("Successfully updated category name", result);
        res.json(result);
    } catch (err) {
        console.error("Error updating category name:", err);
        res.status(500).json({ error: "An error occurred while updating category name." });
    }
});

// Route to update subcategory name
router.put('/smartDotPrinter/labelSubCategories/update/:categoryName', async (req, res) => {
    try {
        const categoryName = req.params.categoryName;
        const subCategoryName = req.body.subCategoryName || [];
        const sql = `UPDATE smartdotalllevelcategories SET subCategories = ? WHERE allCategories = ?`;
        const result = await queryDB(sql, [JSON.stringify(subCategoryName), categoryName]);
        console.log("Successfully updated subcategories based on category name", result);
        res.json(result);
    } catch (err) {
        console.error("Error updating subcategories:", err);
        res.status(500).json({ error: "An error occurred while updating subcategories based on category name." });
    }
});

// Route to get all label categories
router.get('/smartDotPrinter/labelCategories', async (req, res) => {
    try {
        const sql = 'SELECT * FROM smartdotalllevelcategories';
        const results = await queryDB(sql);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        console.error('Error fetching label categories:', err);
        res.status(500).json({ error: 'An error occurred while fetching label categories.' });
    }
});

// Route to add label data
router.post('/smartDotPrinter/allLabelData/add', async (req, res) => {
    try {
        const { subCategoryName, labelDataList, LabelDataView } = req.body;
        const sql = `INSERT INTO smartdotalllabeldata (subCategoryName, labelDataList, LabelDataView) VALUES (?, ?, ?)`;
        const result = await queryDB(sql, [subCategoryName, JSON.stringify(labelDataList), JSON.stringify(LabelDataView)]);
        console.log("Successfully inserted data", result);
        res.json(result);
    } catch (err) {
        console.error("Error inserting data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
    }
});

// Route to update label data
router.put('/smartDotPrinter/allLabelData/update/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { subCategoryName, labelDataList, LabelDataView } = req.body;
        const sql = `UPDATE smartdotalllabeldata SET subCategoryName = ?, labelDataList = ?, LabelDataView = ? WHERE id = ?`;
        const result = await queryDB(sql, [subCategoryName, JSON.stringify(labelDataList), JSON.stringify(LabelDataView), categoryId]);
        console.log("Successfully updated data", result);
        res.json(result);
    } catch (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "An error occurred while updating data." });
    }
});

// Route to get all label data
router.get('/smartDotPrinter/allLabelData', async (req, res) => {
    try {
        const sql = 'SELECT * FROM smartdotalllabeldata';
        const results = await queryDB(sql);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        console.error('Error fetching all label data:', err);
        res.status(500).json({ error: 'An error occurred while fetching label data.' });
    }
});

// Route to get label data for a specific subcategory
router.get('/smartDotPrinter/allLabelData/:subCategoryName', async (req, res) => {
    try {
        const subCategoryName = req.params.subCategoryName;
        const sql = 'SELECT * FROM smartdotalllabeldata WHERE subCategoryName = ?';
        const results = await queryDB(sql, [subCategoryName]);
        res.json(results.length > 0 ? results : []);
    } catch (err) {
        console.error('Error fetching data for subCategoryName:', subCategoryName, '-', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route to delete label data by myid
router.delete('/smartDotPrinter/allLabelData/deleteByMyId/:myid', async (req, res) => {
    try {
        const myid = req.params.myid;
        const sql = `DELETE FROM smartdotalllabeldata WHERE JSON_UNQUOTE(JSON_EXTRACT(labelDataView, '$.myid')) = ?`;
        const result = await queryDB(sql, [myid]);
        console.log(`Successfully deleted records with myid ${myid}`);
        res.json(result);
    } catch (err) {
        console.error('Error deleting records:', err);
        res.status(500).send('Error deleting records.');
    }
});

// Route to add main container
router.post('/smartDotPrinter/mainContainers/add', async (req, res) => {
    try {
        const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;
        const sql = `INSERT INTO smartdotmaincontainertable (containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType) VALUES (?, ?, ?, ?, ?, ?)`;
        const result = await queryDB(sql, [containerName, containerHeight, containerWidth, JSON.stringify(containerImageBitmapData), subCategories, printerType]);
        console.log("Successfully inserted data", result);
        res.json(result);
    } catch (err) {
        console.error("Error inserting main container data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
    }
});

// Route to update main container by ID
router.put('/smartDotPrinter/mainContainers/update/:id', async (req, res) => {
    try {
        const mainContainersId = req.params.id;
        const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;
        const sql = `UPDATE smartdotmaincontainertable SET containerName = ?, containerHeight = ?, containerWidth = ?, containerImageBitmapData = ?, subCategories = ?, printerType = ? WHERE id = ?`;
        const result = await queryDB(sql, [containerName, containerHeight, containerWidth, JSON.stringify(containerImageBitmapData), subCategories, printerType, mainContainersId]);
        console.log("Successfully updated data", result);
        res.json(result);
    } catch (err) {
        console.error("Error updating main container:", err);
        res.status(500).json({ error: "An error occurred while updating data." });
    }
});

// Route to get main container by subcategory
router.get('/smartDotPrinter/mainContainers/:subCategories', async (req, res) => {
    try {
        const subCategories = req.params.subCategories;
        const sql = `SELECT id, containerName, containerHeight, containerWidth, printerType, CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData FROM smartdotmaincontainertable WHERE subCategories = ?`;
        const results = await queryDB(sql, [subCategories]);
        res.json(results.length === 0 ? [] : results);
    } catch (err) {
        console.error('Error fetching data for subCategories:', subCategories, '-', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Route to get main container by ID
router.get('/smartDotPrinter/mainContainers/get/main/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `SELECT id, containerName, containerHeight, containerWidth, convert(containerImageBitmapData using utf8) AS containerImageBitmapData, subCategories, printerType FROM smartdotmaincontainertable WHERE id = ?`;
        const result = await queryDB(sql, [id]);
        if (result.length > 0) {
            res.json(result);
        } else {
            res.json({ message: "No data found for the given subcategory.", data: id });
        }
    } catch (err) {
        console.error("Error fetching data:", err);
        res.json({ message: "An error occurred while fetching data.", data: req.params.id });
    }
});


// Helper function for executing SQL queries
const queryDatabase = async (sql, params) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// Get all main containers
router.get('/smartDotPrinter/mainContainers', async (req, res) => {
    try {
        const sql = `
      SELECT 
        id, 
        containerName, 
        containerHeight, 
        containerWidth, 
        CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData, 
        subCategories,
        printerType 
      FROM smartdotmaincontainertable
    `;
        const results = await queryDatabase(sql);
        if (results.length === 0) {
            console.log("No data found in smartdotmaincontainertable.");
            return res.json([]);
        }
        res.json(results);
    } catch (err) {
        console.error("Error fetching all main container data:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching all data." });
    }
});

// Delete main container and related widget container
router.delete('/smartDotPrinter/mainContainers/delete/:id', async (req, res) => {
    const mainContainersId = req.params.id;

    try {
        const sql = 'DELETE main, widget FROM smartdotmaincontainertable main LEFT JOIN smartdotwidgetcontainertable widget ON main.id = widget.mainContainerId WHERE main.id = ?';
        const results = await queryDatabase(sql, [mainContainersId]);
        if (results.affectedRows === 0) {
            return res.json({ message: "No data found for the provided mainContainersId.", data: mainContainersId });
        }
        return res.json({ message: "Data successfully deleted.", data: mainContainersId });
    } catch (err) {
        console.error("Error deleting data:", err.message);
        return res.status(500).json({ message: "An error occurred while deleting data.", data: mainContainersId });
    }
});

// Create a new widget container
router.post('/smartDotPrinter/widgetContainers/add', async (req, res) => {
    const {
        mainContainerId,
        type,
        widgetType,  // Updated field
        contentData,
        offsetDx,
        offsetDy,
        widthSize,
        width,  // Updated field
        height,
        rotation,
        selectTimeTextScanInt,
        isBold,
        isUnderline,
        isItalic,
        fontSize,
        alignment,
        textAlignment, // Updated field
        checkTextIdentifyWidget, // New field (type: text)
        barEncodingType, // New field (type: text)
        rowCount,
        columnCount,
        tablesCells, // New field (type: text)
        tablesRowHeights, // New field (type: text)
        tablesColumnWidths, // New field (type: text)
        selectedEmojiIcons,
        prefix,
        suffix,
        shapeTypes, // New field (type: text)
        isRectangale,
        isRoundRectangale,
        isCircularFixed,
        isCircularNotFixed,
        sliderLineWidth,
        widgetLineWidth,  // Updated field
        isFixedFigureSize,  // New field
        trueShapeWidth, // New field (type: double)
        trueShapeHeight, // New field (type: double)
        isDottedLine,
        columnWidths,
        rowHeights,
        cellTexts,
        tableTextAlignment,
        tableTextBold,
        tableTextUnderline,
        tableTextItalic,
        tableTextFontSize
    } = req.body;

    const dataToStore = {
        mainContainerId,
        widgetType,
        type,
        contentData,
        offsetDx,
        offsetDy,
        width,
        widthSize,
        height: height || null,
        rotation: rotation,
        selectTimeTextScanInt: selectTimeTextScanInt || null,
        isBold: isBold || 0,
        isUnderline: isUnderline || 0,
        isItalic: isItalic || 0,
        fontSize: fontSize,
        textAlignment: textAlignment || "left",
        alignment: alignment || "left",
        checkTextIdentifyWidget,
        barEncodingType,
        rowCount: rowCount || null,
        columnCount: columnCount || null,
        tablesCells,
        tablesRowHeights,
        tablesColumnWidths,
        selectedEmojiIcons: selectedEmojiIcons || {},
        prefix: prefix || null,
        suffix: suffix || null,
        shapeTypes,
        isRectangale: isRectangale || 0,
        isRoundRectangale: isRoundRectangale || 0,
        isCircularFixed: isCircularFixed || 0,
        isCircularNotFixed: isCircularNotFixed || 0,
        widgetLineWidth,
        sliderLineWidth,
        isFixedFigureSize: isFixedFigureSize || 0,
        trueShapeWidth,
        trueShapeHeight,
        isDottedLine: isDottedLine || 0,
        columnWidths: columnWidths || null,
        rowHeights: rowHeights || null,
        cellTexts: cellTexts || null,
        tableTextAlignment: tableTextAlignment || null,
        tableTextBold: tableTextBold || 0,
        tableTextUnderline: tableTextUnderline || 0,
        tableTextItalic: tableTextItalic || 0,
        tableTextFontSize: tableTextFontSize || null,
    };

    try {
        const sql = `INSERT INTO smartdotwidgetcontainertable
    (mainContainerId, widgetType,type, contentData, offsetDx, offsetDy, width,widthSize, height, rotation, selectTimeTextScanInt,
    isBold, isUnderline, isItalic, fontSize, textAlignment,alignment, checkTextIdentifyWidget, barEncodingType, rowCount, columnCount,
    tablesCells, tablesRowHeights, tablesColumnWidths, selectedEmojiIcons, prefix, suffix, shapeTypes, 
    isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, widgetLineWidth,sliderLineWidth, isFixedFigureSize,
    trueShapeWidth, trueShapeHeight, isDottedLine, columnWidths, rowHeights, cellTexts, tableTextAlignment, 
    tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await queryDatabase(sql, [
            dataToStore.mainContainerId,
            dataToStore.widgetType,
            dataToStore.type,
            dataToStore.contentData,
            dataToStore.offsetDx,
            dataToStore.offsetDy,
            dataToStore.width,
            dataToStore.widthSize,
            dataToStore.height,
            dataToStore.rotation,
            dataToStore.selectTimeTextScanInt,
            dataToStore.isBold,
            dataToStore.isUnderline,
            dataToStore.isItalic,
            dataToStore.fontSize,
            dataToStore.alignment,
            dataToStore.textAlignment,
            dataToStore.checkTextIdentifyWidget,
            dataToStore.barEncodingType,
            dataToStore.rowCount,
            dataToStore.columnCount,
            dataToStore.tablesCells,
            dataToStore.tablesRowHeights,
            dataToStore.tablesColumnWidths,
            JSON.stringify(dataToStore.selectedEmojiIcons),
            dataToStore.prefix,
            dataToStore.suffix,
            dataToStore.shapeTypes,
            dataToStore.isRectangale,
            dataToStore.isRoundRectangale,
            dataToStore.isCircularFixed,
            dataToStore.isCircularNotFixed,
            dataToStore.widgetLineWidth,
            dataToStore.sliderLineWidth,
            dataToStore.isFixedFigureSize,
            dataToStore.trueShapeWidth,
            dataToStore.trueShapeHeight,
            dataToStore.isDottedLine,
            dataToStore.columnWidths,
            dataToStore.rowHeights,
            dataToStore.cellTexts,
            dataToStore.tableTextAlignment,
            dataToStore.tableTextBold,
            dataToStore.tableTextUnderline,
            dataToStore.tableTextItalic,
            dataToStore.tableTextFontSize
        ]);

        console.log("Successfully inserted data", result);
        res.json(result);
    } catch (err) {
        console.error("Error inserting data:", err.message);
        res.status(500).json({ error: "An error occurred while inserting data." });
    }
});

// Get all widget containers
router.get('/smartDotPrinter/widgetContainers/get', async (req, res) => {
    try {
        const sql = 'SELECT * FROM smartdotwidgetcontainertable';
        const results = await queryDatabase(sql);
        if (results.length === 0) {
            console.log("No data found in smartdotwidgetcontainertable.");
            return res.json([]);
        }
        res.json(results);
    } catch (err) {
        console.error("Error fetching widget container data:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching widget container data." });
    }
});

// Get widget containers by main container id
router.get('/smartDotPrinter/widgetContainers/getMain/:id', (req, res) => {
    const mainContainerId = req.params.id;

    const sql = `
    SELECT id, mainContainerId, type, contentData, offsetDx, offsetDy, isBold, isUnderline, isItalic, fontSize, alignment, rotation, widthSize, height,
           selectTimeTextScanInt, prefix, suffix, 
           CONVERT(selectedEmojiIcons USING utf8) AS selectedEmojiIcons, 
           isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, sliderLineWidth,
           isDottedLine, rowCount, columnCount, columnWidths, rowHeights, cellTexts, 
           tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize
    FROM smartdotwidgetcontainertable
    WHERE mainContainerId = ?
  `;

    connection.query(sql, [mainContainerId], (err, results) => {
        if (err) {
            console.error("Error fetching widget data:", err.message);
            return res.status(500).json({ error: "An error occurred while fetching widget data." });
        }
        if (results.length === 0) {
            console.log(`No data found for mainContainerId: ${mainContainerId}`);
            return res.json([]);
        }
        res.json(results);
    });
});


// Delete all widgets for a main container
router.delete('/smartDotPrinter/widgetContainers/multiDelete/:mainId', async (req, res) => {
    const mainId = req.params.mainId;

    try {
        const sql = 'DELETE FROM smartdotwidgetcontainertable WHERE mainContainerId = ?';
        const results = await queryDatabase(sql, [mainId]);
        if (results.affectedRows === 0) {
            return res.json({ message: "Data not found to delete", data: mainId });
        }
        console.log("Successfully deleted data for mainId:", mainId);
        return res.json({ message: "Data successfully deleted", data: mainId });
    } catch (err) {
        console.error("Error deleting data:", err.message);
        return res.status(500).json({ message: "An error occurred while deleting data.", data: mainId });
    }
});

module.exports = router;

