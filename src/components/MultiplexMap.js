import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import "./multiplex-map.css";

const MultiplexMap = (props) => {
  const ref = useRef();
  const centroidRef = useRef({});
  const tooltipRef = useRef();
  const titleRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

      const svg = d3.select(ref.current)
      const myProjection = d3.geoMercator().scale(60000).translate([77800,47100])
      const path = d3.geoPath().projection(myProjection)

      function drawMap(data) {
        centroidRef.current = {}

        svg.selectAll(".taxi-zone")
          .remove()
        
        svg.append("g")
          .attr("class", "edges");

        svg.append("g")
          .selectAll("path")
          .data(data.features)
          .enter().append("path")
          .attr("class", "taxi-zone")
          .attr("d", path)
          .attr("fill", "rgba(68,68,68,0.5)")
          .attr("stroke-width", "1")
          .attr("stroke", "#888888")
          .on("mouseover", function (event, datum) {
            d3.select(this)
              .transition()
              .duration("100")
              .style("fill", "#FF0000")
              .style("stroke", "#FF5555")
              .style("stroke-width", "2")

            tooltipRef.current.style.left = `${event.clientX + 8}px`;
            tooltipRef.current.style.top = `${event.clientY + 8}px`;
            tooltipRef.current.style.display = "flex";
            titleRef.current.innerHTML = `${datum.properties.location_id}. ${datum.properties.zone}`;
            if (props.edges[datum.properties.location_id]) {
              descriptionRef.current.style.display = "flex"
              descriptionRef.current.innerHTML = `Degree: ${props.edges[datum.properties.location_id].length}\nConnected taxi zones: ${props.edges[datum.properties.location_id]}`
            }
            else {
              descriptionRef.current.style.display = "none"
            }

            var node = datum.properties.location_id;

            svg.select(".edges")
              .selectAll(".connectedEdge")
              .transition()
              .duration("100")
              .style("display", function(d) {
                return (d.source == node || d.target == node) ? "block" : "none"; // Show edges that are connected to the hovered taxi zone
              });
          })
          .on("mouseout", function (d, i) {
            d3.select(this)
              .transition()
              .duration("100")
              .style("fill", "rgba(68,68,68,0.5)")
              .style("stroke", "#888888")
              .style("stroke-width", "1")

            tooltipRef.current.style.display = "none";

            svg.select(".edges")
            .selectAll(".connectedEdge")
            .style("display", "block");
          })
          .each(function (d) {
            centroidRef.current[d.properties.location_id] = myProjection.invert(path.centroid(d.geometry))
          });

          
      }

      d3.json("/shapes.geojson").then(response => drawMap(response))
    }, []);
    
    useEffect(() => {
      console.log("edges changed, update")

      const svg = d3.select(ref.current)
      const myProjection = d3.geoMercator().scale(60000).translate([77800,47100])
      const path = d3.geoPath().projection(myProjection)

      svg.select(".edges").selectAll("path").remove();

      var link = []
        Object.keys(props.edges).forEach((node) => {
          props.edges[node].forEach(function(dest){
            var source = centroidRef.current[node];
            var target = centroidRef.current[dest.toString()];
            if (source !== undefined && target !== undefined) {
              var topush = {
                type: "LineString", 
                coordinates: [source, target],
                source: node,
                target: dest.toString(),
              }
              link.push(topush)
            }
          })
        })
  
        var edges = svg.select(".edges")
          .selectAll("path")
          .data(link)
          .enter()
          .append("path")
          .attr("class", "connectedEdge")
          .attr("d", function(d){ return path(d) })
          .style("fill", "none")
          .style("stroke", "#69b3a2")
          .style("stroke-width", 1)

        edges.raise()
        
          
      
  }, [props.edges])

  return (
    <>
      <div ref={tooltipRef} style={{
          position: "absolute",
          display: "none",
          pointerEvents: "none",
          backgroundColor: "#222222",
          border: "1px solid #888888",
          padding: 4,
          borderRadius: 4,
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: 200,
        }}
      >
        <span 
          ref={titleRef}
          style={{
            fontSize: 10,
            fontWeight: 500,
            color: "#FFFFFF",
          }}
        ></span>
        <span
          ref={descriptionRef}
          style={{
            fontSize: 9,
            color: "#FFFFFF",
            textAlign: "flex-start",
            textWrap: "wrap",
          }}
        ></span>
      </div>
      <svg width={700} height={700} id="map" ref={ref} />
    </>
  )
};

export default MultiplexMap;