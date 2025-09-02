export default function handler(req, res) {
  function generateDynamicKml() {
    const baseCoords = [
        [-1.27747, 52.756904],
        [-1.354751, 52.803674],
        [-1.169183, 52.768265]
    ];
    const center = [-1.267, 52.776];
    const scale = 0.8 + Math.random() * 0.4;

    function scalePoint([lon, lat]) {
        return [
            center[0] + (lon - center[0]) * scale,
            center[1] + (lat - center[1]) * scale
        ];
    }

    const scaledPolygon = baseCoords.map(scalePoint);
    scaledPolygon.push(scaledPolygon[0]);

    const lineString1 = [
        scalePoint([-1.354751, 52.803674]),
        scalePoint([-1.382617, 52.820538]),
    ];
    const lineString2 = [
        scalePoint([-1.169183, 52.768265]),
        scalePoint([-1.130373, 52.772406]),
    ];

    function coordsToKml(coords) {
        return coords.map(c => c.join(',')).join(' ');
    }

    const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <TimeStamp><when>${new Date().toISOString()}</when></TimeStamp>
  <Document>
    <name>Plumecast</name>
    <Placemark>
      <Style id="ID">
        <LineStyle><color>ff000000</color><width>2</width></LineStyle>
        <PolyStyle><color>ff000000</color><fill>0</fill><outline>1</outline></PolyStyle>
      </Style>
      <MultiGeometry>
        <LineString><coordinates>${coordsToKml(lineString1)}</coordinates></LineString>
        <LineString><coordinates>${coordsToKml(lineString2)}</coordinates></LineString>
        <Polygon>
          <outerBoundaryIs>
            <LinearRing><coordinates>${coordsToKml(scaledPolygon)}</coordinates></LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </MultiGeometry>
      <LookAt>
        <longitude>${center[0]}</longitude>
        <latitude>${center[1]}</latitude>
        <range>30000</range>
      </LookAt>
    </Placemark>
  </Document>
</kml>`;
    return kml;
  }

  const kml = generateDynamicKml();

  res.setHeader('Content-Type', 'application/vnd.google-earth.kml+xml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).send(kml);
}
