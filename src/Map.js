import React, { useRef, useEffect } from 'react'
import { loadModules } from 'esri-loader'

function Map() {
    const MapEl = useRef(null)

    useEffect(() => {
        let view;

        loadModules(["esri/views/MapView", "esri/WebMap", "esri/layers/GeoJSONLayer", "esri/widgets/Home", "esri/widgets/Legend"], {
            css: true
        }).then(([MapView, WebMap, GeoJSONLayer, Home, Legend]) => {
            const webmap = new WebMap({
                basemap: 'topo-vector'
            })

            const template = {
                title: "Earthquake Info",
                content: "Magnitude {mag} {type} hit {place} on {time}",
              };

              const renderer = {
                type: "simple",
                field: "mag",
                symbol: {
                  type: "simple-marker",
                  color: "orange",
                  outline: {
                    color: "white"
                  }
                },
                visualVariables: [
                  {
                    type: "size",
                    field: "mag",
                    stops: [
                      {
                        value: 2.5,
                        size: "4px"
                      },
                      {
                        value: 8,
                        size: "40px"
                      }
                    ]
                  }
                ]
              }

            view = new MapView({
                map: webmap,
                center: [-168, 46],
                zoom:2,
                container: MapEl.current 
            })

            const getjsonlayer = new GeoJSONLayer({
                url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',
                rendered: renderer,
                popupTemplate: template
            })

            webmap.add(getjsonlayer)

            const homeBtn = new Home({
                view: view
              });
      
              // Add the home button to the top left corner of the view
              view.ui.add(homeBtn, "top-left");

              view.when(() => {
                // get the first layer in the collection of operational layers in the WebMap
                // when the resources in the MapView have loaded.
                console.log(webmap, 'webmap')
                const featureLayer = webmap.layers.getItemAt(0);
      
                const legend = new Legend({
                  view: view,
                  layerInfos: [
                    {
                      layer: featureLayer,
                      title: "Earthquakes"
                    }
                  ]
                });
      
                // Add widget to the bottom right corner of the view
                view.ui.add(legend, "bottom-right");
              });
        })

        return () => {
            //close the map view
            if(!!view) {
                view.destroy()
                view = null;
            }
        }
    }, [])

    return (
        <div style={{ height: 600 }} ref={MapEl}>

        </div>
    )
}

export default Map