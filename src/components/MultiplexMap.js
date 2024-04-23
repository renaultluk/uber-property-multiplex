import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import "./multiplex-map.css";

const MultiplexMap = () => {
  const ref = useRef();
  const tooltipRef = useRef();
  const titleRef = useRef();

  useEffect(() => {
    const margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

      const svg = d3.select(ref.current)
      const myProjection = d3.geoMercator().scale(60000).translate([77800,47100])
      const path = d3.geoPath().projection(myProjection)

      function drawMap(data) {
        console.log(data)
        svg.append("g")
          .selectAll("path")
          .data(data.features)
          .enter().append("path")
          .attr("class", "taxi-zone")
          .attr("d", path)
          .attr("fill", "#444444")
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
            titleRef.current.innerHTML = datum.properties.zone;
          })
          .on("mouseout", function (d, i) {
            d3.select(this)
              .transition()
              .duration("100")
              .style("fill", "#444444")
              .style("stroke", "#888888")
              .style("stroke-width", "1")

            tooltipRef.current.style.display = "none";
          })
          ;
      }

      d3.json("/shapes.geojson").then(response => drawMap(response))
  }, []);

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
      </div>
      <svg width={700} height={700} id="map" ref={ref} />
    </>
  )
};

export default MultiplexMap;