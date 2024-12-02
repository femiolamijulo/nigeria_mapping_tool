# Interactive Map Project

This project is an interactive map application that allows users to explore and visualize geographic data based on States, Local Government Areas (LGAs), and Wards. The map provides filtering options, dynamic search functionality, and the ability to download the current map view as an image.

## Features

- **Interactive Map**: Utilizes Leaflet.js and Bootstrap to create an interactive map interface.
- **Filtering Options**: Filter the map by selecting one or multiple States, LGAs, and Wards.
- **Dynamic Search**: Search for States, LGAs, or Wards using the search box; the map updates in real-time as you type.
- **Download Map**: Download the current map view as a PNG image.
- **Visual Enhancements**:
  - North arrow indicator.
  - Scale control.
  - Labels for States, LGAs, and Wards with customized styling.

## Prerequisites

- **Python 3.x**
- **Web Browser**: Modern browsers like Chrome, Firefox, or Edge.
- **Python Libraries**:
  - `json`

## Setup and Installation

### 1. Prepare Your GeoJSON Data and Mappings

- **GeoJSON Data**: Ensure you have the following GeoJSON data files:
  - `state_geojson`: GeoJSON data for States.
  - `lga_geojson`: GeoJSON data for Local Government Areas.
  - `ward_geojson`: GeoJSON data for Wards.

- **Mappings**:
  - `state_to_lga`: A dictionary mapping each State to its LGAs.
  - `lga_to_ward`: A dictionary mapping each LGA to its Wards.

### 2. Update the Python Script

- **Insert Your Data**: Replace the placeholders in the Python script with your actual data.

  ```python
  import json

  # Replace ... with your actual data
  state_geojson = {...}  # Your State GeoJSON data
  lga_geojson = {...}    # Your LGA GeoJSON data
  ward_geojson = {...}   # Your Ward GeoJSON data

  state_to_lga = {...}   # Mapping from States to LGAs
  lga_to_ward = {...}    # Mapping from LGAs to Wards

  # Serialize data to JSON strings
  state_geojson_str = json.dumps(state_geojson)
  lga_geojson_str = json.dumps(lga_geojson)
  ward_geojson_str = json.dumps(ward_geojson)
  state_to_lga_str = json.dumps(state_to_lga)
  lga_to_ward_str = json.dumps(lga_to_ward)

  # Generate the HTML template
  html_template = f"""
  <!-- Your HTML content here -->
  """
  # Save the HTML with UTF-8 encoding
  with open("interactive_map.html", "w", encoding="utf-8") as f:
      f.write(html_template)

  print("Interactive map saved as 'interactive_map.html'")
  ```

### 3. Generate the HTML File

- Run the Python script to generate the `interactive_map.html` file:

  ```bash
  python generate_map.py
  ```

- The script will output:

  ```
  Interactive map saved as 'interactive_map.html'
  ```

### 4. Serve the HTML File

Due to browser security restrictions, it's recommended to serve the HTML file using a local web server.

- **Using Python's HTTP Server**:

  ```bash
  python -m http.server 8000
  ```

- **Access the Map**:

  Open your web browser and navigate to:

  ```
  http://localhost:8000/interactive_map.html
  ```

## Usage Instructions

### Filtering the Map

1. **State Filter**:

   - Select one or more States from the "State" dropdown.
   - The map will highlight the selected States.
   - The "Local Government" dropdown will update to show LGAs within the selected States.

2. **Local Government Filter**:

   - Select one or more LGAs from the "Local Government" dropdown.
   - The map will highlight the selected LGAs.
   - The "Ward" dropdown will update to show Wards within the selected LGAs.

3. **Ward Filter**:

   - Select one or more Wards from the "Ward" dropdown.
   - The map will highlight the selected Wards.

### Dynamic Search

- **Search Box**:

  - Type in the search box to find States, LGAs, or Wards.
  - The map dynamically updates to highlight matching areas as you type.

### Downloading the Map

- **Download Button**:

  - Click the "Download Map" button to download the current map view as a PNG image.
  - The script attempts to use `leaflet-image` for capturing the map.
  - If `leaflet-image` fails, it falls back to using `html2canvas`.

## Customization

### Styling

- **CSS Styles**:

  - Modify styles within the `<style>` section of the HTML template.
  - Customize colors, fonts, sizes, and other visual aspects.

- **Label Styling**:

  - Adjust the `.state-label`, `.lga-label`, and `.ward-label` classes to change label appearances.

### Map Initialization

- **Map Center and Zoom**:

  - Change the coordinates and zoom level in:

    ```javascript
    const map = L.map('map').setView([9.0820, 8.6753], 6);
    ```

- **Basemap Tiles**:

  - Switch to a different tile provider by modifying the `L.tileLayer` URL and options.

### JavaScript Functions

- **Event Handlers**:

  - `handleStateSelection()`: Logic for when States are selected.
  - `handleLGASelection()`: Logic for when LGAs are selected.
  - `handleWardSelection()`: Logic for when Wards are selected.
  - `handleSearch()`: Logic for dynamic search functionality.
  - Modify these functions to change how interactions affect the map.

## Troubleshooting

### Common Issues

- **Map Not Displaying**:

  - Ensure that the GeoJSON data is correctly formatted and loaded.
  - Check the browser's developer console for any JavaScript errors.

- **Download Not Working**:

  - Cross-origin issues can prevent the map from being captured.
  - Ensure that the map tiles and resources support cross-origin requests.

- **Slow Performance**:

  - Large GeoJSON files can slow down the map.
  - Consider simplifying the GeoJSON data or loading it asynchronously.

## Dependencies and Resources
Credits: Admin boundary data from eHealth Africa and Proxy Logics. 2020. Nigeria Operational Ward Boundaries. Geo-Referenced Infrastructure and Demographic Data for Development (GRID3). https://grid3.gov.ng/.
- **Leaflet.js**:

  - Interactive maps library.
  - [Leaflet Website](https://leafletjs.com/)

- **Bootstrap**:

  - Styling and layout framework.
  - [Bootstrap Website](https://getbootstrap.com/)

- **leaflet-image**:

  - Plugin for exporting Leaflet maps as images.
  - [leaflet-image GitHub](https://github.com/mapbox/leaflet-image)

- **html2canvas**:

  - Library for taking screenshots of webpages.
  - [html2canvas Website](https://html2canvas.hertzen.com/)

## Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, please open an issue or submit a pull request.

## License

This project is licensed under the **MIT License**.

## Contact Information

For questions or support, please contact:

- **Olufemi Olamijulo**
- **Email**: lamijulo99@gmail.com
- **GitHub**: [femiolamijulo](https://github.com/femiolamijulo)

---

Feel free to customize this README to better suit your project's specifics. Include any additional information that might be helpful for users or contributors.

If you have any questions or need further assistance, please let me know!