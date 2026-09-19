
import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";


/* =========================================
   SUPABASE CONNECTION
========================================= */

const supabaseUrl =
    "https://xrhdbxsawcdwrvcguojy.supabase.co"; 
 
const supabaseKey = 
    "sb_publishable_2Ev1ejVBz_q-tqkc76sSlA_A7fa4gc-"; 
 
 
const supabase = 
    createClient( 
        supabaseUrl, 
        supabaseKey 
    ); 
 
 
/* ========================================= 
   PATH SETUP 
========================================= */ 
 
const __filename = 
    fileURLToPath( 
        import.meta.url 
    ); 
 
const __dirname = 
    path.dirname( 
        __filename 
    ); 
 
 
/* 
   JSON files are one level above 
   the sync folder. 
*/ 
 
const rootPath = 
    path.join( 
        __dirname, 
        ".." 
    ); 
 
 
/* ========================================= 
   GENERIC JSON WRITER 
========================================= */ 
 
async function saveJSON(fileName, data) {

    const outputPath = path.join(
        rootPath,
        fileName
    );

    const newContent =
        JSON.stringify(
            data,
            null,
            2
        );


    // Check if the file already exists
    try {

        const oldContent =
            await fs.readFile(
                outputPath,
                "utf-8"
            );


        // If nothing changed,
        // do NOT rewrite the file
        if (oldContent === newContent) {

            console.log(
                `✓ ${fileName} unchanged`
            );

            return;
        }

    } catch (error) {

        // File doesn't exist yet
        if (error.code !== "ENOENT") {
            throw error;
        }
    }


    // Write only when data changed
    await fs.writeFile(
        outputPath,
        newContent,
        "utf-8"
    );


    console.log(
        `✓ ${fileName} updated successfully`
    );
}
 
 
/* ========================================= 
   SYNC PRODUCTS 
========================================= */ 
 
async function syncProducts() { 
 
    console.log( 
        "\nSyncing products..." 
    ); 
 
    const { 
        data, 
        error 
    } = await supabase 
        .from("products") 
        .select("*") 
        .order("id"); 
 
    if (error) { 
 
        throw new Error( 
            `Products sync failed: ${error.message}` 
        ); 
 
    } 
 
    await saveJSON( 
        "products-backup.json", 
        data 
    ); 
} 
 
 
/* ========================================= 
   SYNC CATEGORIES 
========================================= */ 
 
async function syncCategories() { 
 
    console.log( 
        "\nSyncing Categories..." 
    ); 
 
    const { 
        data, 
        error 
    } = await supabase 
        .from("Categories") 
        .select("*") 
        .order("id"); 
 
    if (error) { 
 
        throw new Error( 
            `Categories sync failed: ${error.message}` 
        ); 
 
    } 
 
    await saveJSON( 
        "categories.json", 
        data 
    ); 
} 
 
 
/* ========================================= 
   SYNC MENU PREVIEW 
========================================= */ 
 
async function syncMenuPreview() { 
 
    console.log( 
        "\nSyncing menu preview..." 
    ); 
 
    const { 
        data, 
        error 
    } = await supabase 
        .from("menu_preview") 
        .select("*") 
        .order("position"); 
 
    if (error) { 
 
        throw new Error( 
            `Menu preview sync failed: ${error.message}` 
        ); 
 
    } 
 
    await saveJSON( 
        "menu-preview.json", 
        data 
    ); 
} 
 
 
/* ========================================= 
   SYNC SETTINGS 
========================================= */ 
 
async function syncSettings() { 
 
    console.log( 
        "\nSyncing settings..." 
    ); 
 
    const { 
        data, 
        error 
    } = await supabase 
        .from("settings") 
        .select("*"); 
 
    if (error) { 
 
        throw new Error( 
            `Settings sync failed: ${error.message}` 
        ); 
 
    } 
 
 
    /* 
       settings.json is an object, 
       not an array. 
 
       If the table contains one row, 
       we save that row directly. 
    */ 
 
    const settings = 
        Array.isArray(data) 
            ? data[0] 
            : data; 
 
 
    if (!settings) { 
 
        throw new Error( 
            "Settings table is empty." 
        ); 
 
    } 
 
 
    /* 
       Remove database-only fields 
       if they exist. 
 
       This keeps settings.json 
       clean and matches your current 
       JSON structure. 
    */ 
 
    const cleanSettings = { 
        phone: settings.phone, 
        email: settings.email, 
        address: settings.address, 
        weekday_open: settings.weekday_open, 
        weekday_close: settings.weekday_close, 
        weekend_open: settings.weekend_open, 
        weekend_close: settings.weekend_close, 
        instagram: settings.instagram, 
        website: settings.website 
    }; 
 
 
    await saveJSON( 
        "settings.json", 
        cleanSettings 
    ); 
} 
 
 
/* ========================================= 
   RUN ALL SYNCS 
========================================= */ 
 
async function runSync() { 
 
    console.log( 
        "=================================" 
    ); 
 
    console.log( 
        "      LUNA COFFEE DATA SYNC" 
    ); 
 
    console.log( 
        "=================================" 
    ); 
 
 
    try { 
 
        await syncProducts(); 
 
        await syncCategories(); 
 
        await syncMenuPreview(); 
 
        await syncSettings(); 
 
 
        console.log( 
            "\n=================================" 
        ); 
 
        console.log( 
            "✓ ALL DATA SYNCED SUCCESSFULLY!" 
        ); 
 
        console.log( 
            "=================================\n" 
        ); 
 
    } 
 
    catch (error) { 
 
        console.error( 
            "\n✗ SYNC FAILED" 
        ); 
 
        console.error( 
            error.message 
        ); 
 
        process.exitCode = 1; 
 
    } 
 
} 
 
 
/* ========================================= 
   START 
========================================= */ 
 
let isSyncing = false; 
 
async function autoSync() { 
 
    if (isSyncing) return; 
 
    isSyncing = true; 
 
    try { 
 
        await runSync(); 
 
    } catch (error) { 
 
        console.error( 
            "Auto Sync Error:", 
            error 
        ); 
 
    } finally { 
 
        isSyncing = false; 
 
    } 
} 
 
 
/* ========================================= 
   START AUTO SYNC 
========================================= */ 
 
if (process.env.GITHUB_ACTIONS === "true") {

    // GitHub Actions: run once and finish
    await runSync();

} else {

    // Local computer: keep auto-syncing every 5 seconds
    console.log("🔄 Auto Sync is running...");
    console.log("⏱ Checking Supabase every 5 seconds...");

    autoSync();

    setInterval(() => {
        autoSync();
    }, 5000);
}
