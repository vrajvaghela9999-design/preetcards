#!/bin/bash
# Preet Cards Business Folder Organization Script
# Run this script to create the complete folder structure

# Set the base directory (change if needed)
BASE_DIR="$HOME/Documents/Preet Cards Business"

echo "🏗️ Creating Preet Cards Business folder structure..."
echo "📁 Location: $BASE_DIR"
echo ""

# Create main structure
mkdir -p "$BASE_DIR"/{02-Marketing/{Instagram/{Reels/{Raw-Footage,Edited-Reels,Posted},Stories,Posts,Graphics},Facebook,WhatsApp-Status,Email-Marketing,Ad-Campaigns},03-Content/{Product-Photos/{Lagna-Kankotri,Aamantran-Cards,Mundan-Cards,Greeting-Cards,Raw},Videos/{Product-Showcases,Testimonials,Behind-the-Scenes},Graphics/{Logos,Brand-Assets,Templates},Copy},04-Operations/{Automation/{Zapier-Workflows,Airtable/{CSV-Backups},Analytics/{Monthly-Reports}},Lead-Management/{Follow-up-Templates},Customer-Data/{Testimonials,Customer-Photos}},05-Documentation/{Website,Business,Training,Legal},06-Assets/{Design-Files/{Photoshop,Illustrator,Canva},Fonts,Stock-Photos,Music,Templates/{Instagram-Templates,Quote-Templates,Email-Templates}}}

# Create symbolic link to website repo
if [ -d "/Users/vrajvaghela/Preet card" ]; then
    ln -sf "/Users/vrajvaghela/Preet card" "$BASE_DIR/01-Website"
    echo "✅ Linked website repo to 01-Website"
else
    mkdir -p "$BASE_DIR/01-Website"
    echo "⚠️ Website repo not found, created empty folder"
fi

echo ""
echo "✅ Folder structure created successfully!"
echo ""
echo "📂 Structure overview:"
find "$BASE_DIR" -type d -maxdepth 3 | head -30
echo ""
echo "🎉 Done! Open Finder to: $BASE_DIR"
