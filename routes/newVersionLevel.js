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


// router.post('/newVersion/mainContainers/add', async (req, res) => {
//     try {
//         const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;
//         const sql = `INSERT INTO maincontainertable_newversion (containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType) VALUES (?, ?, ?, ?, ?, ?)`;
//         const result = await queryDB(sql, [containerName, containerHeight, containerWidth, JSON.stringify(containerImageBitmapData), subCategories, printerType]);
//         console.log("Successfully inserted data", result);
//         res.json(result);
//     } catch (err) {
//         console.error("Error inserting main container data:", err);
//         res.status(500).json({ error: "An error occurred while inserting data." });
//     }
// });


// // Route to update main container by ID
// router.put('/newVersion/mainContainers/update/:id', async (req, res) => {
//     try {
//         const mainContainersId = req.params.id;
//         const { containerName, containerHeight, containerWidth, containerImageBitmapData, subCategories, printerType } = req.body;
//         const sql = `UPDATE maincontainertable_newversion SET containerName = ?, containerHeight = ?, containerWidth = ?, containerImageBitmapData = ?, subCategories = ?, printerType = ? WHERE id = ?`;
//         const result = await queryDB(sql, [containerName, containerHeight, containerWidth, JSON.stringify(containerImageBitmapData), subCategories, printerType, mainContainersId]);
//         console.log("Successfully updated data", result);
//         res.json(result);
//     } catch (err) {
//         console.error("Error updating main container:", err);
//         res.status(500).json({ error: "An error occurred while updating data." });
//     }
// });

// // Route to get main container by subcategory
// router.get('/newVersion/mainContainers/:subCategories', async (req, res) => {
//     try {
//         const subCategories = req.params.subCategories;
//         const sql = `SELECT id, containerName, containerHeight, containerWidth, printerType, CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData FROM maincontainertable_newversion WHERE subCategories = ?`;
//         const results = await queryDB(sql, [subCategories]);
//         res.json(results.length === 0 ? [] : results);
//     } catch (err) {
//         console.error('Error fetching data for subCategories:', subCategories, '-', err);
//         res.status(500).json({ error: 'An error occurred while fetching data.' });
//     }
// });

// // Route to get main container by ID
// router.get('/newVersion/mainContainers/get/main/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const sql = `SELECT id, containerName, containerHeight, containerWidth, convert(containerImageBitmapData using utf8) AS containerImageBitmapData, subCategories, printerType FROM maincontainertable_newversion WHERE id = ?`;
//         const result = await queryDB(sql, [id]);
//         if (result.length > 0) {
//             res.json(result);
//         } else {
//             res.json({ message: "No data found for the given subcategory.", data: id });
//         }
//     } catch (err) {
//         console.error("Error fetching data:", err);
//         res.json({ message: "An error occurred while fetching data.", data: req.params.id });
//     }
// });

// // Get all main containers
// router.get('/newVersion/mainContainers', async (req, res) => {
//     try {
//         const sql = `
//       SELECT 
//         id, 
//         containerName, 
//         containerHeight, 
//         containerWidth, 
//         CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData, 
//         subCategories,
//         printerType 
//       FROM maincontainertable_newversion
//     `;
//         const results = await queryDatabase(sql);
//         if (results.length === 0) {
//             console.log("No data found in maincontainertable_newversion.");
//             return res.json([]);
//         }
//         res.json(results);
//     } catch (err) {
//         console.error("Error fetching all main container data:", err.message);
//         return res.status(500).json({ error: "An error occurred while fetching all data." });
//     }
// });

// Delete main container and related widget container

// Add main container



router.post('/newVersion/mainContainers/add', async (req, res) => {
    try {
        const {
            containerName,
            containerHeight,
            containerWidth,
            responsiveHeight,
            responsiveWidth,
            containerImageBitmapData,
            subCategories,
            printerType
        } = req.body;

        const sql = `
            INSERT INTO maincontainertable_newversion 
            (containerName, containerHeight, containerWidth, responsiveHeight, responsiveWidth, containerImageBitmapData, subCategories, printerType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await queryDB(sql, [
            containerName,
            containerHeight,
            containerWidth,
            responsiveHeight,
            responsiveWidth,
            JSON.stringify(containerImageBitmapData),
            subCategories,
            printerType
        ]);

        console.log("Successfully inserted data", result);
        res.json(result);
    } catch (err) {
        console.error("Error inserting main container data:", err);
        res.status(500).json({ error: "An error occurred while inserting data." });
    }
});

// Update main container
router.put('/newVersion/mainContainers/update/:id', async (req, res) => {
    try {
        const mainContainersId = req.params.id;
        const {
            containerName,
            containerHeight,
            containerWidth,
            responsiveHeight,
            responsiveWidth,
            containerImageBitmapData,
            subCategories,
            printerType
        } = req.body;

        const sql = `
            UPDATE maincontainertable_newversion 
            SET containerName = ?, containerHeight = ?, containerWidth = ?, responsiveHeight = ?, responsiveWidth = ?, 
                containerImageBitmapData = ?, subCategories = ?, printerType = ? 
            WHERE id = ?
        `;
        const result = await queryDB(sql, [
            containerName,
            containerHeight,
            containerWidth,
            responsiveHeight,
            responsiveWidth,
            JSON.stringify(containerImageBitmapData),
            subCategories,
            printerType,
            mainContainersId
        ]);

        console.log("Successfully updated data", result);
        res.json(result);
    } catch (err) {
        console.error("Error updating main container:", err);
        res.status(500).json({ error: "An error occurred while updating data." });
    }
});

// Get by subcategory
router.get('/newVersion/mainContainers/:subCategories', async (req, res) => {
    try {
        const subCategories = req.params.subCategories;
        const sql = `
            SELECT 
                id, containerName, containerHeight, containerWidth, responsiveHeight, responsiveWidth,
                printerType,
                CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData 
            FROM maincontainertable_newversion 
            WHERE subCategories = ?
        `;
        const results = await queryDB(sql, [subCategories]);
        res.json(results.length === 0 ? [] : results);
    } catch (err) {
        console.error('Error fetching data for subCategories:', subCategories, '-', err);
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
});

// Get by ID
router.get('/newVersion/mainContainers/get/main/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const sql = `
            SELECT 
                id, containerName, containerHeight, containerWidth, responsiveHeight, responsiveWidth,
                convert(containerImageBitmapData using utf8) AS containerImageBitmapData,
                subCategories, printerType 
            FROM maincontainertable_newversion 
            WHERE id = ?
        `;
        const result = await queryDB(sql, [id]);
        res.json(result.length > 0 ? result : { message: "No data found for the given subcategory.", data: id });
    } catch (err) {
        console.error("Error fetching data:", err);
        res.json({ message: "An error occurred while fetching data.", data: req.params.id });
    }
});

// Get all main containers
router.get('/newVersion/mainContainers', async (req, res) => {
    try {
        const sql = `
            SELECT 
                id, containerName, containerHeight, containerWidth, responsiveHeight, responsiveWidth,
                CONVERT(containerImageBitmapData USING utf8) AS containerImageBitmapData, 
                subCategories, printerType 
            FROM maincontainertable_newversion
        `;
        const results = await queryDatabase(sql);
        if (results.length === 0) {
            console.log("No data found in maincontainertable_newversion.");
            return res.json([]);
        }
        res.json(results);
    } catch (err) {
        console.error("Error fetching all main container data:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching all data." });
    }
});


router.delete('/newVersion/mainContainers/delete/:id', async (req, res) => {
    const mainContainersId = req.params.id;

    try {
        const sql = 'DELETE main, widget FROM maincontainertable_newversion main LEFT JOIN widgetcontainertable_newversion widget ON main.id = widget.mainContainerId WHERE main.id = ?';
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


router.post('/newVersion/widgetContainers/add', async (req, res) => {
    const {
        mainContainerId,
        widgetType,  // Updated field
        contentData,
        offsetDx,
        offsetDy,
        width,  // Updated field
        height,
        rotation,
        selectTimeTextScanInt,
        isBold,
        isUnderline,
        isItalic,
        fontSize,
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
        contentData,
        offsetDx,
        offsetDy,
        width,
        height: height || null,
        rotation: rotation,
        selectTimeTextScanInt: selectTimeTextScanInt || null,
        isBold: isBold || 0,
        isUnderline: isUnderline || 0,
        isItalic: isItalic || 0,
        fontSize: fontSize,
        textAlignment: textAlignment || "left",
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
        const sql = `INSERT INTO widgetcontainertable_newversion 
    (mainContainerId, widgetType, contentData, offsetDx, offsetDy, width, height, rotation, selectTimeTextScanInt, 
    isBold, isUnderline, isItalic, fontSize, textAlignment, checkTextIdentifyWidget, barEncodingType, rowCount, columnCount, 
    tablesCells, tablesRowHeights, tablesColumnWidths, selectedEmojiIcons, prefix, suffix, shapeTypes, 
    isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, widgetLineWidth, isFixedFigureSize, 
    trueShapeWidth, trueShapeHeight, isDottedLine, columnWidths, rowHeights, cellTexts, tableTextAlignment, 
    tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize) 
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

        const result = await queryDatabase(sql, [
            dataToStore.mainContainerId,
            dataToStore.widgetType,
            dataToStore.contentData,
            dataToStore.offsetDx,
            dataToStore.offsetDy,
            dataToStore.width,
            dataToStore.height,
            dataToStore.rotation,
            dataToStore.selectTimeTextScanInt,
            dataToStore.isBold,
            dataToStore.isUnderline,
            dataToStore.isItalic,
            dataToStore.fontSize,
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
router.get('/newVersion/widgetContainers/get', async (req, res) => {
    try {
        const sql = 'SELECT * FROM widgetcontainertable_newversion';
        const results = await queryDatabase(sql);
        if (results.length === 0) {
            console.log("No data found in widgetcontainertable_newversion.");
            return res.json([]);
        }
        res.json(results);
    } catch (err) {
        console.error("Error fetching widget container data:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching widget container data." });
    }
});


router.get('/newVersion/widgetContainers/getMain/:id', async (req, res) => {
    const mainContainerId = req.params.id;

    try {
        const sql = `
      SELECT id, mainContainerId, type,widgetType, contentData, offsetDx, offsetDy, isBold, isUnderline, isItalic, fontSize, alignment,textAlignment, rotation,width, widthSize, height,
             selectTimeTextScanInt, prefix, suffix, 
             CONVERT(selectedEmojiIcons USING utf8) AS selectedEmojiIcons, 
             isRectangale, isRoundRectangale, isCircularFixed, isCircularNotFixed, widgetLineWidth,sliderLineWidth,
             isDottedLine, rowCount, columnCount, tablesColumnWidths, tablesRowHeights, tablesCells, 
             tableTextAlignment, tableTextBold, tableTextUnderline, tableTextItalic, tableTextFontSize,
             checkTextIdentifyWidget, barEncodingType, shapeTypes, isFixedFigureSize, trueShapeWidth, trueShapeHeight
      FROM widgetcontainertable_newversion
      WHERE mainContainerId = ?
    `;

        const results = await queryDatabase(sql, [mainContainerId]);
        if (results.length === 0) {
            console.log(`No data found for mainContainerId: ${mainContainerId}`);
            return res.json([]);
        }

        res.json(results);
    } catch (err) {
        console.error("Error fetching widget data:", err.message);
        return res.status(500).json({ error: "An error occurred while fetching widget data." });
    }
});

// Delete all widgets for a main container
router.delete('/newVersion/widgetContainers/multiDelete/:mainId', async (req, res) => {
    const mainId = req.params.mainId;

    try {
        const sql = 'DELETE FROM widgetcontainertable_newversion WHERE mainContainerId = ?';
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

