# Cesium

Cesium 可以加载和可视化各种 GIS 数据。Cesium 是一个开源的 JavaScript 库，用于创建 3D 地球和地图，它支持大量的地理空间数据格式和服务。以下是 Cesium 加载 GIS 数据的一些常见方法和支持的格式：

### 支持的数据格式和服务

1. **3D Tiles**

   - **特点**：专为大规模 3D 地理空间数据而设计，支持批量加载和渲染。
   - **用途**：用于加载和显示城市模型、建筑物、点云等。

2. **GeoJSON**

   - **特点**：一种基于 JSON 的格式，用于表示简单的地理特征。
   - **用途**：用于加载点、线、面等地理数据，适用于标记、路径和区域展示。

3. **KML/KMZ**

   - **特点**：一种基于 XML 的格式，用于表示地理数据和注释。
   - **用途**：用于加载地标、路径和多边形等。

4. **CZML**

   - **特点**：一种 JSON 格式，专为 Cesium 设计，用于表示时间动态的地理空间数据。
   - **用途**：用于加载和显示动态数据，如卫星轨迹、移动目标等。

5. **WMS (Web Map Service)**

   - **特点**：一种标准的网络服务，用于提供地图图像。
   - **用途**：用于从服务器加载地图图层，如卫星影像、地形图等。

6. **WMTS (Web Map Tile Service)**

   - **特点**：一种标准的网络服务，用于提供切片地图图像。
   - **用途**：用于加载瓦片地图图层，适用于大规模地理数据。

7. **3D 模型（gltf/glb）**
   - **特点**：一种高效的 3D 模型格式，支持纹理、材质和动画。
   - **用途**：用于加载和显示详细的 3D 模型，如建筑物、车辆等。

### 使用示例

#### 加载 GeoJSON 数据

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cesium GeoJSON Example</title>
    <script src="https://cesium.com/downloads/cesiumjs/releases/1.80/Build/Cesium/Cesium.js"></script>
    <link href="https://cesium.com/downloads/cesiumjs/releases/1.80/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
    <style>
      #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script>
      // 初始化Cesium Viewer
      var viewer = new Cesium.Viewer('cesiumContainer')

      // 加载GeoJSON数据
      var geoJsonUrl = 'path/to/your/geojson/file.geojson'
      Cesium.GeoJsonDataSource.load(geoJsonUrl)
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource)
          viewer.zoomTo(dataSource)
        })
        .otherwise(function (error) {
          console.log(error)
        })
    </script>
  </body>
</html>
```

#### 加载 3D Tiles 数据

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cesium 3D Tiles Example</title>
    <script src="https://cesium.com/downloads/cesiumjs/releases/1.80/Build/Cesium/Cesium.js"></script>
    <link href="https://cesium.com/downloads/cesiumjs/releases/1.80/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
    <style>
      #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script>
      // 初始化Cesium Viewer
      var viewer = new Cesium.Viewer('cesiumContainer')

      // 加载3D Tiles数据
      var tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: 'https://assets.cesium.com/1/tileset.json',
        })
      )

      viewer.zoomTo(tileset)
    </script>
  </body>
</html>
```

#### 加载 KML 数据

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Cesium KML Example</title>
    <script src="https://cesium.com/downloads/cesiumjs/releases/1.80/Build/Cesium/Cesium.js"></script>
    <link href="https://cesium.com/downloads/cesiumjs/releases/1.80/Build/Cesium/Widgets/widgets.css" rel="stylesheet" />
    <style>
      #cesiumContainer {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="cesiumContainer"></div>
    <script>
      // 初始化Cesium Viewer
      var viewer = new Cesium.Viewer('cesiumContainer')

      // 加载KML数据
      var kmlUrl = 'path/to/your/kml/file.kml'
      var kmlDataSource = new Cesium.KmlDataSource()
      kmlDataSource
        .load(kmlUrl)
        .then(function (dataSource) {
          viewer.dataSources.add(dataSource)
          viewer.zoomTo(dataSource)
        })
        .otherwise(function (error) {
          console.log(error)
        })
    </script>
  </body>
</html>
```
