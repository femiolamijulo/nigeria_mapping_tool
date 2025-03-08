class MapManager {
    constructor() {
        if (MapManager.instance) {
            return MapManager.instance;
        }

        this.map = L.map('map', {
            zoomControl: true,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 120,
            attributionControl: true
        }).setView([9.0820, 8.6753], 6);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(this.map);

        MapManager.instance = this;
    }

    static getInstance() {
        if (!MapManager.instance) {
            MapManager.instance = new MapManager();
        }
        return MapManager.instance;
    }

    getMap() {
        return this.map;
    }
}

export default MapManager;
